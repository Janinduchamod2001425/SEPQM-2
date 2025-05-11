import React, {useState} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Both fields are required.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/auth/login", {email, password});
            localStorage.setItem("token", response.data.token); // Store token
            navigate("/add_budget");
        } catch (err) {
            setErrorMessage("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center" data-cy="error-message">
                        {errorMessage}
                    </div>
                )}
                <div className="mb-4">
                    <input
                        type="email"
                        data-cy="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        data-cy="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    data-cy="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-blue-500"} text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;