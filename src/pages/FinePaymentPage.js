import React, { useState, useEffect } from "react";
import authFetch from '../utils/authFetch';

export default function FinePaymentPage() {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        borrowingId: "",
        amount: "",
        paymentMethod: "CASH",
        notes: ""
    });
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        fetchPayments();
    }, [filterStatus]);

    const fetchPayments = async () => {
        try {
            let url = "http://localhost:8080/fine-payment/all";
            if (filterStatus !== "ALL") {
                url = `http://localhost:8080/fine-payment/status/${filterStatus}`;
            }
            const res = await authFetch(url);
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            if (json.data) {
                setPayments(json.data);
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
            alert("Không thể lấy danh sách thanh toán");
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            const res = await authFetch("http://localhost:8080/fine-payment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            if (json.success) {
                alert("Tạo thanh toán thành công!");
                setShowModal(false);
                fetchPayments();
                resetForm();
            } else {
                alert("Tạo thanh toán thất bại");
            }
        } catch (err) {
            console.error("Error creating payment:", err);
            alert("Lỗi khi tạo thanh toán");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await authFetch(`http://localhost:8080/fine-payment/update-status/${id}?status=${newStatus}`, {
                method: "PUT",
            });
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            if (json.success) {
                alert("Cập nhật trạng thái thành công!");
                fetchPayments();
            } else {
                alert("Cập nhật trạng thái thất bại");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Lỗi khi cập nhật trạng thái");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thanh toán này?")) return;
        try {
            const res = await authFetch(`http://localhost:8080/fine-payment/delete/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(await res.text());
            const json = await res.json();
            if (json.success) {
                alert("Xóa thanh toán thành công!");
                fetchPayments();
            } else {
                alert("Xóa thanh toán thất bại");
            }
        } catch (err) {
            console.error("Error deleting payment:", err);
            alert("Lỗi khi xóa thanh toán");
        }
    };

    const resetForm = () => {
        setFormData({
            borrowingId: "",
            amount: "",
            paymentMethod: "CASH",
            notes: ""
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "REFUNDED":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý thanh toán tiền phạt</h1>
                <div className="flex gap-4">
                    <select
                        className="border rounded px-3 py-2"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Đang chờ</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="FAILED">Thất bại</option>
                        <option value="REFUNDED">Hoàn tiền</option>
                    </select>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thêm thanh toán mới
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người mượn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sách
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phương thức
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày thanh toán
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.readerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.bookName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {payment.amount.toLocaleString('vi-VN')} VNĐ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(payment.paymentDate).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <select
                                        className="border rounded px-2 py-1 mr-2"
                                        value={payment.status}
                                        onChange={(e) => handleUpdateStatus(payment.id, e.target.value)}
                                    >
                                        <option value="PENDING">Đang chờ</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                        <option value="FAILED">Thất bại</option>
                                        <option value="REFUNDED">Hoàn tiền</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(payment.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm thanh toán mới</h3>
                            <form onSubmit={handleCreatePayment}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">ID Lượt mượn</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.borrowingId}
                                        onChange={(e) => setFormData({ ...formData, borrowingId: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        required
                                    >
                                        <option value="CASH">Tiền mặt</option>
                                        <option value="CARD">Thẻ</option>
                                        <option value="TRANSFER">Chuyển khoản</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                    <textarea
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Tạo thanh toán
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 