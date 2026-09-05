import Markdown from "react-markdown";
import { BOARD_COLORS, type BoardColorKey } from "../constants/boardColors";
import { useState } from "react";
import UpdateTaskModal from "./UpdateTaskModal";
import type ITask from "../interfaces/ITask";

interface TaskCardProps {
    id?: number;
    title: string;
    description: string;
    colorKey: BoardColorKey;
    isPreview?: boolean;
    boardId: number;
    updateTask?: (updatedTask: ITask) => void;
}

const TaskCard = ({
    id,
    title,
    description,
    colorKey,
    isPreview = false,
    boardId,
    updateTask,
}: TaskCardProps) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const backgroundColor = colorKey
        ? BOARD_COLORS[colorKey]
        : BOARD_COLORS.yellow;

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <article
            className={`
                h-96
                overflow-y-auto
                scrollbar-none
                rounded-lg
                p-5
                shadow-xl
                ${isPreview ? "" : "cursor-pointer"}
                
            `}
            style={{ backgroundColor }}
            onClick={isPreview ? undefined : openUpdateModal}
        >
            <h2 className="wrap-break-word text-center text-2xl font-bold">
                {title || "Título da tarefa"}
            </h2>

            <div className="my-3 h-0.5 bg-black/30" />

            <div className="wrap-break-word">
                {description ? (
                    <Markdown
                        components={{
                            h1: ({ children }) => (
                                <h1 className="my-2 text-2xl font-bold">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="my-2 text-xl font-bold">
                                    {children}
                                </h2>
                            ),
                            p: ({ children }) => (
                                <p className="my-2">{children}</p>
                            ),
                            ul: ({ children }) => (
                                <ul className="my-2 list-disc pl-6">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="my-2 list-decimal pl-6">
                                    {children}
                                </ol>
                            ),
                        }}
                    >
                        {description}
                    </Markdown>
                ) : (
                    <p className="text-black/50">A descrição aparecerá aqui.</p>
                )}
            </div>

            {isPreview ? null : (
                <UpdateTaskModal
                    open={showUpdateModal}
                    onClose={closeUpdateModal}
                    titleProps={title}
                    descriptionProps={description}
                    colorKey={colorKey}
                    boardId={boardId}
                    task_id={id as number}
                    updateTask={updateTask!}
                />
            )}
        </article>
    );
};

export default TaskCard;
