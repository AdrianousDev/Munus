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

    const addTask = async (
        title: string,
        description: string,
    ): Promise<void> => {
        if (!title.trim()) throw new Error("Título inválido.");

        if (!description.trim()) throw new Error("Descrição inválida.");

        const newTask = {
            title: title.trim(),
            description: description.trim(),
        };

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${apiUrl}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro ao criar tarefa: ${message}`);
            }

            const createdTask: Task = await response.json();

            if (!createdTask) {
                throw new Error("A API não retornou a tarefa criada.");
            }

            setTasks((currentTasks) => [...currentTasks, createdTask]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleCompletedClick = async (
        id: number,
        completed: boolean,
    ): Promise<void> => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${apiUrl}/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: !completed }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro ao mudar status da tarefa: ${message}`);
            }

            const updatedTask: Task = await response.json();

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task,
                ),
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <TasksContext.Provider
            value={{ tasks, loading, addTask, handleCompletedClick }}
        >
            {children}
        </TasksContext.Provider>
    );
};
