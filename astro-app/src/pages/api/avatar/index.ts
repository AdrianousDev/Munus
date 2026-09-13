import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { readFile } from "node:fs/promises";

export const prerender = false;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedFormats = new Set(["jpeg", "png", "webp"]);
const maxFileSize = 5 * 1024 * 1024;
const maxInputPixels = 25_000_000;

export const POST: APIRoute = async ({ request, locals }) => {
    let temporaryFilePath: string | undefined;

    try {
        const formData = await request.formData();
        const avatar = formData.get("avatar");

        if (!(avatar instanceof File)) {
            return Response.json(
                { error: "Nenhuma imagem foi enviada." },
                { status: 400 },
            );
        }

        if (!allowedMimeTypes.has(avatar.type)) {
            return Response.json(
                { error: "Formato inválido. Use JPEG, PNG ou WebP." },
                { status: 415 },
            );
        }

        if (avatar.size === 0) {
            return Response.json(
                { error: "A imagem enviada está vazia." },
                { status: 400 },
            );
        }

        if (avatar.size > maxFileSize) {
            return Response.json(
                { error: "A imagem deve ter no máximo 5 MB." },
                { status: 413 },
            );
        }

        const uploadDirectory = path.join(process.cwd(), "uploads", "avatar");

        await mkdir(uploadDirectory, { recursive: true });

        const inputBuffer = Buffer.from(await avatar.arrayBuffer());
        let webpBuffer: Buffer;

        try {
            const image = sharp(inputBuffer, {
                limitInputPixels: maxInputPixels,
            });
            const metadata = await image.metadata();

            if (!metadata.format || !allowedFormats.has(metadata.format)) {
                return Response.json(
                    { error: "O conteúdo enviado não é JPEG, PNG ou WebP." },
                    { status: 415 },
                );
            }

            webpBuffer = await image
                .rotate()
                .resize(512, 512, {
                    fit: "cover",
                    withoutEnlargement: true,
                })
                .webp({ quality: 85 })
                .toBuffer();
        } catch {
            return Response.json(
                {
                    error: "Imagem inválida, corrompida ou com dimensões excessivas.",
                },
                { status: 422 },
            );
        }

        const filename = `${locals.userId}.webp`;
        const filePath = path.join(uploadDirectory, filename);

        temporaryFilePath = path.join(
            uploadDirectory,
            `.${locals.userId}-${randomUUID()}.tmp`,
        );

        await writeFile(temporaryFilePath, webpBuffer, { flag: "wx" });
        await rename(temporaryFilePath, filePath);
        temporaryFilePath = undefined;

        await Promise.all(
            [".jpg", ".jpeg", ".png"].map((extension) =>
                rm(path.join(uploadDirectory, `${locals.userId}${extension}`), {
                    force: true,
                }),
            ),
        );

        return Response.json(
            {
                message: "Avatar salvo com sucesso.",
                filename,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Erro ao salvar avatar:", error);

        return Response.json(
            { error: "Não foi possível salvar o avatar." },
            { status: 500 },
        );
    } finally {
        if (temporaryFilePath) {
            try {
                await rm(temporaryFilePath, { force: true });
            } catch (error) {
                console.error("Erro ao remover arquivo temporário:", error);
            }
        }
    }
};

export const GET: APIRoute = async ({ locals }) => {
    const filename = `${locals.userId}.webp`;
    const filePath = path.join(process.cwd(), "uploads", "avatar", filename);

    try {
        const file = await readFile(filePath);

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": "image/webp",
                "Content-Length": String(file.byteLength),
                "Content-Disposition": `inline; filename="${filename}"`,
                "Cache-Control": "private, no-cache",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        const code =
            error instanceof Error && "code" in error ? error.code : undefined;

        if (code === "ENOENT") {
            return new Response("Avatar não encontrado.", {
                status: 404,
            });
        }

        console.error("Erro ao carregar avatar:", error);

        return new Response("Erro ao carregar avatar.", {
            status: 500,
        });
    }
};
