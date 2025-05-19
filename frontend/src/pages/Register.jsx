import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

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
        <div className="p-4">
            <h2 className="text-xl mb-4">Đăng ký</h2>
            <form onSubmit={handleRegister} className="max-w-md">
                <div className="mb-4">
                    <input
                        type="text"
                        className="border px-2 py-1 w-full"
                        placeholder="Username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="border px-2 py-1 w-full"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="border px-2 py-1 w-full"
                        placeholder="Confirm Password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    />
                </div>
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1">
                        Đăng ký
                    </button>
                    <button 
                        type="button" 
                        className="text-blue-500"
                        onClick={() => navigate('/login')}
                    >
                        Đã có tài khoản? Đăng nhập
                    </button>
                </div>
            </form>
        </div>
    );
}