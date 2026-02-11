'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Palette,
    Bell,
    Shield,
    Monitor,
    Save,
    RotateCcw,
    RotateCw,
    Check,
    Moon,
    Sun,
    Languages,
    Database,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';

export default function AppSettings() {
    const [activeTab, setActiveTab] = useState('appearance');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Local App Preferences (usually kept in local storage or a dedicated AppSettings collection)
    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'fa',
        notifications: {
            lowStock: true,
            newSales: true,
            chatMessages: true,
            systemUpdates: false
        },
        display: {
            compactMode: false,
            showAnimations: true,
            fontSize: 'medium'
        },
        security: {
            autoLogout: 30, // minutes
            twoFactor: false,
            loginAlerts: true
        }
    });

    useEffect(() => {
        const savedPrefs = localStorage.getItem('pms_app_prefs');
        if (savedPrefs) {
            try {
                setPreferences(JSON.parse(savedPrefs));
            } catch (e) {
                console.error('Failed to parse preferences');
            }
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        // Save to localStorage for client-side persistence
        localStorage.setItem('pms_app_prefs', JSON.stringify(preferences));

        // Simulate a tiny delay for better UX
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 600);
    };

    const tabs = [
        { id: 'appearance', label: 'ظاهر برنامه', icon: Palette },
        { id: 'notifications', label: 'نوتیفیکیشن‌ها', icon: Bell },
        { id: 'security', label: 'امنیت', icon: Shield },
        { id: 'system', label: 'سیستم', icon: Monitor },
    ];

    return (
        <div className="p-4 md:p-8 font-sans max-w-5xl mx-auto" dir="rtl">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-10">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-xl">
                            <Settings className="w-7 h-7 text-teal-600" />
                        </div>
                        تنظیمات سیستم
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400 mt-1.5 font-medium">سفارشی‌سازی نحوه عملکرد و نمایش محیط کاربری</p>
                </div>

                <div className="w-full sm:w-auto">
                    <button
                        onClick={handleSave}
                        disabled={loading || saved}
                        className={`
                            w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95
                            ${saved
                                ? 'bg-green-500 text-white shadow-green-500/10'
                                : 'bg-[#009688] text-white hover:bg-[#00796b] shadow-teal-500/20'}
                        `}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : saved ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saved ? 'تغییرات اعمال شد' : 'ذخیره تنظیمات'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Sidebar Tabs - Responsive: scrollable horizontally on mobile, vertical list on desktop */}
                <div className="flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-2 md:w-64 no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all text-right whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-white text-teal-600 shadow-md shadow-teal-500/5 ring-1 ring-teal-50 font-black'
                                    : 'text-gray-400 hover:bg-white/50 hover:text-gray-600 font-bold'}
                            `}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}`} />
                            <span className="text-xs md:text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10 min-h-[500px]">
                    {activeTab === 'appearance' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-base md:text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-teal-600" /> انتخاب تم بصری
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                                        className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${preferences.theme === 'light' ? 'border-teal-500 bg-teal-50/20' : 'border-gray-50 hover:border-gray-100'}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-orange-500">
                                            <Sun className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-800 text-sm">حالت روشن</p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-bold">Standard Light Mode</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                                        className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 opacity-70 cursor-not-allowed ${preferences.theme === 'dark' ? 'border-teal-500 bg-teal-50/20' : 'border-gray-50'}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-teal-400">
                                            <Moon className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-800 text-sm">حالت تاریک</p>
                                            <p className="text-[10px] text-teal-600 mt-1 font-black">Coming Soon</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <h3 className="text-base md:text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                    <Languages className="w-5 h-5 text-blue-500" /> زبان محیط کاربری
                                </h3>
                                <div className="max-w-md">
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                        className="w-full h-12 px-5 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none font-black text-gray-700 transition-all text-sm"
                                    >
                                        <option value="fa">دری / فارسی (افغانستان)</option>
                                        <option value="ps">پشتو (پیش‌فرض سیستم)</option>
                                        <option value="en">English (Global)</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-3 font-bold px-1">تغییر زبان ممکن است باعث بارگذاری مجدد برخی بخش‌ها شود.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-base md:text-lg font-black text-gray-800 mb-8 border-b border-gray-50 pb-4">مدیریت اعلانات و هشدارها</h3>

                            {[
                                { id: 'lowStock', label: 'هشدار کمبود موجودی گدام', desc: 'اطلاع‌رسانی خودکار هنگام کاهش ذخایر دارویی', icon: Database },
                                { id: 'newSales', label: 'گزارش فروش لحظه‌ای', desc: 'نوتیفیکیشن هنگام ثبت موفق هر فکتور فروش', icon: Save },
                                { id: 'chatMessages', label: 'پیام‌های دریافتی چت', desc: 'اعلان صوتی و تصویری برای پیام‌های بازدیدکنندگان', icon: Bell },
                                { id: 'systemUpdates', label: 'بروزرسانی‌های هسته سیستم', desc: 'اطلاع از پچ‌های امنیتی و قابلیت‌های جدید', icon: RotateCw }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50/50 transition-all group border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white border border-gray-100 items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-800 text-sm md:text-base">{item.label}</p>
                                            <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-bold">{item.desc}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications[item.id]}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                notifications: { ...preferences.notifications, [item.id]: e.target.checked }
                                            })}
                                        />
                                        <div className="w-12 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-base md:text-lg font-black text-gray-800 mb-8 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-red-500" /> حریم خصوصی و امنیت داده‌ها
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="text-right">
                                            <p className="font-black text-gray-800 text-sm">زمان خروج خودکار (Session Timeout)</p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-bold">مدت زمان بیکاری قبل از قفل شدن حساب کاربری</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
                                            <input
                                                type="number"
                                                value={preferences.security.autoLogout}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    security: { ...preferences.security, autoLogout: e.target.value }
                                                })}
                                                className="w-12 bg-transparent text-center font-black text-teal-600 focus:outline-none text-sm"
                                            />
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Min</span>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between gap-4">
                                        <div className="text-right">
                                            <p className="font-black text-gray-800 text-sm">تایید هویت دو مرحله‌ای (2FA)</p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-bold">افزودن یک لایه امنیتی دیگر به پروسه ورود</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={preferences.security.twoFactor}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    security: { ...preferences.security, twoFactor: e.target.checked }
                                                })}
                                            />
                                            <div className="w-12 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> مشاهده لاگ‌های دسترسی و ورود
                            </button>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-base md:text-lg font-black text-gray-800 mb-8 flex items-center gap-2">
                                    <Monitor className="w-5 h-5 text-gray-400" /> اطلاعات فنی و نگهداری
                                </h3>
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl relative overflow-hidden group shadow-xl shadow-gray-200">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-center sm:text-right">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[4px] mb-3">Core Version</p>
                                            <p className="text-3xl md:text-4xl font-black text-white">v1.2.4 <span className="text-teal-400 text-sm font-bold ml-2">Stable</span></p>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Everything is up to date</p>
                                            </div>
                                        </div>
                                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-black text-xs text-white transition-all border border-white/10 group">
                                            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> بررسی بروزرسانی
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <h3 className="text-base md:text-lg font-black text-red-500 mb-6 flex items-center gap-2">
                                    <RotateCcw className="w-5 h-5" /> منطقه خطر
                                </h3>
                                <div className="p-6 rounded-2xl bg-red-50/30 border border-red-100">
                                    <p className="text-sm text-gray-600 font-bold leading-relaxed mb-6">
                                        بازنشانی تنظیمات باعث حذف تمام ترجیحات بصری، اعلان‌ها و تنظیمات امنیتی شما شده و برنامه را به حالت اولیه برمی‌گرداند. این عمل غیرقابل بازگشت است.
                                    </p>
                                    <button className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-red-100 text-red-600 font-black text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 rounded-xl">
                                        ریست کردن دیتابیس تنظیمات
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
