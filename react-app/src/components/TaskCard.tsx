import Markdown from "react-markdown";
import { BOARD_COLORS, type BoardColorKey } from "../constants/boardColors";

interface TaskCardProps {
    title: string;
    description: string;
    colorKey: BoardColorKey | null;
    preview?: boolean;
}

const TaskCard = ({ title, description, colorKey }: TaskCardProps) => {
    const backgroundColor = colorKey
        ? BOARD_COLORS[colorKey]
        : BOARD_COLORS.yellow;

    return (
        <article
            className={`
                h-96
                overflow-y-auto
                scrollbar-none
                rounded-lg
                p-5
                shadow-xl
                
            `}
            style={{ backgroundColor }}
        >
            <h2 className="wrap-break-word text-center text-2xl font-bold">
                {title || "Título da tarefa"}
            </h2>

            <div className="my-3 h-0.5 bg-black/30" />

            <div className="wrap-break-word">
                {description ? (
                    <Markdown
                        components={{
                            h1: ({ children }) => (
                                <h1 className="my-2 text-2xl font-bold">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="my-2 text-xl font-bold">
                                    {children}
                                </h2>
                            ),
                            p: ({ children }) => (
                                <p className="my-2">{children}</p>
                            ),
                            ul: ({ children }) => (
                                <ul className="my-2 list-disc pl-6">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="my-2 list-decimal pl-6">
                                    {children}
                                </ol>
                            ),
                        }}
                    >
                        {description}
                    </Markdown>
                ) : (
                    <p className="text-black/50">A descrição aparecerá aqui.</p>
                )}
            </div>
        </article>
    );
};

export default TaskCard;
