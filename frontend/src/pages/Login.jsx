import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { useTopics } from '../context/TopicContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { refreshTopics } = useTopics();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { username, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(user));
            await refreshTopics(); // Refresh topics after successful login
            navigate('/home');
        } catch (error) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-8 text-white">Đăng nhập</h1>
                
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="mt-4 text-white text-center">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-blue-300 hover:text-blue-400">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
