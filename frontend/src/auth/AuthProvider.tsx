'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken } from './tokenStorage';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '../api/client';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = async () => {
        const token = getAccessToken();
        if (token) {
            try {
                // Verify token with backend
                await apiClient.profile.me();
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            await checkAuth();
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async () => {
        await checkAuth();
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        if (isLoading) return;

        const publicPaths = ['/login', '/register'];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            router.push('/login');
        } else if (isAuthenticated && isPublicPath) {
            router.push('/educenters');
        }
    }, [pathname, isAuthenticated, isLoading, router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
