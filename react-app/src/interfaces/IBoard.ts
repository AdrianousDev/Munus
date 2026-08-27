import type { BoardColorKey } from "../constants/boardColors";

export default interface IBoard {
    id: number;
    title: string;
    color_key: BoardColorKey;
    created_at: string;
}
