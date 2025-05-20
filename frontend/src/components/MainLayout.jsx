import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalMenu from './VerticalMenu';

export default function MainLayout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    };

    const handleMenuToggle = (visible) => {
        setIsMenuVisible(visible);
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="flex">
            <VerticalMenu onToggle={handleMenuToggle} />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isMenuVisible ? 'ml-0' : 'ml-0'}`}>
                <div className="p-4 border-b">
                    <div className="flex justify-end">
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
} 