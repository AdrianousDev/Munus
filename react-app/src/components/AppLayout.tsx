import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import CreateBoardModal from "./CreateBoardModal";
import { useState } from "react";

export interface AppOutletContext {
    openCreateBoardModal: () => void;
}

const AppLayout = () => {
    const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

    const openCreateBoardModal = () => {
        setIsCreateBoardOpen(true);
    };

    const closeCreateBoardModal = () => {
        setIsCreateBoardOpen(false);
    };

    return (
        <div className="flex h-dvh p-10 gap-10">
            <Sidebar onCreateBoard={openCreateBoardModal} />

            <main className="min-w-0 flex-1 overflow-y-auto scrollbar-none">
                <Outlet context={{ openCreateBoardModal }} />
            </main>

            <CreateBoardModal
                open={isCreateBoardOpen}
                onClose={closeCreateBoardModal}
            />
        </div>
    );
};

export default AppLayout;
