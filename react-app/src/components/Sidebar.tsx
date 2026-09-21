import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../contexts/user/useUser";
import AddBoardSideBarIcon from "./svgs/AddBoardSideBarIcon";
import HomeIcon from "./svgs/HomeIcon";
import LeaveIcon from "./svgs/LeaveIcon";
import MenuIcon from "./svgs/MenuIcon";
import { SearchIcon } from "./svgs/SearchIcon";
import UserAvatarImage from "./UserAvatarImage";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type IBoard from "../interfaces/IBoard";

interface SidebarProps {
    onCreateBoard: () => void;
}

const Sidebar = ({ onCreateBoard }: SidebarProps) => {
    const { user, boards, userLogout, searchUserBoards } = useUser();

    const [searchResults, setSearchResults] = useState<IBoard[] | null>(null);

    const displayedBoards = searchResults ?? boards;

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = async ({
        target,
    }: ChangeEvent<HTMLInputElement>) => {
        const title = target.value.trim();

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        if (!title) {
            setSearchResults(null);
            return;
        }

        searchTimer.current = setTimeout(async () => {
            const searchedBoards = await searchUserBoards(title);
            setSearchResults(searchedBoards);
            searchTimer.current = null;
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }
        };
    }, []);

    return (
        <nav className="flex h-full min-h-0 w-70 flex-col overflow-hidden rounded-lg bg-gray-300 pt-2.5">
            <header className="pr-2.5 pl-2.5">
                <div className="flex justify-between items-center">
                    <h2 className="font-sans text-2xl">Menu</h2>
                    <MenuIcon />
                </div>

                <div className="relative mt-2.5">
                    <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                        <SearchIcon />
                    </div>

                    <input
                        type="search"
                        onChange={handleSearchChange}
                        placeholder="Search"
                        aria-label="Search"
                        className="h-8 w-full rounded-md bg-white placeholder:text-black pr-3 pl-9 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </header>

            <section className="mt-5 flex min-h-0 flex-1 flex-col px-2.5">
                <h3 className="shrink-0">Boards</h3>

                <div
                    aria-label="Lista de boards"
                    className="mt-2.5 min-h-0 flex-1 overflow-y-auto scrollbar-none"
                >
                    <div className="flex flex-col gap-2.5">
                        {displayedBoards === null ? (
                            <p>Carregando boards...</p>
                        ) : displayedBoards.length === 0 ? (
                            <p>Nenhum board encontrado.</p>
                        ) : (
                            displayedBoards.map((board) => {
                                const isActive =
                                    pathname === `/boards/${board.id}`;

                                return (
                                    <div
                                        key={board.id}
                                        className={`w-full cursor-pointer rounded-md p-1 text-center font-sans ${
                                            isActive
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                        }`}
                                        onClick={() =>
                                            navigate(`/boards/${board.id}`)
                                        }
                                    >
                                        {board.title}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <button
                        className="mt-2.5 flex w-full shrink-0 cursor-pointer items-center justify-center rounded-md bg-white p-1"
                        onClick={onCreateBoard}
                    >
                        <AddBoardSideBarIcon />
                    </button>
                </div>
            </section>

            <section className="mt-auto shrink-0 pt-2.5 px-2.5">
                <div
                    className={`flex cursor-pointer items-center justify-center gap-1 rounded-md p-1 text-sm font-medium
                    ${
                        pathname === "/"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                    }`}
                    onClick={() => navigate("/")}
                >
                    <HomeIcon color={pathname === "/" ? "white" : "black"} />
                    <span>Home</span>
                </div>
            </section>

            <section className="mt-2.5 shrink-0 bg-gray-400 rounded-b-lg">
                <div className="flex items-center justify-between p-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <UserAvatarImage />
                    </div>
                    <h3
                        className="cursor-pointer"
                        onClick={() => navigate("/profile")}
                    >
                        {user?.username}
                    </h3>
                    <span
                        className="cursor-pointer"
                        onClick={() => userLogout()}
                    >
                        <LeaveIcon />
                    </span>
                </div>
            </section>
        </nav>
    );
};

export default Sidebar;
