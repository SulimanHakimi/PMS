'use client';

import { Search, Filter, ChevronRight, ChevronLeft, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MedicinesClient({ medicines }) {
    return (
        <div className="p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        گدام <span className="text-gray-400">›</span> لیست دواها ({medicines.length})
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">لیست دواهای موجود برای فروش.</p>
                </div>
                <Link
                    href="/inventory/medicines/add"
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    افزودن آیتم جدید
                </Link>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="جستجو در گدام دوا..."
                        className="w-full h-10 pr-4 pl-10 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500 text-right"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <div className="relative">
                        <select className="h-10 pr-4 pl-10 bg-white border border-gray-200 rounded-md text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:border-teal-500 min-w-[160px] text-right">
                            <option>- انتخاب گروپ -</option>
                            <option>دوای جنریک</option>
                            <option>دیابت</option>
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%] cursor-pointer group">
                                نام دوا <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[15%] cursor-pointer group">
                                آیدی دوا <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[15%] cursor-pointer group">
                                نام گروپ <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[12%] cursor-pointer group">
                                عرضه کننده <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[10%] cursor-pointer group">
                                قیمت خرید <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[10%] cursor-pointer group">
                                قیمت فروش <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[10%] cursor-pointer group">
                                مقدار <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[12%]">عملکرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine, index) => (
                            <tr key={medicine._id || index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{medicine.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.medicineId}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.group}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.supplier || '-'}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.buyPrice || '0'} afn</td>
                                <td className="py-4 px-6 text-sm font-bold text-teal-600">{medicine.sellPrice || '0'} afn</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.stock}</td>
                                <td className="py-4 px-6 text-right">
                                    <Link
                                        href={`/inventory/medicines/detail?id=${medicine.medicineId}`}
                                        className="text-gray-500 hover: text-sm flex items-center gap-1 transition-colors"
                                    >
                                        مشاهده جزئیات <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {medicines.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    هیچ دوایی در دیتابیس یافت نشد.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500">
                        نمایش {medicines.length} نتیجه
                    </div>
                    {/* Pagination controls can be implemented later */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 font-medium">صفحه ۰۱</span>
                        <button className="p-2 rounded hover:bg-gray-100 text-gray-500">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
