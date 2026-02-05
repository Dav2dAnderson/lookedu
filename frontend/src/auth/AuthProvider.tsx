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
        const isAuth = !!token;
        setIsAuthenticated(isAuth);
        setIsLoading(false);

        const publicPaths = ['/login', '/register'];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isLoading) {
            if (!isAuth && !isPublicPath) {
                router.push('/login');
            } else if (isAuth && isPublicPath) {
                router.push('/educenters');
            }
        }
    }, [pathname, isLoading, router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
