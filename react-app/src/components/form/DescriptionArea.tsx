import type { ChangeEvent } from "react";

interface DescriptionAreaProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string | null;
}

const DescriptionArea = ({ value, onChange, error }: DescriptionAreaProps) => {
    return (
        <div>
            <textarea
                id="description"
                name="description"
                value={value}
                onChange={onChange}
                placeholder="Escreva usando Markdown..."
                className="h-full w-full resize-none rounded-lg bg-white p-5"
            />

            {error && <p className="mt-1 text-red-600">{error}</p>}
        </div>
    );
};

export default DescriptionArea;
