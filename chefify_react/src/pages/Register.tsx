import { useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const { register_user } = useAuth();
    const nav = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        register_user(username, email, password, cPassword);
    };

    const handleNav = (e: React.FormEvent) => {
        e.preventDefault;
        nav("/login");
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center text-alt-text">
            <form
                onSubmit={handleRegister}
                className="flex flex-col justify-between gap-1 items-center sm:min-w-100 bg-duck-dark-orange rounded-4xl p-8"
            >
                <div className="flex items-center gap-4">
                    <h1 className="text-6xl font-bold">Chefify</h1>
                    <div className="w-16 h-16 bg-[url('/src/assets/chefify-duck.png')] bg-cover bg-center rounded-full border-4 border-duck-yellow"></div>
                </div>
                <h1 className="font-bold text-2xl w-70 text-center">
                    Register to view recipes!
                </h1>
                <label className="w-70 py-2 font-bold">Username</label>
                <input
                    placeholder="duckytheduck"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    className="w-70  p-4 bg-duck-yellow rounded-xl"
                />
                <label className="w-70 py-2 font-bold">Email</label>
                <input
                    placeholder="ducky@chefify.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    className="w-70 p-4 bg-duck-yellow rounded-xl"
                />
                <label className="w-70 py-2 font-bold">Password</label>
                <input
                    placeholder="Duck123*"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    className="w-70  p-4 bg-duck-yellow rounded-xl"
                />
                <label className="w-70 py-2 font-bold">Confirm Password</label>
                <input
                    placeholder="Duck123"
                    onChange={(e) => setCPassword(e.target.value)}
                    value={cPassword}
                    type="password"
                    className="w-70  p-4 bg-duck-yellow rounded-xl"
                />
                <input
                    type="submit"
                    value="Register"
                    className="w-70 py-4 m-4 bg-duck-pale-yellow rounded-lg hover:bg-duck-yellow font-bol"
                />
                <div onClick={handleNav}>
                    Have an account?<u> Login here!</u>
                </div>
            </form>
        </div>
    );
};

export default Register;
