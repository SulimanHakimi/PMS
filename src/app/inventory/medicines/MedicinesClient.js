'use client';

import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Plus, Database } from 'lucide-react';
import Link from 'next/link';

export default function MedicinesClient({ medicines }) {
    return (
        <div className="p-4 md:p-8 font-sans max-w-[1600px] mx-auto" dir="rtl">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <Database className="w-4 h-4" /> گدام و مدیریت موجودی
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        لیست کلی دواها <span className="text-gray-300 font-normal ml-2">({medicines.length})</span>
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">مدیریت، ویرایش و نظارت بر تمامی اقلام دارویی موجود در سیستم.</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                    <Link
                        href="/inventory/medicines/add"
                        className="flex-1 sm:flex-none bg-[#009688] hover:bg-[#00796b] text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 text-sm font-black transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        ثبت دوای جدید
                    </Link>
                </div>
            </div>

            {/* Premium Filters Area */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی سریع بر اساس نام، آیدی یا برند..."
                        className="w-full h-14 pr-12 pl-6 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <select className="w-full h-14 pr-12 pl-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm">
                            <option>همه گروپ‌ها</option>
                            <option>آنتی‌بیوتیک</option>
                            <option>قلبی و عروقی</option>
                            <option>مسکن‌ها</option>
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="py-5 px-6">مشخصات دوا</th>
                                <th className="py-5 px-6 text-center">دسته بندی</th>
                                <th className="py-5 px-6">عرضه کننده</th>
                                <th className="py-5 px-6 text-center">قیمت خرید</th>
                                <th className="py-5 px-6 text-center">قیمت فروش</th>
                                <th className="py-5 px-6 text-center">موجودی</th>
                                <th className="py-5 px-6 text-left">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {medicines.map((medicine, index) => (
                                <tr key={medicine._id || index} className="group hover:bg-teal-50/10 transition-all duration-300">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-teal-600 font-black group-hover:bg-white transition-colors">
                                                {medicine.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800">{medicine.name}</div>
                                                <div className="text-[10px] text-gray-400 font-sans mt-0.5 tracking-wider">{medicine.medicineId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black group-hover:bg-white transition-colors">
                                            {medicine.group}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="text-xs font-bold text-gray-500">{medicine.supplier || '-'}</div>
                                    </td>
                                    <td className="py-5 px-6 text-center font-sans">
                                        <span className="text-sm text-gray-600 font-black">{medicine.buyPrice || '0'} <small className="opacity-50">AFN</small></span>
                                    </td>
                                    <td className="py-5 px-6 text-center font-sans">
                                        <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-sm font-black ring-1 ring-teal-100">
                                            {medicine.sellPrice || '0'} <small className="opacity-70">AFN</small>
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${medicine.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                            <span className={`text-sm font-black font-sans ${medicine.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {medicine.stock}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-left">
                                        <Link
                                            href={`/inventory/medicines/detail?id=${medicine.medicineId}`}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 transition-all group/btn"
                                        >
                                            <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 mb-6">
                {medicines.map((medicine, index) => (
                    <Link
                        key={medicine._id || index}
                        href={`/inventory/medicines/detail?id=${medicine.medicineId}`}
                        className="block bg-white p-5 rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-lg">
                                    {medicine.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800 text-base">{medicine.name}</h3>
                                    <p className="text-[10px] text-teal-600 font-bold tracking-widest uppercase mt-1">{medicine.group}</p>
                                </div>
                            </div>
                            <div className="text-left font-sans">
                                <div className="text-sm font-black text-gray-800">{medicine.sellPrice} <small className="text-[10px] opacity-40 uppercase">AFN</small></div>
                                <div className={`text-[10px] font-black mt-1 ${medicine.stock < 10 ? 'text-red-500' : 'text-gray-400'}`}>Stock: {medicine.stock}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {medicine.medicineId}</span>
                            <div className="flex items-center gap-1 text-teal-600 text-[10px] font-black uppercase">
                                View Details <ChevronLeft className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Enhanced Pagination / Footer */}
            <div className="bg-white/50 backdrop-blur-md px-6 py-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="text-xs md:text-sm text-gray-400 font-black uppercase tracking-widest flex items-center gap-4">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        Total Items: {medicines.length}
                    </span>
                    <span className="hidden sm:inline opacity-20">|</span>
                    <span className="hidden sm:block">Page 1 of 1</span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-300 pointer-events-none transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1.5">
                        <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-teal-600 text-white font-black text-sm shadow-lg shadow-teal-500/20 active:scale-90 transition-all">
                            ۱
                        </button>
                    </div>
                    <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:shadow-sm active:scale-90 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {medicines.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">هیچ نتیجه‌ای یافت نشد</h3>
                    <p className="text-gray-400 text-sm font-medium">لطفاً فیلترها را تغییر داده یا دواهای جدید اضافه کنید.</p>
                </div>
            )}
        </div>
    );
}
