import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { path: '/borrows', label: 'Quản Lý Mượn Trả', icon: '📖' },
        { path: '/borrows/overdue', label: 'Sách Quá Hạn', icon: '⚠️' },
        { path: '/borrows/stats', label: 'Thống Kê Mượn Sách', icon: '📊' },
        { path: '/books', label: 'Quản Lý Sách', icon: '📚' },
        { path: '/reader-management', label: 'Quản Lý Độc Giả', icon: '👥' },
        { path: '/add-user', label: 'Thêm Người Dùng', icon: '👤' },
        { path: '/login', label: 'Đăng xuất', icon: '' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Toggle Button: flush with sidebar edge */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-4 z-50 p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-0'
                    }`}
            >
                {isSidebarOpen ? '◀' : '▶'}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
                    }`}
            >
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-blue-600 mb-8">Thư Viện</h2>
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                <main className="p-4">{children}</main>
            </div>
        </div>
    );
}