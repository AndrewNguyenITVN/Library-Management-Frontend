import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// const mockBooks = [
//     { id: 1, title: "Lập trình Java", author: "Nguyễn Văn A", year: 2020 },
//     { id: 2, title: "Cơ sở dữ liệu", author: "Trần Thị B", year: 2019 },
//     { id: 3, title: "Thuật toán", author: "Lê Văn C", year: 2021 },
// ];

export default function BooksPage() {
    const [books, setBooks] = useState([]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xoá cuốn này chứ?")) return;
        try {
            const res = await fetch(`http://localhost:8080/book/delete-book?id=${id}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(res.status);
            const { data: success } = await res.json();
            if (success) {
                // cập nhật lại state, loại bỏ cuốn vừa xóa
                setBooks((prev) => prev.filter((b) => b.id !== id));
            } else {
                alert("Xoá thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối tới server");
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://localhost:8080/book/show-listof-all-books", {
                    method: "GET",
                });
                if (!res.ok) throw new Error(res.status);
                const json = await res.json();
                if (json.success) {
                    // ResponseData.data chứa List<BookDTO> từ service :contentReference[oaicite:0]{index=0}
                    setBooks(json.data);
                } else {
                    alert("Lấy danh sách sách thất bại");
                }
            } catch (err) {
                console.error(err);
                alert("Không thể kết nối tới server");
            }
        };

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
                                <td className="p-2 border">{book.stockQuantity}</td>
                                <td className="p-2 border text-center">{book.createdAt}</td>
                                <td className="p-2 border text-center">
                                    {/* <Link
                                        to={`/books/edit/${book.id}`}
                                        className="text-blue-600 hover:underline mr-2"
                                    >
                                        Sửa
                                    </Link> */}
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

