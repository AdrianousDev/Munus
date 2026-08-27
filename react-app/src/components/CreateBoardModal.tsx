import { useState, type SubmitEvent } from "react";
import { BOARD_COLORS, type BoardColorKey } from "../constants/boardColors";
import useForm from "../hooks/useForm";
import Input from "./form/Input";
import CloseIcon from "./svgs/CloseIcon";
import { BOARD_POST } from "../api";
import useUser from "../contexts/user/useUser";

interface CreateBoardModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateBoardModal = ({ open, onClose }: CreateBoardModalProps) => {
    const title = useForm("");
    const [color_key, setColor_key] = useState<BoardColorKey | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const { addBoard } = useUser();

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.validate() || !color_key) return;

        try {
            setLoading(true);
            setError(null);

            const { url, options } = BOARD_POST({
                title: title.value,
                color_key,
            });

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error("Não foi possível criar um novo Board.");
            }

            const newBoard = await response.json();

            addBoard(newBoard);
            onClose();
        } catch (err) {
            if (err instanceof Error) setError(err.message);

            setError("Não foi possível criar um novo Board.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
            <div className="rounded-lg bg-gray-300 p-5 w-full max-w-2xl">
                <header className="w-full flex justify-between">
                    <h1 className="text-2xl">Add Board</h1>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer"
                    >
                        <CloseIcon />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5">
                    <Input type="text" name="title" label="Title" {...title} />

                    <div className="mt-5 grid grid-cols-4 gap-2.5 ">
                        {Object.entries(BOARD_COLORS).map(([chave, valor]) => (
                            <span
                                className={`block px-5 py-2.5 rounded-lg text-center ${chave === color_key ? "outline-2 shadow" : ""}`}
                                style={{ backgroundColor: valor }}
                                key={chave}
                                onClick={() =>
                                    setColor_key((currentValue) =>
                                        currentValue === chave
                                            ? null
                                            : (chave as BoardColorKey),
                                    )
                                }
                            >
                                {chave}
                            </span>
                        ))}
                    </div>

                    {loading ? (
                        <button
                            disabled
                            className="mt-5 w-full flex items-center justify-center rounded-lg px-16 py-3 font-sans font-bold shadow disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <span
                                aria-hidden="true"
                                className="block size-6 animate-spin rounded-full border-2 border-gray-400 border-t-white"
                            />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!(title.value && color_key)}
                            className="mt-5 w-full rounded-lg bg-primary px-16 py-3 font-sans font-bold shadow cursor-pointer transition disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            SUBMIT
                        </button>
                    )}

                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;
