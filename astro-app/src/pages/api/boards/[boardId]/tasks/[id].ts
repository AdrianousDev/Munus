import type { APIRoute } from "astro";
import { postgrest } from "../../../../../server/postgrest";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
    const taskId = Number(params.id);
    const { boardId } = locals;

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
        return Response.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const response = await postgrest(
            `/tasks?select=id,title,description,completed,boards!inner()` +
                `&id=eq.${taskId}` +
                `&board_id=eq.${boardId}` +
                `&boards.user_id=eq.${locals.userId}`,
            {
                headers: {
                    Accept: "application/vnd.pgrst.object+json",
                },
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
        console.error("Failed to find task:", error);

        return Response.json(
            { message: "Could not find task" },
            { status: 502 },
        );
    }
};

export const PATCH: APIRoute = async ({ params, locals, request }) => {
    const taskId = Number(params.id);
    const { boardId } = locals;

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
        return Response.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const updates = await request.json();

        const response = await postgrest(
            `/tasks?id=eq.${taskId}&board_id=eq.${boardId}&select=id,title,description,color_key,completed`,
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
        console.error("Failed to update task:", error);

        return Response.json(
            { message: "Could not update task" },
            { status: 502 },
        );
    }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
    const taskId = Number(params.id);
    const boardId = locals.boardId;

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
        return Response.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const response = await postgrest(
            `/tasks?id=eq.${taskId}&board_id=eq.${boardId}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/vnd.pgrst.object+json",
                    Prefer: "return=representation",
                },
            },
        );

        if (response.status === 406) {
            return Response.json(
                { message: "Task não encontrada" },
                { status: 404 },
            );
        }

        if (!response.ok) {
            return Response.json(
                { message: "Não foi possível excluir a task" },
                { status: 502 },
            );
        }

        return Response.json(
            { message: "Task excluída com sucesso" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to delete task:", error);

        return Response.json(
            { message: "Could not delete task" },
            { status: 502 },
        );
    }
};
