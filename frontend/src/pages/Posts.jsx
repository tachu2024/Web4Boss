import { useEffect, useState } from 'react';
import api from '../config/api';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [authForm, setAuthForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Kiểm tra token khi component mount
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchPosts();
        }
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (isRegistering && authForm.password !== authForm.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            if (isRegistering) {
                console.log('Registering...');
                const response = await api.post('/api/auth/register', {
                    username: authForm.username,
                    password: authForm.password
                });
                console.log('Register response:', response.data);
                // Sau khi đăng ký thành công, chuyển sang form đăng nhập
                setIsRegistering(false);
                setAuthForm({ ...authForm, password: '', confirmPassword: '' });
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
            } else {
                console.log('Logging in...');
                const response = await api.post('/api/auth/login', {
                    username: authForm.username,
                    password: authForm.password
                });
                console.log('Login response:', response.data);
                
                // Lưu token vào localStorage
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
                
                // Fetch posts sau khi login thành công
                fetchPosts();
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setPosts([]);
    };

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            const res = await api.get('/api/posts');
            console.log('Response:', res.data);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response?.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                handleLogout();
            }
        }
    };

    const handleCreate = async () => {
        try {
            console.log('Creating post...');
            await api.post('/api/posts', { content: newPost });
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log('Deleting post...');
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
            console.log('Updating post...');
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

            <div className="flex gap-2 mb-4">
                <input
                    className="border px-2"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Nội dung bài viết mới"
                />
                <button onClick={handleCreate} className="bg-blue-500 text-white px-4">Thêm</button>
            </div>

            {posts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
        </div>
    );
}


function PostItem({ post, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(post.content);

    return (
        <div className="border p-2 mb-2">
            {editing ? (
                <input value={text} onChange={(e) => setText(e.target.value)} />
            ) : (
                <div>{post.content}</div>
            )}

            <div className="flex gap-2 mt-2">
                {editing ? (
                    <button onClick={() => { onUpdate(post.id, text); setEditing(false); }} className="text-green-600">Lưu</button>
                ) : (
                    <button onClick={() => setEditing(true)} className="text-blue-600">Sửa</button>
                )}
                <button onClick={() => onDelete(post.id)} className="text-red-600">Xoá</button>
            </div>
        </div>
    );
}