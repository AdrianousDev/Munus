import { CheckIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { useTasks } from "../contexts/tasks/useTasks";

interface ITaskProps {
    id: number;
    title: string;
    completed: boolean;
}

export const Task = ({ id, title, completed }: ITaskProps) => {
    const { handleCompletedClick, handleDeleteClick } = useTasks();

    return (
        <li key={id} className="flex gap-2">
            <button
                className={`bg-slate-400 text-left w-full flex items-center gap-2 text-white p-2 rounded-md cursor-pointer ${completed && "line-through"}`}
                onClick={() => handleCompletedClick(id, completed)}
            >
                {completed && <CheckIcon />}
                {title}
            </button>

            <button className="bg-slate-400 p-2 rounded-md text-white cursor-pointer">
                <ChevronRightIcon />
            </button>

            <button
                className="bg-slate-400 p-2 rounded-md text-white cursor-pointer"
                onClick={() => handleDeleteClick(id)}
            >
                <TrashIcon />
            </button>
        </li>
    );
};
