import { HashRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Login from "./components/Login";
import UserProvider from "./contexts/user/UserProvider";
import ProtectedRoute from "./components/helper/ProtectedRoute";
import Boards from "./components/Boards";

function App() {
    return (
        <div>
            <HashRouter>
                <UserProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Boards />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </UserProvider>
            </HashRouter>
        </div>
    );
}

export default App;
