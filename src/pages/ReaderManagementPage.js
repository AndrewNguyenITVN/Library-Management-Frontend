import React, { useState, useEffect } from 'react';

export default function ReaderManagementPage() {
    const [readers, setReaders] = useState([]);
    const [nameReader, setNameReader] = useState('');
    const [identityCard, setIdentityCard] = useState('');
    const [phone, setPhone] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchIdCard, setSearchIdCard] = useState('');

    useEffect(() => {
        fetchAllReaders();
    }, []);

    const fetchAllReaders = async () => {
        try {
            const response = await fetch('http://localhost:8080/reader/get-all-users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setReaders(data.data || []); // Ensure readers is an array
            } else {
                console.error('Failed to fetch readers:', data.desc);
                setReaders([]); // Set to empty array on failure
            }
        } catch (error) {
            console.error('Error fetching readers:', error);
            setReaders([]); // Set to empty array on error
            alert('Lỗi kết nối tới server hoặc server trả về lỗi. Vui lòng kiểm tra console.');
        }
    };

    const handleInsertReader = async (e) => {
        e.preventDefault();
        if (!nameReader || !identityCard || !phone) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/reader/insert-reader?nameReader=${encodeURIComponent(nameReader)}&identityCard=${encodeURIComponent(identityCard)}&phone=${encodeURIComponent(phone)}`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                alert('Thêm người đọc thành công');
                fetchAllReaders();
                setNameReader('');
                setIdentityCard('');
                setPhone('');
            } else {
                alert(`Thêm người đọc thất bại: ${data.desc || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error inserting reader:', error);
            alert('Lỗi khi thêm người đọc. Vui lòng kiểm tra console.');
        }
    };

    const handleSearchByName = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/reader/search?nameReader=${encodeURIComponent(searchName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setReaders(data.data || []);
            } else {
                setReaders([]);
                alert(`Không tìm thấy người đọc: ${data.desc || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error searching readers by name:', error);
            setReaders([]);
            alert('Lỗi khi tìm kiếm. Vui lòng kiểm tra console.');
        }
    };

    const handleSearchByIdCard = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/reader/search-by-idcard?identityCard=${encodeURIComponent(searchIdCard)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setReaders(data.data || []);
            } else {
                setReaders([]);
                alert(`Không tìm thấy người đọc: ${data.desc || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error searching readers by identity card:', error);
            setReaders([]);
            alert('Lỗi khi tìm kiếm. Vui lòng kiểm tra console.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-300 p-4 sm:p-8">
            <div className="container mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-indigo-700">
                    Quản Lý Độc Giả
                </h1>

                {/* Insert Reader Form */}
                <div className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Thêm Độc Giả Mới</h2>
                    <form onSubmit={handleInsertReader} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="nameReader" className="block mb-1 font-medium text-gray-700">Tên Độc Giả</label>
                                <input id="nameReader" type="text" value={nameReader} onChange={(e) => setNameReader(e.target.value)} placeholder="Nguyễn Văn A" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="identityCard" className="block mb-1 font-medium text-gray-700">Số CCCD</label>
                                <input id="identityCard" type="text" value={identityCard} onChange={(e) => setIdentityCard(e.target.value)} placeholder="012345678910" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">Số Điện Thoại</label>
                                <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                            </div>
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-indigo-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Thêm Độc Giả
                        </button>
                    </form>
                </div>

                {/* Search Forms */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-purple-50 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-purple-600">Tìm Theo Tên</h2>
                        <form onSubmit={handleSearchByName} className="flex space-x-3">
                            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Nhập tên độc giả"
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" />
                            <button type="submit" className="bg-purple-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-purple-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                                Tìm Kiếm
                            </button>
                        </form>
                    </div>
                    <div className="p-6 bg-teal-50 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-teal-600">Tìm Theo CCCD</h2>
                        <form onSubmit={handleSearchByIdCard} className="flex space-x-3">
                            <input type="text" value={searchIdCard} onChange={(e) => setSearchIdCard(e.target.value)} placeholder="Nhập số CCCD"
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm" />
                            <button type="submit" className="bg-teal-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-teal-700 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                                Tìm Kiếm
                            </button>
                        </form>
                    </div>
                </div>
                <button onClick={fetchAllReaders} className="mb-6 bg-gray-500 text-white py-2 px-5 rounded-md font-semibold hover:bg-gray-600 transition duration-150 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                    Tải Lại Toàn Bộ Danh Sách
                </button>

                {/* Reader List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Danh Sách Độc Giả</h2>
                    {readers && readers.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Độc Giả</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số CCCD</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {readers.map((reader, index) => (
                                        <tr key={reader.id || index} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.nameReader}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.identityCard}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Không có dữ liệu độc giả để hiển thị, hoặc đã xảy ra lỗi khi tải.</p>
                    )}
                </div>
            </div>
        </div>
    );
}