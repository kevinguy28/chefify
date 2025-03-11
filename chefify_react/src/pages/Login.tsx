import { useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const { login_user } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        login_user(username, password);
    };

    const handleNav = (e: React.FormEvent) => {
        e.preventDefault();
        nav("/register");
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center text-alt-text">
            <form
                onSubmit={handleLogin}
                className="flex flex-col justify-between  gap-4 items-center sm:min-w-100 bg-duck-dark-orange rounded-4xl p-8"
            >
                <div className="flex items-center gap-4">
                    <h1 className="text-6xl font-bold">Chefify</h1>
                    <div className="w-16 h-16 bg-[url('/src/assets/chefify-duck.png')] bg-cover bg-center rounded-full border-4 border-duck-yellow"></div>
                </div>

                <h1 className="font-bold text-2xl w-70 text-center">
                    Log in to view recipes!
                </h1>
                <label className="w-70 py-4 font-bold">Username</label>
                <input
                    className="w-70  p-4 bg-duck-yellow rounded-xl"
                    placeholder="ducky@chefify.com"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                />
                <label className="w-70 py-4 font-bold">Password</label>
                <input
                    className="w-70 p-4 bg-duck-yellow rounded-xl"
                    placeholder="Duck123*"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                />
                <input
                    className="w-70 py-4 m-4 bg-duck-pale-yellow hover:bg-white rounded-lg font-bol"
                    type="submit"
                    value="Submit"
                    onClick={handleLogin}
                />
                <div onClick={handleNav} className="p-4">
                    Not a Chefify member yet? <u>Join here!</u>
                </div>
            </form>
        </div>
    );
};

export default Login;
