import React from "react";
import { Link } from "react-router-dom";

const mockBooks = [
    { id: 1, title: "Lập trình Java", author: "Nguyễn Văn A", year: 2020 },
    { id: 2, title: "Cơ sở dữ liệu", author: "Trần Thị B", year: 2019 },
    { id: 3, title: "Thuật toán", author: "Lê Văn C", year: 2021 },
];

export default function BooksPage() {
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
                            <th className="p-2 border">Tác giả</th>
                            <th className="p-2 border">Năm</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockBooks.map((book, idx) => (
                            <tr key={book.id} className="hover:bg-blue-50">
                                <td className="p-2 border text-center">{idx + 1}</td>
                                <td className="p-2 border">{book.title}</td>
                                <td className="p-2 border">{book.author}</td>
                                <td className="p-2 border text-center">{book.year}</td>
                                <td className="p-2 border text-center">
                                    <Link
                                        to={`/books/edit/${book.id}`}
                                        className="text-blue-600 hover:underline mr-2"
                                    >
                                        Sửa
                                    </Link>
                                    <button className="text-red-600 hover:underline">Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}