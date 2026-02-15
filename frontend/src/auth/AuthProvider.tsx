'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken } from './tokenStorage';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = getAccessToken();
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

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
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
