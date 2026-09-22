import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import { postgrest } from "../../../../server/postgrest";
import { setAuthCookie } from "../../../../server/authCookie";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        const postgrestResponse = await postgrest(`/users?email=eq.${email}`, {
            headers: {
                Accept: "application/vnd.pgrst.object+json",
            },
        });

        if (!postgrestResponse.ok) {
            throw new Error(`PostgREST returned ${postgrestResponse.status}`);
        }

        const user = await postgrestResponse.json();

        if (!user) {
            return Response.json(
                { message: "Email ou senha inválidos" },
                { status: 401 },
            );
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password_hash,
        );

        if (!passwordIsValid) {
            return Response.json(
                { message: "Email ou senha inválidos" },
                { status: 401 },
            );
        }

        setAuthCookie(cookies, user.id);

        return Response.json({ message: "Login realizado com sucesso" });
    } catch (error) {
        console.error("Failed to authenticate user:", error);

        return Response.json(
            { message: "Não foi possível realizar o login" },
            { status: 500 },
        );
    }
};
