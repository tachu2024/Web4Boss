import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Logging in...');
            const response = await api.post('/api/auth/login', loginForm);
            console.log('Login response:', response.data);
            
            // Lưu token vào localStorage
            localStorage.setItem('token', response.data.token);
            
            // Chuyển hướng đến trang posts sau khi đăng nhập thành công
            navigate('/posts');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold mb-6 text-white">Đăng nhập</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    />
                </div>
                {error && (
                    <div className="text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Đăng nhập
                    </button>
                    <button 
                        type="button" 
                        className="text-white hover:text-blue-300 transition-colors"
                        onClick={() => navigate('/register')}
                    >
                        Chưa có tài khoản? Đăng ký
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
