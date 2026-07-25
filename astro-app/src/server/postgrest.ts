const postgrestUrl = import.meta.env.POSTGREST_URL;

if (!postgrestUrl) {
    throw new Error("POSTGREST_URL is not configured");
}

export const postgrest = (
    path: string,
    requestInit?: RequestInit,
): Promise<Response> => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return fetch(`${postgrestUrl}${normalizedPath}`, requestInit);
};
