import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// const mockBooks = [
//     { id: 1, title: "Lập trình Java", author: "Nguyễn Văn A", year: 2020 },
//     { id: 2, title: "Cơ sở dữ liệu", author: "Trần Thị B", year: 2019 },
//     { id: 3, title: "Thuật toán", author: "Lê Văn C", year: 2021 },
// ];

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        bookSeri: '',
        nameBook: '',
        stockQuantity: '',
        categoryId: '',
        categoryName: '',
        imageUrl: ''
    });

    const handleEdit = (book) => {
        setSelectedBook(book);
        setFormData({
            bookSeri: book.bookSeri || '',
            nameBook: book.nameBook || '',
            stockQuantity: book.stockQuantity || '',
            categoryId: book.categoryId || '',
            categoryName: book.categoryName || '',
            imageUrl: book.imageUrl || ''
        });
        setShowUpdateModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBook) return;

        const formDataToSend = new FormData();
        // Always append a file parameter, even if empty
        if (formData.file) {
            formDataToSend.append('file', formData.file);
        } else {
            // Create an empty file object
            const emptyFile = new File([], 'empty.txt', { type: 'text/plain' });
            formDataToSend.append('file', emptyFile);
        }
        formDataToSend.append('bookSeri', formData.bookSeri);
        formDataToSend.append('nameBook', formData.nameBook);
        formDataToSend.append('stockQuantity', formData.stockQuantity);
        formDataToSend.append('categoryId', formData.categoryId);

        try {
            const res = await fetch(`http://localhost:8080/book/update/${selectedBook.id}`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (!res.ok) throw new Error(res.status);
            const { success } = await res.json();

            if (success) {
                // Refresh the books list
                fetchBooks();
                setShowUpdateModal(false);
                alert('Cập nhật sách thành công!');
            } else {
                alert('Cập nhật sách thất bại!');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối tới server');
        }
    };

    const fetchBooks = async () => {
        try {
            const res = await fetch("http://localhost:8080/book/show-all-books", {
                method: "GET",
            });
            if (!res.ok) throw new Error(res.status);
            const json = await res.json();
            if (json.success) {
                setBooks(json.data);
            } else {
                alert("Lấy danh sách sách thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">Quản lý sách</h2>
                    <Link
                        to="/books/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Thêm sách mới
                    </Link>
                </div>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="p-2 border">STT</th>
                            <th className="p-2 border">Tên sách</th>
                            <th className="p-2 border">Thể loại</th>
                            <th className="p-2 border">Số lượng</th>
                            <th className="p-2 border">Năm</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, idx) => (
                            <tr key={book.id ?? idx} className="hover:bg-blue-50">
                                <td className="p-2 border text-center">{idx + 1}</td>
                                <td className="p-2 border">{book.nameBook}</td>
                                <td className="p-2 border">{book.categoryName}</td>
                                <td className="p-2 border">{book.stockQuantity}</td>
                                <td className="p-2 border text-center">{book.createdAt}</td>
                                <td className="p-2 border text-center">
                                    <button
                                        onClick={() => handleEdit(book)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Cập nhật
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Cập nhật thông tin sách</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Mã sách</label>
                                <input
                                    type="text"
                                    name="bookSeri"
                                    value={formData.bookSeri}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Tên sách</label>
                                <input
                                    type="text"
                                    name="nameBook"
                                    value={formData.nameBook}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Số lượng</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Mã danh mục</label>
                                <input
                                    type="number"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Hình ảnh</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border rounded"
                                />
                                <p className="text-sm text-gray-500 mt-1">Để trống nếu không muốn thay đổi ảnh</p>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

