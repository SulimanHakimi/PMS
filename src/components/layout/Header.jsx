'use client';

import { Search, ChevronDown, Sun, LogOut, Menu, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ toggleSidebar }) {
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
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-4 md:px-8 shadow-sm">
            {/* Left Section: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on very small screens, responsive width */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <input
                        type="text"
                        placeholder="جستجو کنید..."
                        className="w-full h-11 pr-10 pl-4 bg-[#f3f4f8] text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm font-sans transition-all"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 md:gap-8">
                {/* Time & Greetings - Responsive visibility */}
                <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-start gap-3 border-l border-gray-100 pl-6 text-right">
                        <div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-sm font-bold text-gray-800">
                                    {user?.username ? `${user.username} خوش آمدید` : 'خوش آمدید'}
                                </span>
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 min-h-[1.5em] flex gap-1 items-center justify-end">
                                {currentTime && (
                                    <>
                                        <span>{formatDate(currentTime)}</span>
                                        <span className="mx-1">•</span>
                                        <span dir="ltr">{formatTime(currentTime)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Sun className="w-6 h-6 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language/Other Icons for mobile */}
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full sm:hidden">
                        <Search className="w-5 h-5" />
                    </button>

                    <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                        title="خروج از سیستم"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:inline">خروج</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
