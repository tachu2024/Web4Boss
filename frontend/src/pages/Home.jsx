import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import AuthLayout from '../components/AuthLayout';
import loveImage from '../img/love.jpg';
import for4Image from '../img/for4.jpg';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra token và thông tin người dùng khi component mount
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setIsLoggedIn(true);
            setUserInfo(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserInfo(null);
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

    // Chọn background image dựa vào username
    const backgroundImage = userInfo?.username === 'tachu2024' ? loveImage : for4Image;

    return (
        <MainLayout>
            <div 
                className="min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="p-8 min-h-screen bg-black bg-opacity-50">
                    <h1 className="text-3xl font-bold mb-4 text-white">
                        Xin chào {userInfo?.fullname}, tôi là một {userInfo?.occupation} yêu thích {userInfo?.hobby}!
                    </h1>
                    <p className="text-white text-lg">
                        Bạn đã đăng nhập thành công, hãy trải nghiệm tính năng lưu trữ và ghi nhớ Profile của trang web nhé
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
