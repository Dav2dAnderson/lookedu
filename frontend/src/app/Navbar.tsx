'use client';

import { useAuth } from '@/auth/AuthProvider';
import { authService } from '@/auth/authService';
import Link from 'next/link';
import { User, LogOut, Home, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                toast.success('Dark mode enabled');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                toast.success('Light mode enabled');
            }
            return next;
        });
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <nav
            className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
                ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg py-2 border-gray-200 dark:border-gray-800 shadow-sm'
                : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-4 border-transparent'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-12 justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex shrink-0 items-center"
                    >
                        <Link href="/educenters" className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                            Lookedu
                        </Link>
                    </motion.div>

                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-800 shadow-sm"
                            aria-label="Toggle Theme"
                        >
                            <AnimatePresence mode="wait">
                                {mounted ? (
                                    <motion.div
                                        key={isDark ? 'dark' : 'light'}
                                        initial={{ y: 10, opacity: 0, rotate: -45 }}
                                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                                        exit={{ y: -10, opacity: 0, rotate: 45 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
                                    </motion.div>
                                ) : (
                                    <div className="h-5 w-5" />
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {isAuthenticated && (
                            <>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />

                                <Link
                                    href="/educenters"
                                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                                >
                                    <Home className="h-4 w-4" />
                                    <span className="hidden sm:inline">Centers</span>
                                </Link>

                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
