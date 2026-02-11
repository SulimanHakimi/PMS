'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import Link from 'next/link';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const data = await invokeIPC('get-notifications');
        if (data && Array.isArray(data)) {
            setNotifications(data);
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fa-IR');
    };

    const getIcon = (type) => {
        if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
        if (type === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
        return <Bell className="w-5 h-5 text-blue-500" />;
    };

    const getBgColor = (type) => {
        if (type === 'warning') return 'bg-amber-50 border-amber-100';
        if (type === 'success') return 'bg-green-50 border-green-100';
        return 'bg-blue-50 border-blue-100';
    };

    return (
        <div className="p-4 md:p-8 font-sans h-full flex flex-col max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-xl">
                            <Bell className="w-6 h-6 text-teal-600" />
                        </div>
                        اعلانات سیستم
                        {notifications.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                                {notifications.length} جدید
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium">پیام‌ها و هشدارهای مهم سیستم را در اینجا دنبال کنید.</p>
                </div>
                <button className="text-xs md:text-sm text-teal-600 hover:text-teal-700 font-black transition-colors bg-teal-50 px-4 py-2 rounded-lg">
                    علامت‌گذاری همه به عنوان خوانده شده
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500/20 border-t-teal-500"></div>
                        <p className="text-sm font-bold text-gray-400">در حال دریافت اعلانات...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white p-12 md:p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-50 mb-6 group hover:scale-110 transition-transform">
                            <Bell className="w-10 h-10 text-gray-300 group-hover:text-teal-500 transition-colors" />
                        </div>
                        <h2 className="text-xl font-black text-gray-800">هیچ اعلان جدیدی وجود ندارد</h2>
                        <p className="text-gray-400 mt-2 font-medium">صندوق ورودی شما در حال حاضر خالی است!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <Link
                                href={notification.link || '#'}
                                key={index}
                                className={`group block p-5 rounded-2xl border transition-all hover:shadow-lg hover:shadow-teal-500/5 active:scale-[0.99] ${getBgColor(notification.type)}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 transition-transform group-hover:scale-110">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4">
                                            <h3 className="font-black text-gray-800 text-sm md:text-base">{notification.title}</h3>
                                            <span className="text-[10px] md:text-xs font-bold text-gray-400 flex items-center gap-1.5" dir="ltr">
                                                {formatDate(notification.time)}
                                                <Clock className="w-3.5 h-3.5 opacity-60" />
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs md:text-sm mt-1.5 font-medium leading-relaxed">{notification.message}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <p className="mt-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">انتتهای لیست اعلانات</p>
        </div>
    );
}
