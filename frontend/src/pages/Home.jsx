import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTopics } from '../context/TopicContext';
import AuthLayout from '../components/AuthLayout';
import loveImage from '../img/love.jpg';
import for4Image from '../img/for4.jpg';
import api from '../config/api';

export default function Home() {
    const { topics, loading, refreshTopics } = useTopics();
    const [userInfo, setUserInfo] = useState(null);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');
        
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        if (storedUserInfo && !isInitialized) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            setUsername(parsedUserInfo.username);
            setIsLoggedIn(true);
            setIsInitialized(true);
            // Fetch topics only once when user is logged in
            refreshTopics();
        }
    }, [isInitialized, refreshTopics]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserInfo(null);
        navigate('/login');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Chọn background image dựa vào username
    const backgroundImage = username === 'tachu2024' ? loveImage : for4Image;

    return (
        <div 
            className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 text-white p-8">
                <h1 className="text-4xl font-bold mb-4">
                    Xin chào {userInfo?.fullname}, một {userInfo?.occupation} yêu thích {userInfo?.hobby}!
                </h1>
                <p className="text-xl mb-8">
                    Bạn đã đăng nhập thành công, hãy trải nghiệm tính năng lưu trữ và ghi nhớ của trang web nhé.
                </p>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <img
                            src={userInfo?.avatar || '/default-avatar.png'}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Xin chào, {userInfo?.username || 'User'}!
                            </h1>
                            <p className="text-gray-600">
                                Chào mừng bạn đến với Web4Boss
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Chủ đề của bạn</h2>
                    {topics && topics.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Bạn chưa có chủ đề nào</p>
                            <Link
                                to="/topics"
                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Tạo chủ đề mới
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topics && topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    to={`/topic/${topic.id}`}
                                    className="block p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{topic.icon}</span>
                                        <span className="font-medium text-gray-900">{topic.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-blue-500 text-white p-4 rounded-lg mb-8 mt-8">
                    <h2 className="text-xl font-bold mb-2">Tính năng mới: Quản lý chủ đề</h2>
                    <p className="mb-4">Tạo và quản lý các chủ đề yêu thích của bạn. Bạn có thể:</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>Tạo chủ đề mới</li>
                        <li>Thêm chủ đề con</li>
                        <li>Xóa chủ đề không cần thiết</li>
                    </ul>
                    <Link
                        to="/topics"
                        className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100"
                    >
                        Khám phá ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
