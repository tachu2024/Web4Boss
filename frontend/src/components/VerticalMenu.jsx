import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTopics } from '../context/TopicContext';

export default function VerticalMenu() {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [expandedTopics, setExpandedTopics] = useState({});
    const location = useLocation();
    const { topics, loading } = useTopics();

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const toggleSubmenu = (topicId) => {
        setExpandedTopics(prev => ({
            ...prev,
            [topicId]: !prev[topicId]
        }));
    };

    const mainMenu = [
        { path: '/home', name: '🏠 Trang chủ' },
        { path: '/posts', name: '📝 Bài viết' },
        { path: '/topics', name: '📚 Chủ đề' }
    ];

    return (
        <div className={`bg-gray-800 text-white transition-all duration-300 ${isMenuVisible ? 'w-64' : 'w-16'}`}>
            <button 
                onClick={toggleMenu}
                className="w-full p-4 text-left hover:bg-gray-700 flex items-center justify-between"
            >
                <span className={isMenuVisible ? '' : 'hidden'}>Menu</span>
                <span>{isMenuVisible ? '◀' : '▶'}</span>
            </button>

            <nav className="mt-4">
                {/* Main Menu */}
                {mainMenu.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname === item.path ? 'bg-gray-700' : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}

                {/* Divider and Topic Label */}
                <div className="mt-4 mb-2">
                    <div className="border-t border-gray-600 my-2"></div>
                    <div className="px-4 py-2 text-gray-400 text-sm font-semibold">
                        Topic
                    </div>
                </div>

                {/* Topics Menu */}
                {loading ? (
                    <div className="px-4 py-2 text-gray-400">Loading...</div>
                ) : (
                    topics.map((topic) => (
                        <div key={topic.id} className="relative">
                            <div className="flex items-center justify-between">
                                <Link
                                    to={`/topic/${topic.id}`}
                                    className={`block px-4 py-2 hover:bg-gray-700 flex-grow ${location.pathname === `/topic/${topic.id}` ? 'bg-gray-700' : ''}`}
                                >
                                    {topic.icon} {topic.name}
                                </Link>
                                {topic.children && topic.children.length > 0 && (
                                    <button
                                        onClick={() => toggleSubmenu(topic.id)}
                                        className="px-2 py-2 hover:bg-gray-700"
                                    >
                                        {expandedTopics[topic.id] ? '▼' : '▶'}
                                    </button>
                                )}
                            </div>
                            
                            {/* Submenu */}
                            {expandedTopics[topic.id] && topic.children && topic.children.length > 0 && (
                                <div className="ml-4 border-l-2 border-gray-600">
                                    {topic.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            to={`/topic/${child.id}`}
                                            className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname === `/topic/${child.id}` ? 'bg-gray-700' : ''}`}
                                        >
                                            {child.icon} {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </nav>
        </div>
    );
} 