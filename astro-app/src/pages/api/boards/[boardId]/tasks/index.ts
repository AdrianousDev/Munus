import type { APIRoute } from "astro";
import { postgrest } from "../../../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
    const { boardId } = locals;

    try {
        const tasksResponse = await postgrest(
            `/tasks?board_id=eq.${boardId}` +
                `&select=id,board_id,title,description,completed` +
                `&order=id.asc`,
        );

        if (!tasksResponse.ok) {
            return Response.json(
                { message: "Não foi possível buscar as tasks" },
                { status: 502 },
            );
        }

        const tasks = await tasksResponse.json();

        return Response.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch tasks from PostgREST:", error);

        return Response.json(
            { message: "Não foi possível buscar as tasks" },
            { status: 502 },
        );
    }
};

export const POST: APIRoute = async ({ request, locals }) => {
    const { boardId } = locals;

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
                board_id: boardId,
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
