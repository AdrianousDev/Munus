import { useNavigate, useOutletContext } from "react-router-dom";
import { BOARD_COLORS } from "../constants/boardColors";
import useUser from "../contexts/user/useUser";
import AddBoardIcon from "./svgs/AddBoardIcon";
import type { AppOutletContext } from "./AppLayout";
import { formatDate } from "../utils/DateUtils";

const Boards = () => {
    const { user, boards } = useUser();

    const formattedUserName = user?.username.split(" ")[0];

    const { openCreateBoardModal } = useOutletContext<AppOutletContext>();

    const navigate = useNavigate();

    return (
        <>
            <h1 className="font-sans text-4xl">
                Welcome, {formattedUserName}!
            </h1>

            <section
                aria-label="Boards section"
                className="mt-10 grid gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            >
                <div
                    onClick={openCreateBoardModal}
                    className="bg-gray-300 flex items-center justify-center h-52 rounded-lg cursor-pointer"
                >
                    <AddBoardIcon />
                </div>

                {boards &&
                    boards.map((board) => (
                        <div
                            key={board.id}
                            className="flex flex-col items-center justify-center h-52 rounded-lg shadow-xl cursor-pointer"
                            style={{
                                backgroundColor: BOARD_COLORS[board.color_key],
                            }}
                            onClick={() => navigate(`/boards/${board.id}`)}
                        >
                            <p className="text-xl font-serif font-medium">
                                {board.title}
                            </p>
                            <p>Created at: {formatDate(board.created_at)}</p>
                        </div>
                    ))}
            </section>
        </>
    );
};

export default Boards;
