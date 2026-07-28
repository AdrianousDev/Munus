import { useTasks } from "../contexts/tasks/useTasks";
import { Task } from "./Task";

export const TaskList = () => {
    const { tasks, loading } = useTasks();

    if (loading) {
        return (
            <p className="space-y-4 p-6 bg-slate-200 rounded-md shadow">
                Carregando...
            </p>
        );
    }

    return (
        <ul className="space-y-4 p-6 bg-slate-200 rounded-md shadow">
            {tasks.map(({ id, title, completed }) => (
                <Task key={id} id={id} title={title} completed={completed} />
            ))}
        </ul>
    );
};
