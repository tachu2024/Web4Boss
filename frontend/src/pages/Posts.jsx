import { useEffect, useState } from 'react';
import api from '../config/api';
import { useTopics } from '../context/TopicContext';
import { useNavigate } from 'react-router-dom';
import TopicFieldManager from '../components/TopicFieldManager';

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', config);
    return config;
});

// Thêm interceptor để log response
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default function Posts() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showFieldManager, setShowFieldManager] = useState(false);
    const [topicFields, setTopicFields] = useState([]);
    const [currentPost, setCurrentPost] = useState({
        id: null,
        title: '',
        fields: {}
    });
    const [error, setError] = useState('');
    const { topics: contextTopics, loading } = useTopics();

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            fetchPosts();
            fetchTopicFields();
        }
    }, [selectedTopic]);

    const fetchTopics = async () => {
        try {
            const response = await api.get('/api/topics/main');
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setError('Không thể tải danh sách chủ đề');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await api.get(`/api/posts?topicId=${selectedTopic.id}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Không thể tải danh sách bài viết');
        }
    };

    const fetchTopicFields = async () => {
        try {
            const response = await api.get(`/api/topic-fields/topic/${selectedTopic.id}`);
            setTopicFields(response.data);
        } catch (error) {
            console.error('Error fetching topic fields:', error);
        }
    };

    const handleOpenPostModal = (post = null) => {
        if (post) {
            setCurrentPost({
                id: post.id,
                title: post.title,
                fields: post.fields || {}
            });
        } else {
            setCurrentPost({
                id: null,
                title: '',
                fields: {}
            });
        }
        setShowPostModal(true);
    };

    const handleSavePost = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                ...currentPost,
                topicId: selectedTopic.id
            };

            if (currentPost.id) {
                await api.put(`/api/posts/${currentPost.id}`, postData);
            } else {
                await api.post('/api/posts', postData);
            }

            setShowPostModal(false);
            fetchPosts();
        } catch (error) {
            setError('Không thể lưu bài viết');
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                await api.delete(`/api/posts/${postId}`);
                fetchPosts();
            } catch (error) {
                setError('Không thể xóa bài viết');
            }
        }
    };

    const handleFileUpload = async (file, fieldKey) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload response:', response.data);

            setCurrentPost({
                ...currentPost,
                fields: { 
                    ...currentPost.fields, 
                    [fieldKey]: Array.isArray(currentPost.fields[fieldKey]) 
                        ? [...currentPost.fields[fieldKey], response.data.url]
                        : [response.data.url]
                }
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Không thể upload file');
        }
    };

    const handleFileDelete = async (fieldKey, index) => {
        try {
            const currentValue = currentPost.fields[fieldKey];
            if (currentValue && currentValue[index]) {
                const filename = currentValue[index].split('/').pop();
                await api.delete(`/api/files/${filename}`);
                
                const newImages = [...currentValue];
                newImages.splice(index, 1);
                
                setCurrentPost({
                    ...currentPost,
                    fields: { 
                        ...currentPost.fields, 
                        [fieldKey]: newImages.length > 0 ? newImages : null 
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            setError('Không thể xóa file');
        }
    };

    const renderFieldInput = (field) => {
        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={currentPost.fields[field.key] || ''}
                        onChange={(e) => setCurrentPost({
                            ...currentPost,
                            fields: { ...currentPost.fields, [field.key]: e.target.value }
                        })}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        required={field.required}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={currentPost.fields[field.key] || ''}
                        onChange={(e) => setCurrentPost({
                            ...currentPost,
                            fields: { ...currentPost.fields, [field.key]: e.target.value }
                        })}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        required={field.required}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={currentPost.fields[field.key] || ''}
                        onChange={(e) => setCurrentPost({
                            ...currentPost,
                            fields: { ...currentPost.fields, [field.key]: e.target.value }
                        })}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        required={field.required}
                    />
                );
            case 'image':
                return (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                e.preventDefault();
                                const file = e.target.files[0];
                                if (file) {
                                    handleFileUpload(file, field.key);
                                }
                            }}
                            className="mt-1 block w-full"
                            required={field.required && (!currentPost.fields[field.key] || currentPost.fields[field.key].length === 0)}
                        />
                        {currentPost.fields[field.key] && currentPost.fields[field.key].length > 0 && (
                            <div className="mt-4">
                                <div className="relative">
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={currentPost.fields[field.key][0]}
                                            alt="Preview"
                                            className="max-w-full h-64 object-contain rounded-lg"
                                        />
                                    </div>
                                    {currentPost.fields[field.key].length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newImages = [...currentPost.fields[field.key]];
                                                    const first = newImages.shift();
                                                    newImages.push(first);
                                                    setCurrentPost({
                                                        ...currentPost,
                                                        fields: { ...currentPost.fields, [field.key]: newImages }
                                                    });
                                                }}
                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-75"
                                            >
                                                ←
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newImages = [...currentPost.fields[field.key]];
                                                    const last = newImages.pop();
                                                    newImages.unshift(last);
                                                    setCurrentPost({
                                                        ...currentPost,
                                                        fields: { ...currentPost.fields, [field.key]: newImages }
                                                    });
                                                }}
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-75"
                                            >
                                                →
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {currentPost.fields[field.key].map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFileDelete(field.key, index);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                e.preventDefault();
                                const file = e.target.files[0];
                                if (file) {
                                    handleFileUpload(file, field.key);
                                }
                            }}
                            className="mt-1 block w-full"
                            required={field.required && !currentPost.fields[field.key]}
                        />
                        {currentPost.fields[field.key] && (
                            <div className="mt-2">
                                <video
                                    src={currentPost.fields[field.key]}
                                    controls
                                    className="max-w-xs rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFileDelete(field.key);
                                    }}
                                    className="mt-2 text-red-600 hover:text-red-800"
                                >
                                    Xóa video
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'array':
                return (
                    <textarea
                        value={Array.isArray(currentPost.fields[field.key]) 
                            ? currentPost.fields[field.key].join('\n')
                            : ''}
                        onChange={(e) => setCurrentPost({
                            ...currentPost,
                            fields: { ...currentPost.fields, [field.key]: e.target.value.split('\n') }
                        })}
                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        rows="3"
                        placeholder="Mỗi dòng một mục"
                        required={field.required}
                    />
                );
            default:
                return null;
        }
    };

    const renderFieldValue = (field, value) => {
        if (!value) return null;

        console.log('Field value:', field.name, value);

        switch (field.type) {
            case 'image':
                if (Array.isArray(value)) {
                    console.log('Image array:', value);
                    return (
                        <div className="relative">
                            <div className="flex items-center justify-center">
                                <img
                                    src={value[0]}
                                    alt={field.name}
                                    className="max-w-full h-64 object-contain rounded-lg"
                                    onError={(e) => console.error('Image load error:', e.target.src)}
                                />
                            </div>
                            {value.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newImages = [...value];
                                            const first = newImages.shift();
                                            newImages.push(first);
                                            setCurrentPost({
                                                ...currentPost,
                                                fields: { ...currentPost.fields, [field.key]: newImages }
                                            });
                                        }}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-75"
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newImages = [...value];
                                            const last = newImages.pop();
                                            newImages.unshift(last);
                                            setCurrentPost({
                                                ...currentPost,
                                                fields: { ...currentPost.fields, [field.key]: newImages }
                                            });
                                        }}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-75"
                                    >
                                        →
                                    </button>
                                </>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {value.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${field.name} ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    );
                }
                return (
                    <img
                        src={value}
                        alt={field.name}
                        className="max-w-full h-auto rounded-lg"
                    />
                );
            case 'video':
                return (
                    <video
                        src={value}
                        controls
                        className="max-w-full rounded-lg"
                    />
                );
            case 'array':
                return (
                    <ul className="list-disc list-inside">
                        {value.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                );
            default:
                return <span>{value}</span>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFieldManager(true)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Quản lý trường
                    </button>
                    <button
                        onClick={() => handleOpenPostModal()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thêm bài viết
                    </button>
                </div>
            </div>

            {/* Chọn chủ đề */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn chủ đề
                </label>
                <select
                    value={selectedTopic?.id || ''}
                    onChange={(e) => {
                        const topic = topics.find(t => t.id === e.target.value);
                        setSelectedTopic(topic);
                    }}
                    className="block w-full border rounded-md shadow-sm p-2"
                >
                    <option value="">Chọn chủ đề</option>
                    {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Danh sách bài viết */}
            {selectedTopic && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                            <div className="space-y-2">
                                {topicFields.map((field) => {
                                    const value = post.fields[field.key];
                                    if (!value) return null;

                                    if (field.type === 'image') {
                                        const images = Array.isArray(value) ? value : [value];
                                        return (
                                            <div key={field.id} className="relative">
                                                <div className="flex items-center justify-center">
                                                    <img
                                                        src={images[0]}
                                                        alt={field.name}
                                                        className="max-w-full h-48 object-contain rounded-lg"
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
                                                                const updatedPosts = posts.map(p => {
                                                                    if (p.id === post.id) {
                                                                        return {
                                                                            ...p,
                                                                            fields: {
                                                                                ...p.fields,
                                                                                [field.key]: newImages
                                                                            }
                                                                        };
                                                                    }
                                                                    return p;
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
                                                                const updatedPosts = posts.map(p => {
                                                                    if (p.id === post.id) {
                                                                        return {
                                                                            ...p,
                                                                            fields: {
                                                                                ...p.fields,
                                                                                [field.key]: newImages
                                                                            }
                                                                        };
                                                                    }
                                                                    return p;
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
                                    }
                                    return (
                                        <div key={field.id}>
                                            <h4 className="text-sm font-medium text-gray-700">
                                                {field.name}:
                                            </h4>
                                            <div className="mt-1">
                                                {renderFieldValue(field, value)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => handleOpenPostModal(post)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal thêm/sửa bài viết */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {currentPost.id ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                            </h2>
                            <button
                                onClick={() => setShowPostModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                        <form onSubmit={handleSavePost}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    value={currentPost.title}
                                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            {topicFields.map((field) => (
                                <div key={field.id} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.name}
                                        {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {renderFieldInput(field)}
                                    {field.description && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {field.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {currentPost.id ? 'Cập nhật' : 'Tạo bài viết'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal quản lý trường */}
            {showFieldManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <TopicFieldManager
                            topic={selectedTopic}
                            onClose={(updatedFields) => {
                                setTopicFields(updatedFields);
                                setShowFieldManager(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    );
}