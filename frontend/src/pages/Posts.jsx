import { useEffect, useState } from 'react';
import api from '../config/api';
import { useTopics } from '../context/TopicContext';

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
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showAddPost, setShowAddPost] = useState(false);
    const [showAddField, setShowAddField] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [authForm, setAuthForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { topics, loading } = useTopics();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            if (selectedTopic) {
                fetchPosts();
            }
        }
    }, [selectedTopic]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        if (isRegistering && authForm.password !== authForm.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            if (isRegistering) {
                const response = await api.post('/api/auth/register', {
                    username: authForm.username,
                    password: authForm.password
                });
                setIsRegistering(false);
                setAuthForm({ ...authForm, password: '', confirmPassword: '' });
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
            } else {
                const response = await api.post('/api/auth/login', {
                    username: authForm.username,
                    password: authForm.password
                });
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setPosts([]);
        setSelectedTopic(null);
    };

    const fetchPosts = async () => {
        try {
            const res = await api.get(`/api/posts?topicId=${selectedTopic.id}`);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/api/posts', { 
                content: newPost,
                topicId: selectedTopic.id 
            });
            setNewPost('');
            fetchPosts();
            setShowAddPost(false);
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/posts/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleUpdate = async (id, updatedContent) => {
        try {
            await api.put(`/api/posts/${id}`, { content: updatedContent });
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="p-4">
                <h2 className="text-xl mb-4">{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</h2>
                <form onSubmit={handleAuth} className="max-w-md">
                    <div className="mb-4">
                        <input
                            type="text"
                            className="border px-2 py-1 w-full"
                            placeholder="Username"
                            value={authForm.username}
                            onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            className="border px-2 py-1 w-full"
                            placeholder="Password"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        />
                    </div>
                    {isRegistering && (
                        <div className="mb-4">
                            <input
                                type="password"
                                className="border px-2 py-1 w-full"
                                placeholder="Confirm Password"
                                value={authForm.confirmPassword}
                                onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                            />
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-1">
                            {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
                        </button>
                        <button 
                            type="button" 
                            className="text-blue-500"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setAuthForm({ username: '', password: '', confirmPassword: '' });
                            }}
                        >
                            {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Bài viết</h2>
                <button onClick={handleLogout} className="text-red-600">
                    Đăng xuất
                </button>
            </div>

            {/* Topic Selection */}
            <div className="mb-6">
                <h3 className="text-lg mb-2">Chọn chủ đề:</h3>
                <select
                    value={selectedTopic?.id || ''}
                    onChange={(e) => {
                        const topic = topics.find(t => t.id === e.target.value);
                        setSelectedTopic(topic);
                    }}
                    className="w-full md:w-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Chọn chủ đề --</option>
                    {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.icon} {topic.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            {selectedTopic && (
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => {
                            setShowAddPost(true);
                            setShowAddField(false);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thêm bài viết
                    </button>
                    <button
                        onClick={() => {
                            setShowAddField(true);
                            setShowAddPost(false);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Thêm trường hiển thị
                    </button>
                </div>
            )}

            {/* Add Post Form */}
            {showAddPost && selectedTopic && (
                <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg mb-2">Thêm bài viết mới cho chủ đề: {selectedTopic.name}</h3>
                    <div className="flex gap-2">
                        <input
                            className="border px-2 py-1 flex-grow"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Nội dung bài viết mới"
                        />
                        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-1">
                            Thêm
                        </button>
                        <button 
                            onClick={() => setShowAddPost(false)} 
                            className="bg-gray-500 text-white px-4 py-1"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Add Field Form */}
            {showAddField && selectedTopic && (
                <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg mb-2">Thêm trường hiển thị cho chủ đề: {selectedTopic.name}</h3>
                    <p className="text-gray-600 mb-4">Chức năng đang được phát triển...</p>
                    <button 
                        onClick={() => setShowAddField(false)} 
                        className="bg-gray-500 text-white px-4 py-1"
                    >
                        Đóng
                    </button>
                </div>
            )}

            {/* Posts List */}
            {selectedTopic && (
                <div>
                    <h3 className="text-lg mb-2">Danh sách bài viết:</h3>
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} onDelete={handleDelete} onUpdate={handleUpdate} />
                    ))}
                </div>
            )}
        </div>
    );
}

function PostItem({ post, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(post.content);

    return (
        <div className="border p-4 mb-4 rounded-lg">
            {editing ? (
                <input 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="w-full border px-2 py-1 mb-2"
                />
            ) : (
                <div className="mb-2">{post.content}</div>
            )}

            <div className="flex gap-2">
                {editing ? (
                    <button 
                        onClick={() => { onUpdate(post.id, text); setEditing(false); }} 
                        className="text-green-600 hover:text-green-700"
                    >
                        Lưu
                    </button>
                ) : (
                    <button 
                        onClick={() => setEditing(true)} 
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Sửa
                    </button>
                )}
                <button 
                    onClick={() => onDelete(post.id)} 
                    className="text-red-600 hover:text-red-700"
                >
                    Xoá
                </button>
            </div>
        </div>
    );
}