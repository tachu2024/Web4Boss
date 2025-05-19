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
    }
});

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

export default api; 