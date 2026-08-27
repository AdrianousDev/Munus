import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
    return (
        <div className="flex h-dvh p-10 gap-10">
            <Sidebar />

            <main className="min-w-0 flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
