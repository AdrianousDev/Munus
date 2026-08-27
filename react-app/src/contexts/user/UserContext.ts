import { createContext } from "react";
import type IUser from "../../interfaces/IUser";
import type Board from "../../interfaces/IBoard";
import type IBoard from "../../interfaces/IBoard";

interface UserContextValue {
    user: IUser | null;
    boards: Board[] | null;
    loading: boolean;
    isLogged: boolean;
    error: string | null;
    userLogin: (email: string, password: string) => Promise<void>;
    userLogout: () => Promise<void>;
    userRegister: (
        username: string,
        email: string,
        password: string,
    ) => Promise<void>;
    addBoard: (board: IBoard) => void;
}

export const UserContext = createContext<UserContextValue | null>(null);
