import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import AuthLayout from '../components/AuthLayout';
import backgroundImage from '../img/background.jpg';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra token khi component mount
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <AuthLayout>
                <h1 className="text-3xl font-bold mb-8 text-white">Chào mừng đến với Web4Boss</h1>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Đăng nhập
                    </button>
                    <button 
                        onClick={() => navigate('/register')}
                        className="w-full bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                        Đăng ký
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <MainLayout>
            <div 
                className="min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="p-8 min-h-screen bg-black bg-opacity-50">
                    <h1 className="text-3xl font-bold mb-4 text-white">Xin chào, tôi là một kỹ sư phần mềm yêu thích fullstack!</h1>
                    <p className="text-white text-lg">Bạn đã đăng nhập thành công. Hãy khám phá các tính năng của ứng dụng!</p>
                </div>
            </div>
        </MainLayout>
    );
}
