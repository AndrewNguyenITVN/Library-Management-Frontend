import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed unused import
import authFetch from '../utils/authFetch';

export default function AddUserPage() {
    // const navigate = useNavigate(); // Removed unused variable
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'staff'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await authFetch('http://localhost:8080/login/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `Request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setSuccess('Thêm người dùng thành công!');
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    role: 'staff'
                });
            } else {
                setError('Thêm người dùng thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Thêm Người Dùng Mới</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Vai trò</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="staff">Nhân viên</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Thêm người dùng
                    </button>
                </form>
            </div>
        </div>
    );
} 