export const BOARD_COLORS = {
    lemon: "#FFFD54",
    yellow: "#FFEB60",
    pink: "#FD468B",
    gold: "#FBCB21",
    peach: "#FAA98B",
    lime: "#D3EA27",
    purple: "#AC5CD2",
    blue: "#35ABD8",
} as const;

export type BoardColorKey = keyof typeof BOARD_COLORS;
