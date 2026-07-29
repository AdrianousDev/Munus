import { AddTask } from "./components/AddTask";
import { SeeDetailsTask } from "./components/SeeDetailsTask";
import { TaskList } from "./components/TaskList";

function App() {
    return (
        <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
            <div className="w-125 space-y-4">
                <h1 className="text-center text-slate-100 text-2xl font-bold">
                    Task Manager React
                </h1>

                <AddTask />

                <TaskList />

                <SeeDetailsTask />
            </div>
        </div>
    );
}

export default App;
