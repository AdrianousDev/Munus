import type { ChangeEvent, FocusEvent, HTMLInputTypeAttribute } from "react";

interface InputProps {
    label?: string;
    type: HTMLInputTypeAttribute;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const Input = ({
    label,
    type,
    name,
    value,
    onChange,
    error,
    onBlur,
    placeholder,
}: InputProps) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={name} className="">
                    {label}
                </label>
            )}
            <input
                className="w-full bg-white h-14 rounded-lg p-5 font-sans"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
            />
            {error && <p className="text-red-600 text-center mt-1">{error}</p>}
        </div>
    );
};

export default Input;
