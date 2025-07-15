import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    is_authenticated,
    login,
    readUserProfile,
    register,
    login_google,
    logout,
} from "@/endpoints/api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User, UserProfile } from "@/interfaces/interfaces";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
    login_user: (username: string, password: string) => Promise<void>;
    register_user: (
        username: string,
        email: string,
        password: string,
        cPassword: string
    ) => Promise<void>;
    google_login_user: (idToken: string) => Promise<void>;
    logout_user: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const nav = useNavigate();

    const get_authenticated = async () => {
        setLoading(true);
        try {
            const response = await is_authenticated();
            if (response) {
                setIsAuthenticated(true);
                setUser(response.user);
                const responseUserProfile = await readUserProfile();
                if (responseUserProfile) {
                    setUserProfile(responseUserProfile);
                }
            }
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (username: string, password: string) => {
        const response = await login(username, password);
        if (response.success) {
            setIsAuthenticated(true);
            nav("/");
        } else {
            alert("Login failed. Check your credentials.");
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

    const google_login_user = async (idToken: string) => {
        const response = await login_google(idToken);
        if (response.success) {
            setIsAuthenticated(true);
            nav("/");
        } else {
            alert(
                "Login failed. Check your credentials. If this issue continues to persist please clear cookies."
            );
        }
    };

    const logout_user = async () => {
        try {
            await logout(); // Calls the Django logout endpoint
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setUserProfile(null);
            nav("/login"); // redirect to login page
        }
    };

    useEffect(() => {
        get_authenticated();
    }, [location.pathname]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                userProfile,
                login_user,
                register_user,
                google_login_user,
                logout_user,
            }}
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
