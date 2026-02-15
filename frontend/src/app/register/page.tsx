'use client';

import { useState } from 'react';
import { authService } from '@/auth/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, UserPlus, ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.register({
                username: formData.username,
                email: formData.email,
                phone_number: formData.phone_number,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password_confirm: formData.password // Backend might expect this or not, aligning with previous logic
            });
            toast.success('Account created successfully! Welcome to Lookedu.');
            router.push('/login');
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorData = err.response?.data;
            if (errorData && typeof errorData === 'object') {
                // Iterate through all fields and show their errors
                Object.keys(errorData).forEach((field) => {
                    const messages = errorData[field];
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => toast.error(`${field}: ${msg}`));
                    } else {
                        toast.error(`${field}: ${messages}`);
                    }
                });
            } else {
                toast.error('Registration failed. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-[90vh] items-center justify-center px-4 py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <div className="overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 px-10 py-16 text-center text-white">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-5xl font-black tracking-tighter mb-4"
                        >
                            Join Lookedu
                        </motion.h1>
                        <p className="text-purple-100 font-medium text-lg">Your journey to world-class education starts here</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-10 py-12 space-y-10">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-6">
                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            name="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 pl-14 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                            placeholder="johndoe"
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            name="phone_number"
                                            required
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 pl-14 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 pl-14 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                            placeholder="hello@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Security Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 pl-14 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 pt-4">
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">First Name</label>
                                <input
                                    name="first_name"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                    placeholder="John"
                                />
                            </div>
                            <div className="group space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Last Name</label>
                                <input
                                    name="last_name"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 font-bold text-gray-900 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none dark:bg-gray-800 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all shadow-sm"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="group flex w-full items-center justify-center space-x-3 rounded-3xl bg-gray-900 py-6 px-10 text-xl font-black text-white shadow-2xl transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-purple-600 dark:hover:bg-purple-700 shadow-purple-200 dark:shadow-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                <>
                                    <span>Create My Account</span>
                                    <UserPlus className="h-6 w-6 transition-transform group-hover:rotate-12" />
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-md font-bold text-gray-500">
                            Already part of our community?{' '}
                            <Link href="/login" className="text-purple-600 hover:underline dark:text-purple-400">
                                Log In <ArrowRight className="inline h-4 w-4" />
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
