'use client';

import { useState } from 'react';
import { authService } from '@/auth/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.login({ username, password });
            toast.success('Welcome back!');
            router.push('/educenters');
        } catch (err) {
            toast.error('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-10 py-16 text-center text-white">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-5xl font-black tracking-tighter mb-4"
                        >
                            Sign In
                        </motion.h1>
                        <p className="text-indigo-100 font-medium">Access your personalized educational portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-10 py-12 space-y-8">
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 pb-5 pl-16 pr-6 pt-5 text-gray-900 font-bold placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all sm:text-lg"
                                    placeholder="Username"
                                />
                            </div>

                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 pb-5 pl-16 pr-6 pt-5 text-gray-900 font-bold placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all sm:text-lg"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer text-gray-600 dark:text-gray-400">
                                <input type="checkbox" className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700" />
                                <span className="text-sm font-bold">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-black text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot?</a>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="group flex w-full items-center justify-center space-x-3 rounded-2xl bg-gray-900 py-6 px-10 text-xl font-black text-white shadow-xl transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {isLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In Now</span>
                                    <LogIn className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-md font-bold text-gray-500">
                            New here?{' '}
                            <Link href="/register" className="text-indigo-600 hover:underline dark:text-indigo-400">
                                Create an account <ArrowRight className="inline h-4 w-4" />
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
