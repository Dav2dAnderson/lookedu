'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { components } from '@/api/generated/schema';
import Link from 'next/link';
import { Loader2, Phone, MapPin, Search, ArrowRight, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Educeter = components['schemas']['CentersList'] & { cost?: number | null };

export default function EducetersListPage() {
    const [centers, setCenters] = useState<Educeter[]>([]);
    const [filteredCenters, setFilteredCenters] = useState<Educeter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const { data } = await apiClient.educenters.list();
                setCenters(data);
                setFilteredCenters(data);
            } catch (err: any) {
                setError('Failed to load educational centers.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCenters();
    }, []);

    useEffect(() => {
        const filtered = centers.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.info && c.info.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredCenters(filtered);
    }, [searchQuery, centers]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse space-y-12">
                        <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-[3rem]" />
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-96 rounded-[2.5rem] bg-gray-200 dark:bg-gray-800" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-indigo-600 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute left-[calc(50%-19rem)] top-[calc(50%-36rem)] h-[42.375rem] w-[72.1875rem] transform-gpu blur-3xl"
                        viewBox="0 0 1155 678"
                        fill="none"
                    >
                        <path
                            fill="url(#gradient)"
                            fillOpacity=".2"
                            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c60.334 145.883 212.346 105.582 310.029 103.047L1091.75 464.31l-367.653 234.331-57.039-270-349.839 290.334z"
                        />
                        <defs>
                            <linearGradient
                                id="gradient"
                                x1="1155.49"
                                x2="-78.208"
                                y1=".177"
                                y2="474.645"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#9089FC" />
                                <stop offset={1} stopColor="#FF80B5" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tight text-white sm:text-7xl mb-6"
                    >
                        Find Educational <span className="text-indigo-200">Centers</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg font-medium text-indigo-100 sm:text-xl"
                    >
                        Discover the most prestigious educational institutions and accelerate your career with world-class mentorship.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 mx-auto max-w-2xl"
                    >
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-indigo-300">
                                <Search className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-[2rem] border-0 bg-white/10 py-5 pl-16 pr-6 text-white font-bold ring-1 ring-inset ring-white/20 backdrop-blur-md placeholder:text-indigo-100 focus:ring-2 focus:ring-inset focus:ring-white focus:bg-white/20 sm:text-lg transition-all"
                                placeholder="Search by name or specialty..."
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* List Section */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                        Available Centers
                        <span className="ml-4 text-sm font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                            {filteredCenters.length} Results
                        </span>
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-400">
                        <Filter className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-widest">Filter</span>
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    {filteredCenters.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredCenters.map((center, idx) => (
                                <motion.div
                                    layout
                                    key={center.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition-all hover:shadow-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        {center.picture ? (
                                            <img
                                                src={center.picture}
                                                alt={center.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-indigo-50 dark:bg-indigo-900/10 text-indigo-300">
                                                <MapPin className="h-16 w-16" />
                                            </div>
                                        )}
                                        {center.cost && (
                                            <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-6 py-3 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 min-w-[120px] text-center">
                                                <div className="flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <span className="text-2xl font-black leading-none">{center.cost.toLocaleString()}</span>
                                                    <span className="mt-1 text-xs font-black uppercase tracking-[0.2em] opacity-90">UZS</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-8 bg-white dark:bg-gray-900 transition-colors">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-3">
                                            {center.name}
                                        </h3>
                                        <p className="line-clamp-2 text-md font-medium text-gray-500 dark:text-gray-400 mb-6 italic">
                                            {center.info || 'Explore elite educational programs tailored for your success.'}
                                        </p>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center space-x-3 text-md font-bold text-indigo-600 dark:text-indigo-400 min-w-0">
                                                <Phone className="h-5 w-5 shrink-0" />
                                                <span className="truncate group-hover:overflow-visible group-hover:whitespace-normal transition-all">{center.phone_number || 'Consultation Line'}</span>
                                            </div>

                                            <Link
                                                href={`/educenters/${center.slug}`}
                                                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gray-900 px-6 py-4 text-md font-black text-white hover:bg-gray-800 transition-all active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                            >
                                                <span>Experience Center</span>
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center"
                        >
                            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No results found</h3>
                            <p className="mt-2 text-gray-500 font-medium">Try adjusting your search to find what you're looking for.</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-8 text-indigo-600 font-black hover:underline"
                            >
                                Clear all searches
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
