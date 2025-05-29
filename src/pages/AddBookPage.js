// src/pages/AddBookPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authFetch from '../utils/authFetch';

export default function AddBookPage() {
    const [nameBook, setNameBook] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [bookSeri, setBookSeri] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Vui lòng chọn file ảnh bìa");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("nameBook", nameBook);
        formData.append("bookSeri", bookSeri);
        formData.append("categoryId", categoryId);
        formData.append("stockQuantity", stockQuantity);

        try {
            const res = await authFetch("http://localhost:8080/book/add-book", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            if (json.data) {
                alert("Thêm sách thành công!");
                navigate("/books");
            } else {
                alert("Thêm sách thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi thêm sách");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <form
                onSubmit={handleAddBook}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                    Thêm sách mới
                </h2>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Tên sách</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={nameBook}
                        onChange={(e) => setNameBook(e.target.value)}
                        required
                        placeholder="Nhập tên sách"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Mã sách</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={bookSeri}
                        onChange={(e) => setBookSeri(e.target.value)}
                        required
                        placeholder="Nhập bookSeri"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Thể loại (ID)</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        placeholder="Nhập categoryId"
                    />
                </div>



                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Số lượng</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                        placeholder="Nhập stockQuantity"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Ảnh bìa</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Thêm sách
                </button>
            </form>
        </div>
    );
}
