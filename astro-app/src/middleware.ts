import { defineMiddleware } from "astro:middleware";
import JWT from "jsonwebtoken";

export const onRequest = defineMiddleware(async (context, next) => {
    const { routePattern } = context;

    if (
        routePattern === "/api/auth/register" ||
        routePattern === "/api/auth/login"
    ) {
        return next();
    }

    const authorization = context.request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return Response.json(
            { message: "Token não informado" },
            { status: 401 },
        );
    }

    const token = authorization.slice("Bearer ".length);

    try {
        const decoded = JWT.verify(token, import.meta.env.JWT_SECRET_KEY);

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
