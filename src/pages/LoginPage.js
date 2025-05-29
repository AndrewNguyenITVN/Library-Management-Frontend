import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateInputs = () => {
        if (!username.trim()) {
            setError("Vui lòng nhập tên đăng nhập");
            return false;
        }
        if (!password.trim()) {
            setError("Vui lòng nhập mật khẩu");
            return false;
        }
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/login/signin?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                { method: "POST" }
            );
            if (!response.ok) throw new Error(response.status);
            const data = await response.json();
            if (data.success) {
                if (data.data) {
                    localStorage.setItem('jwtToken', data.data);
                    onLoginSuccess();
                    navigate("/borrows");
                } else {
                    console.error('Login successful, but no token received.');
                    setError('Lỗi đăng nhập: Không nhận được token xác thực.');
                }
            } else {
                setError("Đăng nhập thất bại: " + (data.desc || "Vui lòng kiểm tra lại thông tin đăng nhập"));
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối tới server. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Đăng nhập hệ thống thư viện
                </h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Nhập tên đăng nhập"
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
}