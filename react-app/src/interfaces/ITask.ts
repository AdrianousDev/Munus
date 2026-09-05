import type { BoardColorKey } from "../constants/boardColors";

export default interface ITask {
    id: number;
    board_id: number;
    title: string;
    description: string;
    color_key: BoardColorKey;
    completed: boolean;
}
