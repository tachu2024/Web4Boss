import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopics } from '../context/TopicContext';

export default function Footer() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { clearTopics } = useTopics();

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearTopics();
        navigate('/login');
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
            <div className="container mx-auto px-4">
                <div className="flex justify-center space-x-4">
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Đăng xuất
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Đăng nhập
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
} 