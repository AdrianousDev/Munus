import type { APIRoute } from "astro";
import { postgrest } from "../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
    const { boardId } = locals;

    try {
        const response = await postgrest(
            `/boards?id=eq.${boardId}&select=id,title,created_at`,
            {
                headers: {
                    Accept: "application/vnd.pgrst.object+json",
                },
            },
        );

        const body = await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to fetch board:", error);

        return Response.json(
            { message: "Não foi possível buscar o board" },
            { status: 502 },
        );
    }
};

export const PATCH: APIRoute = async ({ locals, request }) => {
    const { boardId } = locals;

    try {
        const updates = await request.json();

        const response = await postgrest(
            `/boards?id=eq.${boardId}&select=id,title,color_key,created_at`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.pgrst.object+json",
                    Prefer: "return=representation",
                },
                body: JSON.stringify(updates),
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
        console.error("Failed to update board:", error);

        return Response.json(
            { message: "Could not update board" },
            { status: 502 },
        );
    }
};
