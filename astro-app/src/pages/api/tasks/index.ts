import type { APIRoute } from "astro";
import { postgrest } from "../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const postgrestResponse = await postgrest("/tasks?order=id.asc");

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
        console.error("Failed to fetch tasks from PostgREST:", error);

        return Response.json(
            {
                message: "Could not fetch tasks",
            },
            {
                status: 502,
            },
        );
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const { title, description } = await request.json();

        const postgrestResponse = await postgrest("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/vnd.pgrst.object+json",
                Prefer: "return=representation",
            },
            body: JSON.stringify({
                title,
                description,
            }),
        });

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
        console.error("Failed to create task:", error);

        return Response.json(
            { message: "Could not create task" },
            { status: 502 },
        );
    }
};
