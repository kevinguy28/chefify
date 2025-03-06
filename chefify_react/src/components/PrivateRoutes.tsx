import { ReactNode } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, loading } = useAuth();
    const nav = useNavigate();

    if (loading) {
        return <h1> Loading ...</h1>;
    }

    if (isAuthenticated) {
        return children;
    } else {
        nav("/login");
    }
};

export default PrivateRoutes;
