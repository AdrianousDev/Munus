import { X } from "lucide-react";
import { useTasks } from "../contexts/tasks/useTasks";

export const SeeDetailsTask = () => {
    const { dialogTask, visibleDialogTask, handleCloseDialogTask } = useTasks();

    if (!visibleDialogTask) return null;

    return (
        <div className="fixed inset-0 z-50 w-full min-h-dvh bg-black/30 flex self-center">
            <div className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-xl bg-slate-100 p-6 text-slate-800 shadow-2xl">
                <div className="border-b border-slate-300 pb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Detalhes da tarefa
                        </span>

                        <X onClick={() => handleCloseDialogTask()} />
                    </div>

                    <h2 className="mt-1 wrap-break-word text-2xl font-bold">
                        {dialogTask?.title}
                    </h2>
                </div>

                <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-slate-600">
                        Descrição
                    </h3>

                    <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-slate-700">
                        {dialogTask?.description}
                    </p>
                </div>
            </div>
        </div>
    );
};
