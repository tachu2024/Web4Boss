import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        sex: '',
        birthday: '',
        address: '',
        occupation: '',
        hobby: ''
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
            // Format birthday to YYYY-MM-DD
            const formattedBirthday = registerForm.birthday ? new Date(registerForm.birthday).toISOString().split('T')[0] : '';
            
            const response = await api.post('/api/auth/register', {
                username: registerForm.username,
                password: registerForm.password,
                fullname: registerForm.fullname,
                sex: registerForm.sex,
                birthday: formattedBirthday,
                address: registerForm.address,
                occupation: registerForm.occupation,
                hobby: registerForm.hobby
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
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Họ và tên"
                        value={registerForm.fullname}
                        onChange={(e) => setRegisterForm({...registerForm, fullname: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <select
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={registerForm.sex}
                        onChange={(e) => setRegisterForm({...registerForm, sex: e.target.value})}
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
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={registerForm.birthday}
                        onChange={(e) => setRegisterForm({...registerForm, birthday: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Địa chỉ"
                        value={registerForm.address}
                        onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Nghề nghiệp"
                        value={registerForm.occupation}
                        onChange={(e) => setRegisterForm({...registerForm, occupation: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Sở thích"
                        value={registerForm.hobby}
                        onChange={(e) => setRegisterForm({...registerForm, hobby: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Confirm Password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        required
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