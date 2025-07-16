import { useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { refresh_token } from "@/endpoints/api";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";
import GoogleLogo from "@/assets/googleLogo.svg?react";

const Login = () => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    const nav = useNavigate();
    const { google_login_user, isAuthenticated, setIsAuthenticated } =
        useAuth();

    // const handleLogin = (e: React.FormEvent) => {
    //     e.preventDefault(); // Prevent page reload
    //     login_user(username, password);
    // };

    // const handleNav = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     nav("/register");
    // };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const idToken = await result.user.getIdToken();
            await google_login_user(idToken);
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    useEffect(() => {
        // On component mount, try refreshing tokens silently
        const tryRefresh = async () => {
            const success = await refresh_token();
            if (success) {
                setIsAuthenticated(true);
                nav("/"); // Redirect because user is already logged in
            }
        };

        tryRefresh();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-alt-text">
            <form className="flex flex-col items-center justify-between gap-4 p-8 sm:min-w-100 bg-duck-dark-orange rounded-4xl">
                <div className="flex items-center gap-4">
                    <h1 className="text-6xl font-bold">Chefify</h1>
                    <div className="w-16 h-16 bg-[url('/src/assets/chefify-duck.png')] bg-cover bg-center rounded-full border-4 border-duck-yellow"></div>
                </div>

                <h1 className="text-2xl font-bold text-center w-70">
                    Log in to view recipes!
                </h1>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="py-4 m-4 rounded-lg w-70 bg-white text-black hover:bg-duck-pale-yellow font-bold flex justify-center align-middle"
                >
                    <div className="flex items-center justify-center gap-2 ">
                        <p className="grow-0">Sign in with Google</p>
                        <GoogleLogo className="w-6 h-6" />
                    </div>
                </button>
            </form>
        </div>
    );
};

export default Login;
