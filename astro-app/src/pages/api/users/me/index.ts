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
