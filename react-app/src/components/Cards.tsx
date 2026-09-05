import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TASKS_GET } from "../api";
import type ITask from "../interfaces/ITask";
import useUser from "../contexts/user/useUser";
import type IBoard from "../interfaces/IBoard";
import AddTaskIcon from "./svgs/AddTaskIcon";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const Cards = () => {
    const { id } = useParams();

    const [tasks, setTasks] = useState<ITask[]>([]);
    const [board, setBoard] = useState<IBoard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { boards } = useUser();

    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const openCreateTaskModal = () => {
        setIsCreateTaskOpen(true);
    };

    const closeCreateTaskModal = () => {
        setIsCreateTaskOpen(false);
    };

    const addTask = (task: ITask) => {
        setTasks((currentTasks) => [...currentTasks, task]);
    };

    const updateTask = (updatedTask: ITask) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task,
            ),
        );
    };

    useEffect(() => {
        if (boards === null) return;

        const loadTasks = async () => {
            try {
                setLoading(true);
                setError(null);

                const boardId = Number(id);

                const foundBoard = boards.find((board) => board.id === boardId);

                if (!foundBoard) {
                    throw new Error("Board não encontrado.");
                }

                setBoard(foundBoard);

                const { url, options } = TASKS_GET(boardId);
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error("Erro ao carregar tasks.");
                }

                const json = await response.json();

                setTasks(json);
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Ocorreu um erro inesperado.",
                );
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, [id, boards]);

    if (loading) {
        return (
            <section className="flex h-full min-h-0 flex-col">
                <h1 className="shrink-0 font-sans text-4xl">...</h1>

                <div className="flex flex-1 items-center justify-center">
                    <div className="size-10 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                </div>
            </section>
        );
    }

    if (error !== null) return <h1 className="text-4xl">{error}</h1>;

    if (board === null)
        return <h1 className="text-4xl">Board não encontrado.</h1>;

    return (
        <>
            <h1 className="text-4xl">{board.title}</h1>
            <section className="mt-10 grid gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <div
                    className="h-96 bg-gray-300 flex items-center justify-center rounded-lg cursor-pointer"
                    onClick={openCreateTaskModal}
                >
                    <AddTaskIcon />
                </div>

                {tasks &&
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            colorKey={task.color_key}
                            boardId={Number(id)}
                            updateTask={updateTask}
                        />
                    ))}
            </section>

            <CreateTaskModal
                open={isCreateTaskOpen}
                onClose={closeCreateTaskModal}
                addTask={addTask}
                boardId={Number(id)}
            />
        </>
    );
};

export default Cards;
