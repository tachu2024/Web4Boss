import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api';
import backgroundImage from '../img/denthuong.jpg';

export default function ContentPage() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await api.get(`/api/topics/${topicId}`);
                setTopic(response.data);
            } catch (error) {
                console.error('Error fetching topic:', error);
                setError(`Chưa thể tải thông tin chủ đề "${topicId}". Đang chờ anh Tuấn Anh thiết kế CMS và DB. Nội dung sẽ được cập nhật sau.`);
            } finally {
                setLoading(false);
            }
        };

        if (topicId) {
            fetchTopic();
        }
    }, [topicId]);

    if (loading) {
        return (
            <div 
                className="min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="p-8 min-h-screen bg-black bg-opacity-50">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="p-8 min-h-screen bg-black bg-opacity-50">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="p-8 min-h-screen bg-black bg-opacity-50">
                {topic ? (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl text-white">{topic.icon}</span>
                            <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
                        </div>
                        {topic.description && (
                            <p className="text-gray-300 mb-8">{topic.description}</p>
                        )}
                        <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                            <p className="text-white text-lg">
                                Đang chờ anh Tuấn Anh thiết kế CMS và DB cho chủ đề "{topic.name}". Nội dung sẽ được cập nhật sau.
                            </p>
                            <p className="text-white text-lg mt-4">
                                Nội dung chủ đề này đang được phát triển...
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4 text-white">Chủ đề Chưa tồn tại</h2>
                        <p className="text-gray-300">
                            Chủ đề bạn đang tìm kiếm Chưa tồn tại hoặc đã bị xóa.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 