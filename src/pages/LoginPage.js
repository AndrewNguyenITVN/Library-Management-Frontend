import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gọi API đăng nhập ở đây
        try {
            const response = await fetch(
                `http://localhost:8080/login/signin?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                { method: "POST" }
            );
            if (!response.ok) throw new Error(response.status);
            const data = await response.json();
            if (data.success) {
                // Store the token
                if (data.data) { // Changed from data.token to data.data
                    localStorage.setItem('jwtToken', data.data);
                } else {
                    // Handle case where token is not in the expected field
                    console.error('Login successful, but no token received.');
                    alert('Lỗi đăng nhập: Không nhận được token xác thực.');
                    return; // Do not proceed if token is missing
                }
                onLoginSuccess(); // Call the callback to update authentication state
                navigate("/borrows");
            } else {
                alert("Đăng nhập thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối tới server");
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
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Nhập tên đăng nhập"
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
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}