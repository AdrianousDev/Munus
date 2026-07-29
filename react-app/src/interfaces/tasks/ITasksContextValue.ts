import type { Task } from "./ITask";

export interface TasksContextValue {
    tasks: Task[];
    isFetchingTasks: boolean;
    isCreatingTask: boolean;
    dialogTask: Task | null;
    visibleDialogTask: boolean;
    addTask: (title: string, description: string) => void;
    handleCompletedClick: (id: number, completed: boolean) => void;
    handleSeeDetailsClick: (id: number) => void;
    handleDeleteClick: (id: number) => void;
    handleCloseDialogTask: () => void;
}
