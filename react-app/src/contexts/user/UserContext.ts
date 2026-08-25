import { createContext } from "react";
import type IUser from "../../interfaces/IUser";

interface UserContextValue {
    user: IUser | null;
    loading: boolean;
    isLogged: boolean;
    error: string | null;
    userLogin: (email: string, password: string) => Promise<void>;
    userLogout: () => Promise<void>;
}

export const UserContext = createContext<UserContextValue | null>(null);
