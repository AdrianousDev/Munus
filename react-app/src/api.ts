import type { BoardColorKey } from "./constants/boardColors";

export const API_URL = import.meta.env.VITE_API_BASE_URL;

interface IApiRequestConfig {
    url: string;
    options: RequestInit;
}

export const LOGIN_POST = (body: {
    email: string;
    password: string;
}): IApiRequestConfig => {
    return {
        url: `${API_URL}/auth/login`,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        },
    };
};

export const POST_LOGOUT = (): IApiRequestConfig => {
    return {
        url: `${API_URL}/auth/logout`,
        options: {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        },
    };
};

export const USER_GET = (): IApiRequestConfig => {
    return {
        url: `${API_URL}/users/me`,
        options: {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        },
    };
};

export const USER_POST = (body: {
    username: string;
    email: string;
    password: string;
}): IApiRequestConfig => {
    return {
        url: `${API_URL}/auth/register`,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
    };
};

export const BOARDS_GET = (): IApiRequestConfig => {
    return {
        url: `${API_URL}/boards`,
        options: {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        },
    };
};

export const BOARD_POST = (body: {
    title: string;
    color_key: BoardColorKey;
}): IApiRequestConfig => {
    return {
        url: `${API_URL}/boards`,
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        },
    };
};
