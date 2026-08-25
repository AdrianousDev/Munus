export const API_URL = import.meta.env.VITE_API_BASE_URL;

interface IApiRequestConfig {
    url: string;
    options: RequestInit;
}

interface ILoginPostBody {
    email: string;
    password: string;
}

export const LOGIN_POST = (body: ILoginPostBody): IApiRequestConfig => {
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
