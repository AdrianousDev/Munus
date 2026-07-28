import type { Task } from "./ITask";

export interface TasksContextValue {
    tasks: Task[];
    isFetchingTasks: boolean;
    isCreatingTask: boolean;
    addTask: (title: string, description: string) => void;
    handleCompletedClick: (id: number, completed: boolean) => void;
    handleDeleteClick: (id: number) => void;
}
