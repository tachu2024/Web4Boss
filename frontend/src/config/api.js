import axios from 'axios';
import { API_URL } from './env';

// Debug: Log toàn bộ biến môi trường
console.log('All env variables:', import.meta.env);

// Sử dụng biến môi trường trực tiếp
console.log('API URL:', API_URL);

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Thêm option này để gửi credentials
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
    });
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Thêm interceptor để log response và xử lý lỗi
api.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            
            // Xử lý lỗi 401 (Unauthorized)
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api; 