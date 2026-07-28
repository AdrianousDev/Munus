import { useEffect, useState } from "react";
import { TasksContext } from "./TasksContext";
import type { ITasksProviderProps } from "../../interfaces/props/ITasksProviderProps";
import type { Task } from "../../interfaces/tasks/ITask";

export const TasksProvider = ({ children }: ITasksProviderProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const apiUrl = import.meta.env.VITE_API_BASE_URL;

                const response = await fetch(`${apiUrl}/tasks`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar tarefas");
                }

                const data: Task[] = await response.json();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    const addTask = (title: string, description: string): void => {
        if (!title) throw new Error("Título inválido.");

        if (!description) throw new Error("Descrição inválida.");

        const newTask = {
            id: tasks.length + 1,
            title,
            description,
            completed: false,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleCompletedClick = (id: number): void => {
        setTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }

                return task;
            }),
        );
    };

    return (
        <TasksContext.Provider
            value={{ tasks, loading, addTask, handleCompletedClick }}
        >
            {children}
        </TasksContext.Provider>
    );
};
