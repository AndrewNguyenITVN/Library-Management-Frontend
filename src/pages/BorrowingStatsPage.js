import React, { useState, useEffect } from 'react';
import authFetch from '../utils/authFetch';

export default function BorrowingStatsPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: 'week',
        year: new Date().getFullYear(),
        week: getCurrentWeek(),
        month: new Date().getMonth() + 1
    });

    function getCurrentWeek() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return Math.ceil(diff / oneWeek);
    }

    useEffect(() => {
        fetchStats();
    }, [filters]);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let url = `http://localhost:8080/borrowing/stats?type=${filters.type}&year=${filters.year}`;
            if (filters.type === 'week') {
                url += `&week=${filters.week}`;
            } else {
                url += `&month=${filters.month}`;
            }

            const response = await authFetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            } else {
                setError(data.desc || 'Failed to fetch statistics');
                setStats(null);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError('Error fetching statistics. Please check the console.');
            setStats(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 p-4 sm:p-8">
            <div className="container mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-700">
                    Thống Kê Mượn Sách
                </h1>

                {/* Filters */}
                <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Bộ Lọc Thống Kê</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Loại Thống Kê</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="week">Theo Tuần</option>
                                <option value="month">Theo Tháng</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Năm</label>
                            <input
                                type="number"
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {filters.type === 'week' ? (
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Tuần</label>
                                <input
                                    type="number"
                                    name="week"
                                    value={filters.week}
                                    onChange={handleFilterChange}
                                    min="1"
                                    max="53"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Tháng</label>
                                <input
                                    type="number"
                                    name="month"
                                    value={filters.month}
                                    onChange={handleFilterChange}
                                    min="1"
                                    max="12"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Summary */}
                {isLoading ? (
                    <p className="text-center text-gray-500 py-4">Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : stats ? (
                    <>
                        <div className="mb-8 p-6 bg-green-50 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 text-green-600">Tổng Quan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <p className="text-gray-500">Loại Thống Kê</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats.type === 'week' ? 'Theo Tuần' : 'Theo Tháng'}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <p className="text-gray-500">Thời Gian</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats.type === 'week'
                                            ? `Tuần ${stats.week}, ${stats.year}`
                                            : `Tháng ${stats.month}, ${stats.year}`}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <p className="text-gray-500">Tổng Số Lượt Mượn</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.count}</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed List */}
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4 p-4 bg-gray-50">Chi Tiết Mượn Sách</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độc Giả</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ID Độc Giả</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Seri Sách</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Mượn</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn Trả</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.borrowings.map((borrowing, index) => (
                                        <tr key={borrowing.idBorrow} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.readerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.identityCard}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookSeri}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.borrowedAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.dueDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${borrowing.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {borrowing.status ? 'Đã Trả' : 'Chưa Trả'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 py-4">Không có dữ liệu thống kê.</p>
                )}
            </div>
        </div>
    );
} 