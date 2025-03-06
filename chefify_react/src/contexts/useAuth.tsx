import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { is_authenticated, login, register } from "@/endpoints/api";
import { useLocation } from "react-router-dom"; // If using React Router
import { useNavigate } from "react-router-dom";

// Define the type for the AuthContext
interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login_user: (username: string, password: string) => Promise<void>; // Add the login_user function type
    register_user: (
        username: string,
        email: string,
        password: string,
        cPassword: string
    ) => Promise<void>;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define a type for AuthProvider props
interface AuthProviderProps {
    children: ReactNode; // Explicitly typing `children`
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const nav = useNavigate();

    const get_authenticated = async () => {
        setLoading(true);
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (username: string, password: string) => {
        const success = await login(username, password);
        if (success) {
            setIsAuthenticated(true);
            nav("/");
        }
    };

    const register_user = async (
        username: string,
        email: string,
        password: string,
        cPassword: string
    ) => {
        if (password === cPassword) {
            try {
                await register(username, email, password);
                nav("/login");
            } catch (error) {
                alert("error registering user");
            }
        } else {
            alert("password don't match");
        }
    };

    useEffect(() => {
        get_authenticated();
    }, [location.pathname]);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loading, login_user, register_user }}
        >
            {children} {/* 'children' is properly used */}
        </AuthContext.Provider>
    );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
