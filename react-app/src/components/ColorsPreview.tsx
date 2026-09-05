import type { Dispatch, SetStateAction } from "react";
import { BOARD_COLORS, type BoardColorKey } from "../constants/boardColors";

interface IColorsPreviewProps {
    color_key: BoardColorKey | null;
    setColor_key: Dispatch<SetStateAction<BoardColorKey | null>>;
}

const ColorsPreview = ({ color_key, setColor_key }: IColorsPreviewProps) => {
    return (
        <div className="mt-5 grid grid-cols-4 gap-2.5 ">
            {Object.entries(BOARD_COLORS).map(([chave, valor]) => (
                <span
                    className={`block px-5 py-2.5 rounded-lg text-center ${chave === color_key ? "outline-2 shadow" : ""}`}
                    style={{ backgroundColor: valor }}
                    key={chave}
                    onClick={() =>
                        setColor_key((currentValue) =>
                            currentValue === chave
                                ? null
                                : (chave as BoardColorKey),
                        )
                    }
                >
                    {chave}
                </span>
            ))}
        </div>
    );
};

export default ColorsPreview;
