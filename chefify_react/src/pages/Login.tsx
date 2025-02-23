import { use, useState } from "react";
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
        <div>
            <form onSubmit={handleLogin}>
                <label>Username</label>
                <input
                    placeholder="me@example.com"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                />
                <label>Password</label>
                <input
                    placeholder="me123&+"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                />
                <input type="submit" value="Submit" />
                <div onClick={handleNav}>register</div>
            </form>
        </div>
    );
};

export default Login;
