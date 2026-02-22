'use client';

import Link from 'next/link';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            {/* Decorative background orbs */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center max-w-lg">
                {/* Big 404 */}
                <div className="relative mb-6 select-none">
                    <p className="text-[10rem] lg:text-[14rem] font-black text-gray-100 leading-none tracking-tighter">
                        404
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/30">
                            <ShoppingBag className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                    Page Not Found
                </h1>
                <p className="text-gray-500 text-base mb-10 leading-relaxed">
                    Oops! Looks like this page wandered off. Let&apos;s get you back to something good.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20"
                    >
                        <Home className="w-4 h-4" /> Go Home
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-emerald-400 text-gray-700 hover:text-emerald-700 px-7 py-3.5 rounded-xl font-bold transition"
                    >
                        <ShoppingBag className="w-4 h-4" /> Shop Products
                    </Link>
                </div>

                {/* Back link */}
                <button
                    onClick={() => history.back()}
                    className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-600 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Go back
                </button>
            </div>
        </div>
    );
}
