'use client';

import { Search, ChevronDown, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('fa-AF', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const formatTime = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('fa-AF', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-8 shadow-sm">
            {/* Search Bar */}
            <div className="relative w-96">
                <input
                    type="text"
                    placeholder="جستجو کنید..."
                    className="w-full h-11 pr-4 pl-10 bg-[#f3f4f8] text-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm font-sans"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
                {/* Language Selector */}
                <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <span className="font-medium text-sm">文</span>
                    <span className="text-sm font-medium">دری (AF)</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Greeting & Time */}
                <div className="flex items-center gap-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                            <Sun className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-800">
                                    {user?.username ? `${user.username} خوش آمدید` : 'خوش آمدید'}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 min-h-[1.5em] flex gap-1 items-center">
                                {currentTime && (
                                    <>
                                        <span>{formatDate(currentTime)}</span>
                                        <span className="mx-1">•</span>
                                        <span dir="ltr">{formatTime(currentTime)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium border-r border-gray-100 pr-4"
                        title="خروج از سیستم"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>خروج</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
