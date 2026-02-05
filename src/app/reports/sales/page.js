'use client';

import { Calendar, ChevronDown, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { invokeIPC } from '@/lib/ipc';

export default function SalesReport() {
    const [sales, setSales] = useState([]);

    // In a real app we'd fetch sales here. 
    // Since we only have Medicines/Groups/Users tables, we'll just show empty state or mock from backend handler if implemented.
    // However, user asked for "Real Data". 
    // Currently we don't have a Sales/Invoice model. I will leave it empty as "No Sales Found" is more "Real" than fake data.

    return (
        <div className="p-8 h-full flex flex-col font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        راپور ها <span className="text-gray-400">›</span> راپور فروشات
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">راپور مربوط به فروشات دواخانه.</p>
                </div>
                <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                    دانلود راپور
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">محدوده زمانی</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="انتخاب تاریخ"
                            className="w-full h-11 pr-4 pl-10 bg-white border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">گروپ دوایی</label>
                    <div className="relative">
                        <select className="w-full h-11 pr-4 pl-10 bg-[#f1f5f9] border border-transparent rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right">
                            <option>- انتخاب گروپ -</option>
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربر</label>
                    <div className="relative">
                        <select className="w-full h-11 pr-4 pl-10 bg-[#f1f5f9] border border-transparent rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right">
                            <option>- انتخاب نام کاربر -</option>
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-center items-center">
                    <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 w-full text-right">فروشات انجام شده</h3>
                    <p className="text-gray-400 text-sm">هیچ دیتایی برای نمایش موجود نیست</p>
                </div>

                {/* List Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">آیدی سفارش</h3>
                        <h3 className="font-bold text-gray-800">تاریخ و زمان</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 text-center text-gray-400 text-sm">
                        هیچ فروشی ثبت نشده است
                    </div>
                </div>
            </div>
        </div>
    );
}
