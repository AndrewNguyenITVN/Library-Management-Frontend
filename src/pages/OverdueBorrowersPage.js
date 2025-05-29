import React, { useState, useEffect } from 'react';
import authFetch from '../utils/authFetch';

export default function OverdueBorrowersPage() {
    const [overdueBorrowings, setOverdueBorrowings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOverdueBorrowings();
    }, []);

    const fetchOverdueBorrowings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authFetch('http://localhost:8080/borrowing/overdue');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setOverdueBorrowings(data.data || []);
            } else {
                setError(data.desc || 'Failed to fetch overdue borrowings');
                setOverdueBorrowings([]);
            }
        } catch (error) {
            console.error('Error fetching overdue borrowings:', error);
            setError('Error fetching overdue borrowings. Please check the console.');
            setOverdueBorrowings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-300 p-4 sm:p-8">
            <div className="container mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-red-700">
                    Danh Sách Mượn Sách Quá Hạn
                </h1>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-4">Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : overdueBorrowings && overdueBorrowings.length > 0 ? (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độc Giả</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ID Độc Giả</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Seri Sách</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Mượn</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn Trả</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Ngày Quá Hạn</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {overdueBorrowings.map((borrowing, index) => {
                                    const dueDate = new Date(borrowing.dueDate);
                                    const today = new Date();
                                    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

                                    return (
                                        <tr key={borrowing.idBorrow} className="hover:bg-red-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.readerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.identityCard}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookSeri}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.borrowedAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.dueDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{daysOverdue} ngày</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">Không có sách mượn quá hạn.</p>
                )}
            </div>
        </div>
    );
} 