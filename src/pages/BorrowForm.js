import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BookForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    // Nếu là sửa thì sẽ lấy dữ liệu sách từ API, ở đây demo tạm
    const [title, setTitle] = useState(isEdit ? "Tên sách demo" : "");
    const [author, setAuthor] = useState(isEdit ? "Tác giả demo" : "");
    const [year, setYear] = useState(isEdit ? 2022 : "");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi API thêm/sửa sách ở đây
        alert(isEdit ? "Cập nhật sách thành công!" : "Thêm sách thành công!");
        navigate("/books");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
                    {isEdit ? "Cập nhật sách" : "Thêm sách mới"}
                </h2>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Tên sách</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Nhập tên sách"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Tác giả</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        placeholder="Nhập tên tác giả"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Năm xuất bản</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                        placeholder="Nhập năm xuất bản"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    {isEdit ? "Cập nhật" : "Thêm mới"}
                </button>
            </form>
        </div>
    );
}