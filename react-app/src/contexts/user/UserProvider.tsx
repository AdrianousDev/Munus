import {
    useCallback,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";
import { UserContext } from "./UserContext";
import type IUser from "../../interfaces/IUser";
import {
    BOARDS_GET,
    LOGIN_POST,
    POST_LOGOUT,
    USER_GET,
    USER_POST,
} from "../../api";
import { useNavigate } from "react-router-dom";
import type IBoard from "../../interfaces/IBoard";

const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [boards, setBoards] = useState<IBoard[] | null>(null);

    const navigate = useNavigate();

    const fetchUser = async (): Promise<IUser> => {
        const { url, options } = USER_GET();
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Usuário não autenticado");
        }

        return response.json();
    };

    const fetchUserBoards = async (): Promise<IBoard[]> => {
        const { url, options } = BOARDS_GET();
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Não foi possível carregar os boards");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Formato de boards inválido");
        }

        return data as IBoard[];
    };

    const loadUserSession = useCallback(async (): Promise<void> => {
        const currentUser = await fetchUser();

        const currentBoards = await fetchUserBoards();

        setUser(currentUser);
        setBoards(currentBoards);
        setIsLogged(true);
    }, []);

    const userLogin = async (
        email: string,
        password: string,
    ): Promise<void> => {
        try {
            setError(null);
            setLoading(true);

            const { url, options } = LOGIN_POST({ email, password });
            const loginResponse = await fetch(url, options);

            if (!loginResponse.ok) {
                throw new Error("Usuário inválido");
            }

            await loadUserSession();
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro ao logar usuário.");
            }

            setIsLogged(false);
        } finally {
            setLoading(false);
        }
    };

    const userLogout = async (): Promise<void> => {
        try {
            setError(null);
            setLoading(true);

            const { url, options } = POST_LOGOUT();

            const response = await fetch(url, options);

            if (!response.ok) {
                const body = await response.json().catch(() => null);

                throw new Error(
                    body?.message ?? "Não foi possível realizar o logout",
                );
            }

            setUser(null);
            setIsLogged(false);
            navigate("/login", { replace: true });
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Não foi possível realizar o logout",
            );
        } finally {
            setLoading(false);
        }
    };

    const userRegister = async (
        username: string,
        email: string,
        password: string,
    ) => {
        try {
            const { url, options } = USER_POST({
                username,
                email,
                password,
            });

            const response = await fetch(url, options);

            if (response.ok) userLogin(email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro ao logar usuário.");
            }

            setIsLogged(false);
        } finally {
            setLoading(false);
        }
    };

    const addBoard = (newBoard: IBoard) => {
        setBoards((currentBoards) => [...(currentBoards ?? []), newBoard]);
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                await loadUserSession();
            } catch {
                setUser(null);
                setBoards(null);
                setIsLogged(false);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [loadUserSession]);

    return (
        <UserContext.Provider
            value={{
                user,
                boards,
                error,
                loading,
                isLogged,
                userLogin,
                userLogout,
                userRegister,
                addBoard,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
