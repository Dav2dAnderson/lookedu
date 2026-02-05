'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { components } from '@/api/generated/schema';
import {
    Loader2, User, Phone, Mail, LogOut, FileText,
    ChevronRight, BookOpen, Trash2, AlertCircle,
    CheckCircle2, X
} from 'lucide-react';
import { authService } from '@/auth/authService';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type UserProfile = components['schemas']['UserShort'];
type Application = components['schemas']['Applications'];

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Deletion state
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, appsRes] = await Promise.all([
                    apiClient.profile.me(),
                    apiClient.applications.list()
                ]);
                setProfile(profileRes.data);
                setApplications(appsRes.data);
            } catch (err: any) {
                setError('Failed to load profile data.');
                toast.error('Session expired. Please login again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (deletingIndex === null) return;
        setIsDeleting(true);
        try {
            await apiClient.applications.delete(deletingIndex);
            setApplications(apps => apps.filter(a => a.index !== deletingIndex));
            toast.success('Application removed successfully');
            setDeletingIndex(null);
        } catch (err) {
            toast.error('Failed to remove application');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl bg-red-50 p-12 text-center border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-400">Error Loading Profile</h2>
                    <p className="mt-2 text-red-700 dark:text-red-300 mb-8">{error || 'Something went wrong'}</p>
                    <Link href="/login" className="inline-flex items-center px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-8 lg:grid-cols-3"
            >
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
                        <div className="relative px-6 pb-8 pt-0 text-center">
                            <div className="relative -mt-12 mb-4 flex justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-4 ring-white dark:bg-gray-800 dark:ring-gray-900"
                                >
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                        <User className="h-12 w-12" />
                                    </div>
                                </motion.div>
                            </div>

                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                                {profile.first_name} {profile.last_name}
                            </h1>
                            <p className="text-sm font-bold text-indigo-500">@{profile.username}</p>

                            <div className="mt-8 space-y-3 text-left">
                                <div className="flex items-center space-x-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <Mail className="h-5 w-5 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{profile.email || 'No email'}</span>
                                </div>
                                <div className="flex items-center space-x-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <Phone className="h-5 w-5 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{profile.phone_number || 'No phone'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    authService.logout();
                                    toast.success('Logged out');
                                }}
                                className="mt-8 flex w-full items-center justify-center space-x-2 rounded-2xl bg-gray-50 px-4 py-4 text-sm font-black text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content: Applications */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="flex items-center space-x-2 text-2xl font-black text-gray-900 dark:text-white mb-6">
                            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <span>My Applications</span>
                        </h2>

                        <div className="grid gap-4">
                            <AnimatePresence mode="popLayout">
                                {applications.length > 0 ? (
                                    applications.map((app, idx) => (
                                        <motion.div
                                            key={app.index || idx}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex space-x-4">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                        <BookOpen className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                            {app.center.name}
                                                        </h3>
                                                        <p className="text-md font-bold text-indigo-600 dark:text-indigo-400">
                                                            {app.course.title}
                                                        </p>
                                                        <div className="mt-3 flex flex-wrap gap-3 items-center text-xs">
                                                            <span className="flex items-center text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-500 px-2 py-1 rounded-lg">
                                                                Applied on {formatDate(app.created_date)}
                                                            </span>
                                                            <span className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-green-700 font-bold dark:bg-green-900/20 dark:text-green-400">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Submitted
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <button
                                                        onClick={() => setDeletingIndex(app.index as number)}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                        title="Remove Application"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                    <ChevronRight className="h-5 w-5 text-gray-200" />
                                                </div>
                                            </div>

                                            {app.content && (
                                                <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                                        "{app.content}"
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 p-16 text-center"
                                    >
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 mb-6">
                                            <FileText className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No applications found</h3>
                                        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
                                            Ready to level up? Apply to our world-class educational centers.
                                        </p>
                                        <Link
                                            href="/educenters"
                                            className="inline-flex items-center rounded-2xl bg-indigo-600 px-8 py-4 text-md font-black text-white transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none"
                                        >
                                            Explore Centers
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            </motion.div>

            {/* Deletion Confirmation Modal */}
            <AnimatePresence>
                {deletingIndex !== null && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeletingIndex(null)}
                            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <Trash2 className="h-6 w-6" />
                                </div>
                                <button onClick={() => setDeletingIndex(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Application?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                This action cannot be undone. Are you sure you want to remove this application from your history?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setDeletingIndex(null)}
                                    className="flex-1 rounded-2xl bg-gray-100 px-6 py-4 font-bold text-gray-600 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-100 dark:shadow-none disabled:bg-red-400"
                                >
                                    {isDeleting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
