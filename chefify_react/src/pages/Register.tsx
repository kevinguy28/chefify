import { useState } from "react";
import { useAuth } from "@/contexts/useAuth";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const { register_user } = useAuth();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        register_user(username, email, password, cPassword);
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <label>Username</label>
                <input
                    placeholder="me123123"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                />{" "}
                <label>Email</label>
                <input
                    placeholder="me@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                />
                <label>Password</label>
                <input
                    placeholder="me123&+"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                />{" "}
                <label>Confirm Password</label>
                <input
                    placeholder="me123&+"
                    onChange={(e) => setCPassword(e.target.value)}
                    value={cPassword}
                    type="password"
                />
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};

export default Register;
