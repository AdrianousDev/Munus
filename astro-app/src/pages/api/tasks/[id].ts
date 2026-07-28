import type { APIRoute } from "astro";
import { postgrest } from "../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
    const id = params.id;

    const response = await postgrest(
        `/tasks?id=eq.${encodeURIComponent(id!)}`,
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
};

export const PATCH: APIRoute = async ({ params, request }) => {
    const id = params.id;
    const updates = await request.json();

    const response = await postgrest(
        `/tasks?id=eq.${encodeURIComponent(id!)}`,
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

    const body = await response.text();

    return new Response(body, {
        status: response.status,
        headers: {
            "Content-Type":
                response.headers.get("content-type") ?? "application/json",
        },
    });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return Response.json(
            { message: "Task ID is required" },
            { status: 400 },
        );
    }

    try {
        const response = await postgrest(
            `/tasks?id=eq.${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/vnd.pgrst.object+json",
                    Prefer: "return=representation",
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
        console.error("Failed to delete task:", error);

        return Response.json(
            { message: "Could not delete task" },
            { status: 502 },
        );
    }
};
