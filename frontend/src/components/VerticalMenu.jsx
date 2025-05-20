import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function VerticalMenu({ onToggle }) {
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const menuItems = [
        { id: 'family', name: 'Family' },
        {
            id: 'sport',
            name: 'Sport',
            subItems: ['Gym', 'Yoga', 'Burn', 'Swim', 'Run', 'Cycle', 'Guitar']
        },
        { id: 'camera', name: 'Camera Thông minh' },
        { id: 'technical', name: 'Technical' },
        { id: 'car', name: 'Car' },
        { id: 'english', name: 'English' },
        { id: 'friend', name: 'Friend' },
        { id: 'commic', name: 'Truyện Tranh' }
    ];

    const toggleSubMenu = (menuId) => {
        setExpandedMenu(expandedMenu === menuId ? null : menuId);
    };

    const toggleMenu = () => {
        const newState = !isMenuVisible;
        setIsMenuVisible(newState);
        onToggle(newState);
    };

    return (
        <div 
            className={`bg-gray-100 min-h-screen relative transition-all duration-300 ease-in-out ${
                isMenuVisible ? 'w-64' : 'w-0'
            }`}
        >
            <button
                onClick={toggleMenu}
                className="absolute -right-4 top-4 bg-teal-600 text-white p-1 rounded-full hover:bg-teal-700 transition-colors z-10"
            >
                {isMenuVisible ? '◀' : '▶'}
            </button>
            <div className="p-4 overflow-hidden">
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleSubMenu(item.id)}
                                            className="w-full text-left px-4 py-2 text-blue-600 font-bold hover:bg-teal-700 hover:text-white rounded flex justify-between items-center transition-colors"
                                        >
                                            <span>{item.name}</span>
                                            <span className="text-blue-400">
                                                {expandedMenu === item.id ? '▼' : '▶'}
                                            </span>
                                        </button>
                                        {expandedMenu === item.id && (
                                            <ul className="ml-4 mt-2 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem}>
                                                        <Link
                                                            to={`/sport/${subItem.toLowerCase()}`}
                                                            className="block px-4 py-2 text-blue-600 font-bold hover:bg-teal-700 hover:text-white rounded transition-colors"
                                                        >
                                                            {subItem}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={`/${item.id.toLowerCase()}`}
                                        className="block px-4 py-2 text-blue-600 font-bold hover:bg-teal-700 hover:text-white rounded transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
} 