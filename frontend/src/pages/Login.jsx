import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

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
        <div className="p-4">
            <h2 className="text-xl mb-4">Đăng nhập</h2>
            <form onSubmit={handleLogin} className="max-w-md">
                <div className="mb-4">
                    <input
                        type="text"
                        className="border px-2 py-1 w-full"
                        placeholder="Username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="border px-2 py-1 w-full"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    />
                </div>
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1">
                        Đăng nhập
                    </button>
                    <button 
                        type="button" 
                        className="text-blue-500"
                        onClick={() => navigate('/register')}
                    >
                        Chưa có tài khoản? Đăng ký
                    </button>
                </div>
            </form>
        </div>
    );
}
