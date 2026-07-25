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
