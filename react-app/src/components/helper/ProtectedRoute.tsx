import { Navigate, Outlet } from "react-router-dom";
import useUser from "../../contexts/user/useUser";

const ProtectedRoute = () => {
    const { isLogged, loading } = useUser();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
