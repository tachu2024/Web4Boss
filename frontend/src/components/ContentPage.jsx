import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import backgroundImage from '../img/denthuong.jpg';

export default function ContentPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [topicFields, setTopicFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch topic information
                const topicResponse = await api.get(`/api/topics/${topicId}`);
                setTopic(topicResponse.data);

                // Fetch topic fields
                const fieldsResponse = await api.get(`/api/topic-fields/topic/${topicId}`);
                setTopicFields(fieldsResponse.data);

                // Fetch posts for this topic
                const postsResponse = await api.get(`/api/posts?topicId=${topicId}`);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Không thể tải thông tin chủ đề. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (topicId) {
            fetchData();
        }
    }, [topicId]);

    const renderFieldValue = (field, value) => {
        if (!value) return <span className="text-gray-500">Chưa có dữ liệu</span>;

        switch (field.type) {
            case 'image':
                const images = Array.isArray(value) ? value : [value];
                return (
                    <div className="relative">
                        <div className="flex items-center justify-center">
                            <img 
                                src={images[0]}
                                alt={field.name} 
                                className="w-full h-48 object-cover rounded"
                            />
                        </div>
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = [...images];
                                        const first = newImages.shift();
                                        newImages.push(first);
                                        // Update the post's fields
                                        const updatedPosts = posts.map(post => {
                                            if (post.fields[field.key] === value) {
                                                return {
                                                    ...post,
                                                    fields: {
                                                        ...post.fields,
                                                        [field.key]: newImages
                                                    }
                                                };
                                            }
                                            return post;
                                        });
                                        setPosts(updatedPosts);
                                    }}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-75"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = [...images];
                                        const last = newImages.pop();
                                        newImages.unshift(last);
                                        // Update the post's fields
                                        const updatedPosts = posts.map(post => {
                                            if (post.fields[field.key] === value) {
                                                return {
                                                    ...post,
                                                    fields: {
                                                        ...post.fields,
                                                        [field.key]: newImages
                                                    }
                                                };
                                            }
                                            return post;
                                        });
                                        setPosts(updatedPosts);
                                    }}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-75"
                                >
                                    →
                                </button>
                            </>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <video 
                        src={value}
                        controls 
                        className="w-full rounded"
                    />
                );
            default:
                return <span className="text-white">{value}</span>;
        }
    };

    const handleCreatePost = () => {
        navigate(`/posts?topicId=${topicId}`);
    };

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
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl text-white">{topic.icon}</span>
                                <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
                            </div>
                            <button
                                onClick={handleCreatePost}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Tạo bài viết mới
                            </button>
                        </div>
                        {topic.description && (
                            <p className="text-gray-300 mb-8">{topic.description}</p>
                        )}

                        {/* Danh sách bài viết */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white bg-opacity-10 rounded-lg overflow-hidden">
                                    <div className="flex">
                                        {/* Cột hình ảnh */}
                                        <div className="w-1/3 flex items-center justify-center">
                                            {topicFields.find(field => field.type === 'image') && (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    {renderFieldValue(
                                                        topicFields.find(field => field.type === 'image'),
                                                        post.fields[topicFields.find(field => field.type === 'image')?.key]
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Cột thông tin */}
                                        <div className="w-2/3 p-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">{post.title}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {topicFields
                                                    .filter(field => field.type !== 'image')
                                                    .map((field) => (
                                                        <div key={field.id}>
                                                            <h4 className="text-sm font-medium text-gray-300">
                                                                {field.name}:
                                                            </h4>
                                                            <div className="mt-1">
                                                                {renderFieldValue(field, post.fields[field.key])}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-600">
                                                <p className="text-sm text-gray-400">
                                                    Đăng bởi: {post.userId}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Ngày đăng: {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {posts.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-white text-lg mb-4">
                                        Chưa có bài viết nào trong chủ đề này.
                                    </p>
                                    <button
                                        onClick={handleCreatePost}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Tạo bài viết đầu tiên
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-white text-lg">
                            Không tìm thấy thông tin chủ đề.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 