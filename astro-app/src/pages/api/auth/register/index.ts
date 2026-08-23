import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { postgrest } from "../../../../server/postgrest";

export const prerender = false;

const SALT_ROUNDS = 12;

export const POST: APIRoute = async ({ request }) => {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string") {
        return Response.json(
            { message: "Email e senha são obrigatórios" },
            { status: 400 },
        );
    }

    if (password.trim().length < 8) {
        return Response.json(
            { message: "A senha deve possuir pelo menos 8 caracteres" },
            { status: 400 },
        );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        const postgrestResponse = await postgrest("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify({
                email,
                password_hash: passwordHash,
            }),
        });

        if (!postgrestResponse.ok) {
            if (postgrestResponse.status === 409) {
                return Response.json(
                    { message: "Não foi possível cadastrar esse usuário" },
                    { status: 409 },
                );
            }

            return Response.json(
                { message: "Não foi possível criar o usuário" },
                { status: 502 },
            );
        }

        return Response.json(
            {
                message:
                    "Usuário criado com sucesso. Você já pode fazer login.",
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Failed to create user:", error);

        return Response.json(
            { message: "Could not create user" },
            { status: 502 },
        );
    }
};
