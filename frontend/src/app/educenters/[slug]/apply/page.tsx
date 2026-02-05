'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { components } from '@/api/generated/schema';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, BookOpen, Send, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ApplyPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [center, setCenter] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const fetchCenter = async () => {
            try {
                const { data } = await apiClient.educenters.get(slug as string);
                setCenter(data);
                if (data.courses && data.courses.length > 0) {
                    const firstCourse = data.courses[0] as any;
                    setSelectedCourseId(firstCourse.id);
                }
            } catch (err: any) {
                setError('Failed to load center details.');
                toast.error('Could not load center information');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCenter();
    }, [slug]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId || !center?.id) {
            toast.error('Please select a course first');
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.applications.create({
                center_id: center.id,
                course_id: selectedCourseId,
                content: content || `Application for ${center.name}`,
            });
            setSuccess(true);
            toast.success('Your application was sent successfully!');
            setTimeout(() => {
                router.push('/profile');
            }, 2500);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !center) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[2rem] bg-red-50 p-12 text-center border border-red-100 dark:bg-red-900/20 dark:border-red-900/30"
                >
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-red-800 dark:text-red-400">Submission Error</h2>
                    <p className="mt-2 text-red-700 dark:text-red-300 mb-8">{error || 'Center not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center space-x-2 text-sm font-black text-white bg-red-600 px-8 py-4 rounded-2xl hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Go back</span>
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Discard & Go Back</span>
                </button>

                <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-8 py-24 flex flex-col items-center justify-center text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                    className="mb-8 rounded-full bg-green-50 p-6 dark:bg-green-900/20"
                                >
                                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                                </motion.div>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">You're All Set!</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
                                    Your enrollment application for <span className="font-bold text-indigo-600 dark:text-indigo-400">{center.name}</span> has been securely transmitted.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                                    <Link
                                        href="/profile"
                                        className="inline-flex items-center space-x-2 rounded-xl bg-gray-900 px-8 py-4 text-sm font-black text-white hover:bg-gray-800 transition-all dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    >
                                        <span>View Applications</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/educenters"
                                        className="inline-flex items-center space-x-2 rounded-xl border-2 border-gray-200 px-8 py-4 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                                    >
                                        <span>Discover More</span>
                                    </Link>
                                </div>

                                <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 font-bold">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Returning to your profile...</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="form">
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-10 py-12 text-white">
                                    <h1 className="text-4xl font-black tracking-tight">Enrollment Form</h1>
                                    <p className="mt-2 text-indigo-100 font-medium">Applying for a position at <span className="font-bold underline decoration-indigo-400 underline-offset-4">{center.name}</span></p>
                                </div>

                                <form onSubmit={onSubmit} className="p-10 space-y-12">
                                    {/* Course Selection */}
                                    <section>
                                        <h2 className="flex items-center space-x-3 text-2xl font-black text-gray-900 dark:text-white mb-8">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                                <BookOpen className="h-6 w-6 text-indigo-500" />
                                            </div>
                                            <span>Select Your Curriculum</span>
                                        </h2>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {center.courses && center.courses.map((course: any) => (
                                                <motion.button
                                                    key={course.id}
                                                    type="button"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedCourseId(course.id)}
                                                    className={`flex items-center space-x-4 rounded-2xl p-5 border-2 transition-all text-left ${selectedCourseId === course.id
                                                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/30 ring-4 ring-indigo-500/10'
                                                        : 'border-gray-100 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-indigo-200'
                                                        }`}
                                                >
                                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${selectedCourseId === course.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                                                        }`}>
                                                        <BookOpen className="h-6 w-6" />
                                                    </div>
                                                    <span className="font-black text-lg">{course.title}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Additional Content */}
                                    <section>
                                        <h2 className="flex items-center space-x-3 text-2xl font-black text-gray-900 dark:text-white mb-6">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                                <Info className="h-6 w-6 text-indigo-500" />
                                            </div>
                                            <span>Personal Statement</span>
                                        </h2>
                                        <div className="relative group">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Share your goals or any specific questions for the instructors..."
                                                className="w-full rounded-3xl border-2 border-gray-100 bg-gray-50/50 p-8 text-gray-900 font-medium placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 min-h-[180px] dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 transition-all"
                                            />
                                            <div className="absolute top-4 right-4 text-gray-300 dark:text-gray-600">
                                                <Info className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </section>

                                    <div className="pt-4">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            disabled={isSubmitting || !selectedCourseId}
                                            className="group relative flex w-full items-center justify-center space-x-3 rounded-[1.5rem] bg-indigo-600 py-6 px-10 text-xl font-black text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:shadow-none"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                    <span>Submit Application</span>
                                                </>
                                            )}
                                        </motion.button>
                                        <p className="mt-6 text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                                            Secure Submission Portal
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
