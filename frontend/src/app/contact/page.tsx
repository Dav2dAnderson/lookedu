'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.contact.sendMessage(formData);
            setIsSuccess(true);
            toast.success('Message sent! We will get back to you soon.');
            setFormData({ first_name: '', last_name: '', email: '', message: '' });
        } catch (error: any) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center p-12 rounded-[3rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800"
                >
                    <div className="mx-auto w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mb-8">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-[900] text-gray-900 dark:text-white mb-4">Message Sent!</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-10">
                        Thank you for reaching out. Our team will review your message and respond within 24-48 hours.
                    </p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full py-5 rounded-2xl bg-gray-900 dark:bg-indigo-600 text-white font-black hover:scale-[1.02] transition-transform shadow-xl"
                    >
                        Send Another Message
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <div className="grid gap-12 lg:grid-cols-5">
                    {/* Left Side: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-sm font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 mb-6">
                                Contact Us
                            </span>
                            <h1 className="text-5xl sm:text-6xl font-[900] tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                Let's Start a <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Conversation.</span>
                            </h1>
                            <p className="mt-8 text-xl font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Have questions about our programs or partnership opportunities? We're here to help you navigate your journey.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { icon: Mail, label: 'Email Support', value: 'hello@lookedu.com', color: 'indigo' },
                                { icon: MessageSquare, label: 'Chat with Us', value: '24/7 Response Time', color: 'purple' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className="flex items-center space-x-5 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors shadow-sm"
                                >
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400`}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-lg font-black text-gray-900 dark:text-white">{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        <form onSubmit={handleSubmit} className="p-8 sm:p-12 rounded-[3.5rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-8">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                                <div className="relative group">
                                    <MessageSquare className="absolute left-5 top-6 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Tell us what you're looking for..."
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="group w-full py-5 rounded-[1.5rem] bg-gray-900 dark:bg-indigo-600 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 dark:shadow-none disabled:bg-gray-400 disabled:hover:scale-100 flex items-center justify-center space-x-3"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Intelligence</span>
                                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
