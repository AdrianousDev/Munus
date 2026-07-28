import type { Task } from "./ITask";

export interface TasksContextValue {
    tasks: Task[];
    loading: boolean;
    addTask: (title: string, description: string) => void;
    handleCompletedClick: (id: number) => void;
}
