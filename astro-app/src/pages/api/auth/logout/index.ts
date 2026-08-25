import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
    cookies.delete("access_token", {
        path: "/",
    });

    return Response.json({
        message: "Logout realizado com sucesso",
    });
};
