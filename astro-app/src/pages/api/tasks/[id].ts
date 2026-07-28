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
