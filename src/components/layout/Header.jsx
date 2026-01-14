'use client';

import { Search, ChevronDown, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
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
                    placeholder="Search for anything here.."
                    className="w-full h-11 pl-4 pr-10 bg-[#f3f4f8] text-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
                {/* Language Selector */}
                <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <span className="font-medium text-sm">文</span>
                    <span className="text-sm font-medium">English (US)</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Greeting & Time */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                        <Sun className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">Good Morning</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {formatDate(currentTime)} <span className="mx-1">•</span> {formatTime(currentTime)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
