'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Send, Image as ImageIcon, Globe, Phone, Info, GraduationCap, DollarSign, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/auth/AuthProvider';

export default function AddEducenterPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        info: '',
        phone_number: '',
        phone_number_extra: '',
        cost: '',
        official_website: '',
        picture: '',
        course_ids: [] as number[]
    });

    useEffect(() => {
        if (!authLoading && (!user || !user.have_right_to_add)) {
            toast.error('Unauthorized access');
            router.push('/educenters');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await apiClient.courses.list();
                setCourses(data);
            } catch (err) {
                console.error('Failed to load courses');
            }
        };
        if (user?.have_right_to_add) {
            fetchCourses();
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseToggle = (courseId: number) => {
        setFormData(prev => ({
            ...prev,
            course_ids: prev.course_ids.includes(courseId)
                ? prev.course_ids.filter(id => id !== courseId)
                : [...prev.course_ids, courseId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                cost: formData.cost ? parseInt(formData.cost) : null,
                slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            };
            await apiClient.educenters.create(payload);
            toast.success('Educational center added successfully!');
            router.push('/educenters');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to add center. Please check your data.');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20 px-4 transition-colors duration-300">
            <div className="mx-auto max-w-4xl">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors font-bold group"
                >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Centers</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[3rem] bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white text-center">
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Build Your Presence</h1>
                        <p className="text-indigo-100 font-medium">Register your elite educational center on Lookedu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-12">
                        <div className="grid gap-10 sm:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Center Name</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm"
                                            placeholder="Elite Academy"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Information/Description</label>
                                    <div className="relative">
                                        <Info className="absolute left-5 top-5 h-5 w-5 text-gray-400" />
                                        <textarea
                                            required
                                            name="info"
                                            value={formData.info}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm resize-none"
                                            placeholder="Tell us about your center mission..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Available Courses</label>
                                    <div className="grid grid-cols-2 gap-3 p-2 border-2 border-gray-50 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 max-h-48 overflow-y-auto custom-scrollbar">
                                        {courses.map(course => (
                                            <button
                                                key={course.id}
                                                type="button"
                                                onClick={() => handleCourseToggle(course.id)}
                                                className={`flex items-center justify-between p-3 rounded-xl text-xs font-black transition-all ${formData.course_ids.includes(course.id)
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-indigo-400 border border-transparent'
                                                    }`}
                                            >
                                                <span className="truncate mr-2">{course.title}</span>
                                                {formData.course_ids.includes(course.id) && <Check className="h-3 w-3 shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Primary Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm"
                                            placeholder="+998 90 123 45 67"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Cost per Month (UZS)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm"
                                            placeholder="500,000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="official_website"
                                            value={formData.official_website}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Picture URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="picture"
                                            value={formData.picture}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 dark:text-white transition-all shadow-sm"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-4 rounded-[2rem] bg-indigo-600 py-6 text-xl font-black text-white shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-indigo-200 dark:shadow-none"
                        >
                            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
                                <>
                                    <span>Launch Your Presence</span>
                                    <Send className="h-6 w-6" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
