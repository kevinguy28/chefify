import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { PrivateRouteProps } from "@/interfaces/interfaces";

const PrivateRoutesAuthenticated = ({ children }: PrivateRouteProps) => {
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

export default PrivateRoutesAuthenticated;
