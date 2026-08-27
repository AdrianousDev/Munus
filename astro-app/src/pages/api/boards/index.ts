import type { APIRoute } from "astro";
import { postgrest } from "../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
    const { userId } = locals;

    try {
        const postgrestResponse = await postgrest(
            `/boards?user_id=eq.${userId}`,
        );

        const body = await postgrestResponse.text();

        return new Response(body, {
            status: postgrestResponse.status,
            headers: {
                "Content-Type":
                    postgrestResponse.headers.get("content-type") ??
                    "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to fetch user boards from PostgREST:", error);

        return Response.json(
            {
                message: "Could not fetch user boards",
            },
            {
                status: 502,
            },
        );
    }
};

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { title, color_key } = await request.json();

        const postgrestResponse = await postgrest(
            "/boards?select=id,title,color_key,created_at",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.pgrst.object+json",
                    Prefer: "return=representation",
                },
                body: JSON.stringify({
                    title,
                    color_key,
                    user_id: locals.userId,
                }),
            },
        );

        const body = await postgrestResponse.text();

        return new Response(body, {
            status: postgrestResponse.status,
            headers: {
                "Content-Type":
                    postgrestResponse.headers.get("content-type") ??
                    "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to create board:", error);

        return Response.json(
            { message: "Could not create board" },
            { status: 502 },
        );
    }
};
