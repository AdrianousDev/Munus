import type { AstroCookies } from "astro";
import JWT from "jsonwebtoken";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const ACCESS_TOKEN_RENEW_THRESHOLD_SECONDS = 15 * 60;

export function clearAuthCookie(cookies: AstroCookies): void {
    cookies.delete("access_token", {
        path: "/",
    });
}

function createAccessToken(userId: number): string {
    return JWT.sign({ id: userId }, import.meta.env.JWT_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuer: "munus",
        audience: "munus-api",
    });
}

export function setAuthCookie(cookies: AstroCookies, userId: number): void {
    const token = createAccessToken(userId);

    cookies.set("access_token", token, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_TTL_SECONDS,
    });
}
