import React, { useState, useEffect } from 'react';
import authFetch from '../utils/authFetch';

export default function BorrowsPage() {
    const [borrowings, setBorrowings] = useState([]);
    const [readerId, setReaderId] = useState('');
    const [bookId, setBookId] = useState('');
    const [searchIdentityCard, setSearchIdentityCard] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllBorrowings();
    }, []);

    const fetchAllBorrowings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authFetch('http://localhost:8080/borrowing/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setBorrowings(data.data || []);
            } else {
                setError(data.desc || 'Failed to fetch borrowings');
                setBorrowings([]);
            }
        } catch (error) {
            console.error('Error fetching borrowings:', error);
            setError('Error fetching borrowings. Please check the console.');
            setBorrowings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchByIdentityCard = async (e) => {
        e.preventDefault();
        if (!searchIdentityCard) {
            alert('Vui lòng nhập số ID độc giả');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await authFetch(`http://localhost:8080/borrowing/by-reader?identityCard=${encodeURIComponent(searchIdentityCard)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setBorrowings(data.data || []);
            } else {
                setError(data.desc || 'Không tìm thấy thông tin mượn trả');
                setBorrowings([]);
            }
        } catch (error) {
            console.error('Error searching borrowings:', error);
            setError('Lỗi khi tìm kiếm. Vui lòng kiểm tra console.');
            setBorrowings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const validateBorrowInputs = () => {
        if (!readerId.trim()) {
            setError('Vui lòng nhập ID độc giả');
            return false;
        }
        if (!bookId.trim()) {
            setError('Vui lòng nhập ID sách');
            return false;
        }
        if (!/^\d+$/.test(readerId)) {
            setError('ID độc giả phải là số');
            return false;
        }
        if (!/^\d+$/.test(bookId)) {
            setError('ID sách phải là số');
            return false;
        }
        return true;
    };

    const handleBorrowBook = async (e) => {
        e.preventDefault();
        try {
            const response = await authFetch('http://localhost:8080/borrow/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    readerId: readerId,
                    bookId: bookId,
                    notes: ''
                })
            });

            if (response.ok) {
                alert('Mượn sách thành công!');
                setReaderId('');
                setBookId('');
                fetchAllBorrowings();
            } else {
                alert('Mượn sách thất bại!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi mượn sách!');
        }
    };

    const handleReturnBook = async (borrowingId) => {
        if (!borrowingId) {
            setError('ID mượn sách không hợp lệ');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn trả sách này?')) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authFetch(`http://localhost:8080/borrowing/return?borrowingId=${borrowingId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                alert('Trả sách thành công!');
                fetchAllBorrowings();
            } else {
                setError(data.desc || 'Trả sách thất bại');
            }
        } catch (error) {
            console.error('Error returning book:', error);
            setError('Lỗi khi trả sách. Vui lòng thử lại sau.');
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
            // hour: '2-digit',
            // minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-300 p-4 sm:p-8">
            <div className="container mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-700">
                    Quản Lý Mượn Trả Sách
                </h1>


                {/* Borrow Book Form */}
                <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-blue-600">Mượn Sách</h2>
                    <form onSubmit={handleBorrowBook} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="readerId" className="block mb-1 font-medium text-gray-700">ID Độc Giả</label>
                                <input
                                    id="readerId"
                                    type="text"
                                    value={readerId}
                                    onChange={(e) => setReaderId(e.target.value)}
                                    placeholder="Nhập ID độc giả"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="bookId" className="block mb-1 font-medium text-gray-700">ID Sách</label>
                                <input
                                    id="bookId"
                                    type="text"
                                    value={bookId}
                                    onChange={(e) => setBookId(e.target.value)}
                                    placeholder="Nhập ID sách"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading}
                            className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Đang xử lý...' : 'Mượn Sách'}
                        </button>
                    </form>
                </div>
                {/* Search by Identity Card Form */}
                <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-purple-600">Tìm Kiếm Theo ID Độc Giả</h2>
                    <form onSubmit={handleSearchByIdentityCard} className="flex space-x-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={searchIdentityCard}
                                onChange={(e) => setSearchIdentityCard(e.target.value)}
                                placeholder="Nhập số ID độc giả"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-purple-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-purple-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang tìm kiếm...' : 'Tìm Kiếm'}
                        </button>
                        <button
                            type="button"
                            onClick={fetchAllBorrowings}
                            disabled={isLoading}
                            className="bg-gray-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-gray-600 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xem Tất Cả
                        </button>
                    </form>
                </div>


                {/* Borrowings List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-700">Danh Sách Mượn Trả</h2>
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-4">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 py-4">{error}</p>
                    ) : borrowings && borrowings.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {borrowings.map((borrowing, index) => (
                                        <tr key={borrowing.idBorrow} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.readerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.identityCard}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{borrowing.bookSeri}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.borrowedAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(borrowing.dueDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {!borrowing.status && (
                                                    <button onClick={() => handleReturnBook(borrowing.idBorrow)} disabled={isLoading}
                                                        className="bg-green-600 text-white py-1 px-3 rounded-md font-semibold hover:bg-green-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        Trả Sách
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No borrowings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
