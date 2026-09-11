import type { APIRoute } from "astro";
import { postgrest } from "../../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
    try {
        const response = await postgrest(
            `/users?id=eq.${locals.userId}&select=id,email,username,created_at`,
            {
                headers: {
                    Accept: "application/vnd.pgrst.object+json",
                },
            },
        );

        if (response.status === 406) {
            return Response.json(
                { message: "Usuário não encontrado" },
                { status: 404 },
            );
        }

        if (!response.ok) {
            throw new Error(`PostgREST returned ${response.status}`);
        }

        const user = await response.json();

        return Response.json(user, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Failed to fetch authenticated user:", error);

        return Response.json(
            { message: "Não foi possível buscar os dados do usuário" },
            { status: 502 },
        );
    }
};

export const PATCH: APIRoute = async ({ locals, request }) => {
    try {
        const { newUsername } = await request.json();

        if (typeof newUsername !== "string" || newUsername.trim().length > 50) {
            return Response.json(
                { message: "O username deve possuir entre 1 e 50 caracteres" },
                { status: 400 },
            );
        }

        const normalizedUsername = newUsername.trim();

        const response = await postgrest(
            `/users?id=eq.${locals.userId}&select=id,email,username,created_at`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.pgrst.object+json",
                    Prefer: "return=representation",
                },
                body: JSON.stringify({ username: normalizedUsername }),
            },
        );

        if (!response.ok) {
            throw new Error(
                `PostgREST respondeu com status ${response.status}`,
            );
        }

        const body = await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to update username:", error);

        return Response.json(
            { message: "Could not username" },
            { status: 502 },
        );
    }
};
