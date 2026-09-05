import { useEffect, useState, type SubmitEvent } from "react";
import { type BoardColorKey } from "../constants/boardColors";
import CloseIcon from "./svgs/CloseIcon";
import useForm from "../hooks/useForm";
import Input from "./form/Input";
import { TASK_PATCH } from "../api";
import DescriptionArea from "./form/DescriptionArea";
import TaskCard from "./TaskCard";
import ColorsPreview from "./ColorsPreview";
import type ITask from "../interfaces/ITask";

interface IUpdateTaskModalProps {
    open: boolean;
    onClose: () => void;
    boardId: number;
    task_id: number;
    titleProps: string;
    descriptionProps: string;
    colorKey: BoardColorKey;
    updateTask: (updatedTask: ITask) => void;
}

const UpdateTaskModal = ({
    open,
    onClose,
    boardId,
    colorKey,
    task_id,
    updateTask,
    titleProps,
    descriptionProps,
}: IUpdateTaskModalProps) => {
    const title = useForm("");
    const description = useForm("");
    const [color_key, setColor_key] = useState<BoardColorKey>(colorKey);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.validate() || !description.validate()) return;

        try {
            setLoading(true);
            setError(null);

            const { url, options } = TASK_PATCH(boardId, task_id, {
                title: title.value,
                description: description.value,
                color_key,
            });

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error("Não foi atualizar a task.");
            }

            const updatedTask = await response.json();

            updateTask(updatedTask);
            onClose();
        } catch (err) {
            if (err instanceof Error) setError(err.message);

            setError("Não foi atualizar a task.");
        } finally {
            setLoading(false);
        }
    };

    const setTitleValue = title.setValue;
    const setDescriptionValue = description.setValue;

    useEffect(() => {
        if (!open) return;

        setTitleValue(titleProps);
        setDescriptionValue(descriptionProps);
    }, [
        open,
        titleProps,
        descriptionProps,
        setTitleValue,
        setDescriptionValue,
    ]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="w-full max-w-5xl rounded-lg bg-gray-300 p-5">
                <header className="w-full flex justify-between">
                    <h1 className="text-2xl">Update Task</h1>

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

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <DescriptionArea
                            value={description.value}
                            error={description.error}
                            onChange={description.onChange}
                        />

                        <TaskCard
                            title={title.value}
                            description={description.value}
                            colorKey={color_key}
                            isPreview
                            boardId={boardId}
                        />
                    </div>

                    <ColorsPreview
                        setColor_key={setColor_key}
                        color_key={color_key}
                    />

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

export default UpdateTaskModal;
