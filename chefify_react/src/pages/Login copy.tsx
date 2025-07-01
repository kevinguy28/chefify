import { useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const { login_user, google_login_user } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        login_user(username, password);
    };

    const handleNav = (e: React.FormEvent) => {
        e.preventDefault();
        nav("/register");
    };

    const handleGoogleLogin = async () => {
        console.log("what da hell");
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            console.log("ice guy");
            await google_login_user(idToken);
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-alt-text">
            <form
                onSubmit={handleLogin}
                className="flex flex-col items-center justify-between gap-4 p-8 sm:min-w-100 bg-duck-dark-orange rounded-4xl"
            >
                <div className="flex items-center gap-4">
                    <h1 className="text-6xl font-bold">Chefify</h1>
                    <div className="w-16 h-16 bg-[url('/src/assets/chefify-duck.png')] bg-cover bg-center rounded-full border-4 border-duck-yellow"></div>
                </div>

                <h1 className="text-2xl font-bold text-center w-70">
                    Log in to view recipes!
                </h1>

                <label className="py-4 font-bold w-70">Username</label>
                <input
                    className="p-4 w-70 bg-duck-yellow rounded-xl"
                    placeholder="ducky@chefify.com"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                />

                <label className="py-4 font-bold w-70">Password</label>
                <input
                    className="p-4 w-70 bg-duck-yellow rounded-xl"
                    placeholder="Duck123*"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                />

                <input
                    className="py-4 m-4 rounded-lg w-70 bg-duck-pale-yellow hover:bg-white font-bold"
                    type="submit"
                    value="Submit"
                    onClick={handleLogin}
                />

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="py-4 m-4 rounded-lg w-70 bg-white text-black hover:bg-gray-100 font-bold"
                >
                    Sign in with Google
                </button>

                <div onClick={handleNav} className="p-4 cursor-pointer">
                    Not a Chefify member yet? <u>Join here!</u>
                </div>
            </form>
        </div>
    );
};

export default Login;
