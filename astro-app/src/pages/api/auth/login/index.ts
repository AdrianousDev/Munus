import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { postgrest } from "../../../../server/postgrest";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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

        const token = JWT.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.created_at,
            },
            import.meta.env.JWT_SECRET_KEY,
            { expiresIn: "1h" },
        );

        return Response.json({ token });
    } catch (error) {
        console.error("Failed to authenticate user:", error);

        return Response.json(
            { message: "Não foi possível realizar o login" },
            { status: 500 },
        );
    }
};
