'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/api/client';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Send, Image as ImageIcon, Globe, Phone, Info, GraduationCap, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/auth/AuthProvider';
import { parseBackendError } from '@/utils/errorParser';
import axios from 'axios';

export default function AddEducenterPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        info: '',
        phone_number: '',
        phone_number_extra: '',
        cost: '',
        official_website: '',
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
                console.error('Failed to load courses', err);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Using FormData for multipart submission (required for file uploads)
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('info', formData.info);
            submitData.append('phone_number', formData.phone_number);
            submitData.append('phone_number_extra', formData.phone_number_extra);
            if (formData.cost) submitData.append('cost', formData.cost);
            submitData.append('official_website', formData.official_website);

            // Django ManyToMany expects multiple fields or a specific format
            formData.course_ids.forEach(id => {
                submitData.append('course_ids', id.toString());
            });

            if (selectedImage) {
                submitData.append('picture', selectedImage);
            }

            // Using axios directly or extending apiClient for FormData if needed
            // Our apiClient uses axios underneath
            await apiClient.educenters.create(submitData);

            toast.success('Educational center created successfully!');
            router.push('/educenters');
        } catch (err: any) {
            console.error('Submit error:', err);
            if (err.response?.data) {
                const messages = parseBackendError(err.response.data);
                messages.forEach(msg => toast.error(msg));
            } else {
                toast.error('Failed to create center. Please verify your data.');
            }
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
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 transition-all shadow-sm"
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
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 transition-all shadow-sm resize-none"
                                            placeholder="Tell us about your center mission..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Available Courses</label>
                                    <div className="grid grid-cols-2 gap-3 p-2 border-2 border-gray-50 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 max-h-48 overflow-y-auto custom-scrollbar">
                                        {courses.length > 0 ? courses.map(course => (
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
                                        )) : (
                                            <div className="col-span-2 py-4 text-center text-xs font-bold text-gray-400">Loading courses...</div>
                                        )}
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
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 transition-all shadow-sm"
                                            placeholder="+998 90 123 45 67"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Cost per Month (UZS)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-indigo-500 text-xs">UZS</div>
                                        <input
                                            type="number"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 transition-all shadow-sm"
                                            placeholder="500000"
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
                                            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 p-4 pl-14 font-bold text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:bg-white dark:bg-gray-800 dark:border-gray-800 transition-all shadow-sm"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Center Picture</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all cursor-pointer overflow-hidden group"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-black">Change Image</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                                                <span className="text-xs font-black text-gray-400">Click to upload photo</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
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
