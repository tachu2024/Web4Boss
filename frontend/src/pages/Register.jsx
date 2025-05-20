import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        fullname: '',
        sex: '',
        birthday: '',
        address: '',
        occupation: '',
        hobby: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/auth/register', formData);
            setSuccess(true);
            // Đợi 2 giây để người dùng đọc thông báo thành công
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-8 text-white">Đăng ký</h1>
                
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500 text-white p-4 rounded mb-4">
                        Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="username"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="fullname"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Họ và tên"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <select
                            name="sex"
                            className="w-full px-4 py-2 rounded"
                            value={formData.sex}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="date"
                            name="birthday"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Ngày sinh"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="address"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Địa chỉ"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="occupation"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Nghề nghiệp"
                            value={formData.occupation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="hobby"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Sở thích"
                            value={formData.hobby}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="mt-4 text-white text-center">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-blue-300 hover:text-blue-400">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}