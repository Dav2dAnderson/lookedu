import { apiClient } from '../api/client';
import { setTokens, clearTokens, getRefreshToken } from './tokenStorage';

export const authService = {
    async login(credentials: any) {
        const { data } = await apiClient.auth.login(credentials);
        setTokens({
            access: data.access,
            refresh: data.refresh,
        });
        return data;
    },

    async register(userData: any) {
        const { data } = await apiClient.auth.register(userData);
        return data;
    },

    async logout() {
        try {
            const refresh = getRefreshToken();
            if (refresh) {
                await apiClient.auth.logout(refresh);
            }
        } catch (error) {
            console.error('Backend logout failed', error);
        } finally {
            clearTokens();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    },

};
