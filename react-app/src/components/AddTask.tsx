import { useState } from "react";
import { InputText } from "./InputText";
import { useTasks } from "../contexts/tasks/useTasks";

export const AddTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { addTask, isCreatingTask } = useTasks();

    const handleClick = () => {
        addTask(title, description);
    };

    return (
        <div className="flex flex-col space-y-4 p-6 bg-slate-200 shadow rounded-md">
            <InputText
                placeholder={"Digite o título da tarefa"}
                value={title}
                setValue={setTitle}
            />

            <InputText
                placeholder={"Digite a descrição da tarefa"}
                value={description}
                setValue={setDescription}
            />

            <button
                className="
                bg-slate-500 text-white px-4 py-2 rounded-md font-medium cursor-pointer
                disabled:bg-slate-300 disabled:cursor-not-allowed
                transition-colors duration-200
                "
                onClick={handleClick}
                disabled={
                    isCreatingTask || !title.trim() || !description.trim()
                }
            >
                {isCreatingTask ? "Adicionando..." : "Adicionar"}
            </button>
        </div>
    );
};
