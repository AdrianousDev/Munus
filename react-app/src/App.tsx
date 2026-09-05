import { HashRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import { Auth } from "./components/auth/Auth";
import UserProvider from "./contexts/user/UserProvider";
import ProtectedRoute from "./components/helper/ProtectedRoute";
import Boards from "./components/Boards";
import AppLayout from "./components/AppLayout";
import Cards from "./components/Cards";

function App() {
    return (
        <div>
            <HashRouter>
                <UserProvider>
                    <Routes>
                        <Route path="/login" element={<Auth />} />

                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route index element={<Boards />} />
                                <Route path="/boards/:id" element={<Cards />} />
                            </Route>

                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </UserProvider>
            </HashRouter>
        </div>
    );
}

export default App;
