import { useState, type SubmitEvent } from "react";
import useUser from "../contexts/user/useUser";
import { USERNAME_PATCH } from "../api";
import { SaveIcon } from "lucide-react";
import type IUser from "../interfaces/IUser";
import Avatar from "./Avatar";

const UserProfile = () => {
    const { user, userLogout, changeUsername } = useUser();

    const formattedUsername = user?.username.split(" ")[0];

    const [username, setUsername] = useState<string | undefined>(
        user?.username,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const normalizedUsername = username?.trim() ?? "";
    const hasChanges = normalizedUsername !== (user?.username ?? "");
    const canSubmit = hasChanges && normalizedUsername.length > 0 && !loading;

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        if (!username || !username?.trim()) return;

        try {
            setError(null);
            setLoading(true);

            const { url, options } = USERNAME_PATCH(username);
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error("Erro na resposta do servidor.");
            }

            const updatedUser: IUser = await response.json();
            changeUsername(updatedUser.username);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar nome do usuário.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex h-full min-h-0 flex-col">
            <h1 className="shrink-0 font-sans text-4xl">
                This is your profile, {formattedUsername}.
            </h1>

            <div className="bg-gray-200 text-xl mt-10 py-10 px-30 min-h-0 flex-1 flex flex-col items-center gap-5 rounded-lg">
                <div className="mb-2.5">
                    <Avatar />
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <label htmlFor="name">Name</label>
                    <div className="flex">
                        <input
                            className="h-14 w-full rounded-l-lg bg-white p-5 font-sans"
                            type="text"
                            name="name"
                            id="name"
                            value={username ?? ""}
                            disabled={loading}
                            onChange={({ target }) => setUsername(target.value)}
                        />

                        <button
                            type="submit"
                            aria-label="Salvar nome"
                            title="Salvar nome"
                            disabled={!canSubmit}
                            className="flex h-14 w-16 items-center justify-center rounded-r-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {loading ? (
                                <span
                                    aria-hidden="true"
                                    className="size-6 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                />
                            ) : (
                                <SaveIcon />
                            )}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-600 text-center mt-1">{error}</p>
                    )}
                </form>

                <div className="w-full">
                    <label htmlFor="email">Email</label>
                    <input
                        className="w-full bg-white h-14 rounded-lg p-5 font-sans disabled:cursor-not-allowed disabled:bg-gray-300"
                        type="email"
                        name="email"
                        id="email"
                        value={user?.email}
                        disabled
                    />
                </div>

                <button
                    className="bg-gray-400 hover:bg-gray-500 transition py-4 px-8 w-full rounded-lg font-medium cursor-pointer"
                    onClick={() => userLogout()}
                >
                    Logout
                </button>
            </div>
        </section>
    );
};

export default UserProfile;
