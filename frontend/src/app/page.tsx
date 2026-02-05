'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Star, Shield, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/educenters');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-black text-indigo-600 dark:text-indigo-400 mb-8 border border-indigo-100 dark:border-indigo-800">
              <Star className="h-4 w-4 fill-current" />
              <span>v2.0 Premium Experience</span>
            </div>

            <h1 className="text-6xl font-[900] tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-8 leading-[1.1]">
              The Future of <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Elite Education.</span>
            </h1>

            <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-12 max-w-xl leading-relaxed">
              Connect with world-class educational centers. Explore specialized programs, manage your applications, and unlock your full potential today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="group flex items-center justify-center space-x-2 rounded-[1.5rem] bg-gray-900 dark:bg-white px-8 py-5 text-lg font-black text-white dark:text-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 dark:shadow-none"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-[1.5rem] bg-indigo-50 dark:bg-gray-900 px-8 py-5 text-lg font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-800 transition-all"
              >
                <span>Community Login</span>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">500+</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Centers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">12k+</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Students</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">4.9/5</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 overflow-hidden rounded-[3rem] border-[12px] border-white dark:border-gray-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Modern Learning Space"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              <div className="absolute bottom-10 left-10 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-xs">
                <Shield className="h-8 w-8 text-indigo-400 mb-4" />
                <p className="font-black text-xl mb-2">Verified Institutes</p>
                <p className="text-sm font-medium text-white/80">Only the highest quality educational centers are approved for our platform.</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </main>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 bg-gray-50/50 dark:bg-gray-900/50 rounded-[4rem] mb-24 border border-gray-100 dark:border-gray-800">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700">
              <MapPin className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Smart Discovery</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Find educational centers near you with our intelligent geo-matching and specialty filters.</p>
          </div>
          <div className="space-y-4">
            <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Custom Curriculums</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Explore unique courses designed by industry experts for real-world impact.</p>
          </div>
          <div className="space-y-4">
            <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700">
              <Users className="h-8 w-8 text-black dark:text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Expert Evaluation</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Get direct feedback and personalized admission guidance from center leads.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
