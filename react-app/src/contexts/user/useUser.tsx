import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error("useUser deve ser usado dentro de UserProvider");
    }

    return context;
}
