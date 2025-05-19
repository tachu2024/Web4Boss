import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            console.log('Registering...');
            const response = await api.post('/api/auth/register', {
                username: registerForm.username,
                password: registerForm.password
            });
            console.log('Register response:', response.data);
            
            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            console.error('Register error:', error);
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold mb-6 text-white">Đăng ký</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Confirm Password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
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
                        Đăng ký
                    </button>
                    <button 
                        type="button" 
                        className="text-white hover:text-blue-300 transition-colors"
                        onClick={() => navigate('/login')}
                    >
                        Đã có tài khoản? Đăng nhập
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}