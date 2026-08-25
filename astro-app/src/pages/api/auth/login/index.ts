import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { postgrest } from "../../../../server/postgrest";

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

        const token = JWT.sign(
            {
                id: user.id,
            },
            import.meta.env.JWT_SECRET_KEY,
            { expiresIn: "1h", issuer: "munus", audience: "munus-api" },
        );

        cookies.set("access_token", token, {
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        return Response.json({ message: "Login realizado com sucesso" });
    } catch (error) {
        console.error("Failed to authenticate user:", error);

        return Response.json(
            { message: "Não foi possível realizar o login" },
            { status: 500 },
        );
    }
};
