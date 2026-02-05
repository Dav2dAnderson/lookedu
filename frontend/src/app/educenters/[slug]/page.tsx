'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { components } from '@/api/generated/schema';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Phone, MapPin, Info, Users, BookOpen, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Educeter = components['schemas']['CentersRetrieve'];

export default function EduceterDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [center, setCenter] = useState<Educeter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        const fetchCenter = async () => {
            try {
                const { data } = await apiClient.educenters.get(slug as string);
                setCenter(data);
            } catch (err: any) {
                setError('Failed to load center details. It might have been moved or deleted.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCenter();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6" />
                <div className="h-[400px] w-full bg-gray-200 dark:bg-gray-800 rounded-[2.5rem] mb-12" />
                <div className="grid gap-12 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
                        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
                    </div>
                    <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (error || !center) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl bg-red-50 p-12 text-center border border-red-100 dark:bg-red-900/20 dark:border-red-900/30"
                >
                    <h2 className="text-2xl font-black text-red-800 dark:text-red-400">Oops!</h2>
                    <p className="mt-2 text-red-700 dark:text-red-300 mb-8">{error || 'Center not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center space-x-2 text-sm font-black text-white bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Go back</span>
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
            <Link
                href="/educenters"
                className="group inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-6"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to List</span>
            </Link>

            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <div className="relative h-64 sm:h-96 w-full group overflow-hidden">
                    {center.picture ? (
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                            src={center.picture}
                            alt={center.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-50 dark:bg-indigo-900/10">
                            <MapPin className="h-32 w-32 text-indigo-100 dark:text-indigo-900/30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 text-white">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl sm:text-6xl font-black tracking-tight"
                        >
                            {center.name}
                        </motion.h1>
                    </div>
                </div>

                <div className="p-8 sm:p-16">
                    <div className="grid gap-16 lg:grid-cols-12">
                        <div className="lg:col-span-6 space-y-12">
                            <section>
                                <h2 className="flex items-center space-x-3 text-2xl font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <Info className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <span>About the Center</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-xl font-medium selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
                                    {center.info || 'Explore elite educational programs tailored for your success in this specialized environment.'}
                                </p>
                            </section>

                            <section>
                                <h2 className="flex items-center space-x-3 text-2xl font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <Phone className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <span>Contact Information</span>
                                </h2>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <motion.div whileHover={{ y: -5 }} className="flex items-center space-x-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-6 border border-gray-100 dark:border-gray-800">
                                        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                                            <Phone className="h-6 w-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Principal Line</p>
                                            <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">{center.phone_number || 'N/A'}</p>
                                        </div>
                                    </motion.div>

                                    {center.phone_number_extra && (
                                        <motion.div whileHover={{ y: -5 }} className="flex items-center space-x-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-6 border border-gray-100 dark:border-gray-800">
                                            <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                                                <Phone className="h-6 w-6 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Additional Line</p>
                                                <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">{center.phone_number_extra}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </section>

                            {center.courses && center.courses.length > 0 && (
                                <section>
                                    <h2 className="flex items-center space-x-3 text-2xl font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                            <BookOpen className="h-6 w-6 text-indigo-500" />
                                        </div>
                                        <span>Available Curriculums</span>
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {center.courses.map((course: any, idx: number) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ scale: 1.02, borderColor: 'rgb(79 70 229 / var(--tw-border-opacity))' }}
                                                className="flex items-center space-x-4 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500">
                                                    <BookOpen className="h-6 w-6" />
                                                </div>
                                                <span className="font-bold text-lg">{course.title}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="lg:col-span-6 space-y-8">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="rounded-[3rem] bg-indigo-600 p-10 sm:p-16 text-white shadow-2xl shadow-indigo-200 dark:shadow-none"
                            >
                                {center.cost !== null && center.cost !== undefined ? (
                                    <div className="mb-12">
                                        <p className="text-indigo-200 text-[12px] font-black uppercase tracking-[0.3em] mb-6">Estimated Monthly Tuition</p>
                                        <div className="flex items-baseline space-x-6 flex-wrap">
                                            <span className="text-6xl sm:text-8xl font-black tracking-tighter whitespace-nowrap">{center.cost?.toLocaleString()}</span>
                                            <span className="text-white font-black text-2xl sm:text-4xl uppercase tracking-[0.4em]">UZS</span>
                                        </div>
                                    </div>
                                ) : (
                                    <h3 className="text-4xl font-black mb-8 leading-tight">Begin Your Application</h3>
                                )}

                                <p className="text-indigo-100 mb-12 text-xl font-medium leading-relaxed">
                                    Join the community at <span className="font-bold border-b-2 border-indigo-400/50">{center.name}</span>. Secure your spot today.
                                </p>

                                <Link
                                    href={`/educenters/${slug}/apply`}
                                    className="block w-full text-center rounded-[2rem] bg-white py-8 px-6 font-black text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95 shadow-2xl text-2xl"
                                >
                                    Apply Now
                                </Link>
                            </motion.div>

                            <div className="rounded-[2rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-10 shadow-sm">
                                <h3 className="flex items-center space-x-3 font-black text-gray-900 dark:text-white mb-8">
                                    <Users className="h-6 w-6 text-indigo-500" />
                                    <span>Center Data</span>
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legal Title</span>
                                        <span className="text-sm font-black text-gray-900 dark:text-gray-100">{center.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Courses</span>
                                        <span className="text-sm font-black text-gray-900 dark:text-gray-100">{center.courses?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
