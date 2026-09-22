import type { APIRoute } from "astro";
import { clearAuthCookie } from "../../../../server/authCookie";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
    clearAuthCookie(cookies);

    return Response.json({
        message: "Logout realizado com sucesso",
    });
};
