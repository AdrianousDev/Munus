import { defineMiddleware, sequence } from "astro:middleware";
import JWT from "jsonwebtoken";
import { postgrest } from "./server/postgrest";

const authenticateUser = defineMiddleware(async (context, next) => {
    const { routePattern } = context;

    if (!context.url.pathname.startsWith("/api/")) {
        return next();
    }

    if (
        routePattern === "/api/auth/register" ||
        routePattern === "/api/auth/login" ||
        routePattern === "/api/auth/logout"
    ) {
        return next();
    }

    const token = context.cookies.get("access_token")?.value;

    if (!token) {
        return Response.json({ message: "Não autenticado" }, { status: 401 });
    }

    try {
        const decoded = JWT.verify(token, import.meta.env.JWT_SECRET_KEY, {
            issuer: "munus",
            audience: "munus-api",
        });

        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "number" ||
            !Number.isSafeInteger(decoded.id) ||
            decoded.id <= 0
        ) {
            return Response.json(
                { message: "Token inválido" },
                { status: 401 },
            );
        }

        if (!decoded.id) throw new Error("Invalid user ID");

        context.locals.userId = decoded.id;

        return next();
    } catch (error) {
        if (!(error instanceof JWT.JsonWebTokenError)) {
            console.error("Unexpected authentication error:", error);
        }

        return Response.json(
            { message: "Token inválido ou expirado" },
            { status: 401 },
        );
    }
});

const authorizeBoardOwner = defineMiddleware(async (context, next) => {
    const isBoardRoute = context.routePattern === "/api/boards/[id]";

    const isNestedBoardRoute = context.routePattern.startsWith(
        "/api/boards/[boardId]/",
    );

    if (!isBoardRoute && !isNestedBoardRoute) {
        return next();
    }

    const id = context.params.boardId ?? context.params.id;

    const boardId = Number(id);

    if (!Number.isSafeInteger(boardId) || boardId <= 0) {
        return Response.json({ message: "Board ID inválido" }, { status: 400 });
    }

    const boardResponse = await postgrest(
        `/boards?id=eq.${boardId}` +
            `&user_id=eq.${context.locals.userId}` +
            `&select=id`,
        {
            method: "HEAD",
            headers: {
                Accept: "application/vnd.pgrst.object+json",
            },
        },
    );

    if (boardResponse.status === 406) {
        return Response.json(
            { message: "Board não encontrado" },
            { status: 404 },
        );
    }

    if (!boardResponse.ok) {
        return Response.json(
            { message: "Não foi possível validar o board" },
            { status: 502 },
        );
    }

    context.locals.boardId = boardId;

    return next();
});

export const onRequest = sequence(authenticateUser, authorizeBoardOwner);
