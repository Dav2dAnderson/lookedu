import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/auth/tokenStorage';

const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return 'http://127.0.0.1:8000';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = getRefreshToken();
            if (refresh) {
                try {
                    const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh });
                    // Backend rotates refresh tokens, so we must save the new one if provided
                    setTokens({
                        access: data.access,
                        refresh: data.refresh || refresh
                    });
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
            } else {
                clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
