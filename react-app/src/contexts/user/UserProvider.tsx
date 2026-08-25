import { useEffect, useState, type PropsWithChildren } from "react";
import { UserContext } from "./UserContext";
import type IUser from "../../interfaces/IUser";
import { API_URL, LOGIN_POST, USER_GET } from "../../api";
import { useNavigate } from "react-router-dom";

const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const getUser = async () => {
        const { url, options } = USER_GET();
        const response = await fetch(url, options);
        const json = await response.json();
        setUser(json);
        setIsLogged(true);
    };

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
                throw new Error(`Error: Usuário inválido`);
            }

            await getUser();

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

    const userLogout = async () => {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Não foi possível realizar o logout");
        }

        setUser(null);
        setIsLogged(false);
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { url, options } = USER_GET();
                const response = await fetch(url, options);

                if (!response.ok) {
                    setIsLogged(false);
                    return;
                }

                const user = await response.json();

                setUser(user);
                setIsLogged(true);
            } catch {
                setIsLogged(false);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <UserContext.Provider
            value={{ user, error, loading, isLogged, userLogin, userLogout }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
