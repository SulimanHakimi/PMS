'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, ChevronLeft, CreditCard, Receipt, TrendingUp, Filter, ArrowUpRight, CheckCircle2, MoreHorizontal, Plus, Stethoscope } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import Link from 'next/link';

export default function SalesListPage() {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            const data = await invokeIPC('get-invoices');
            if (data) setInvoices(data);
            setLoading(false);
        };
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    return (
        <div className="p-4 md:p-8 font-sans max-w-[1600px] mx-auto" dir="rtl">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <Receipt className="w-4 h-4" /> تاریخچه تراکنش‌های مالی
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        مدیریت فاکتورهای فروش <span className="text-gray-300 font-normal ml-2">({invoices.length})</span>
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">مشاهده، پیگیری و چاپ مجدد تمامی فاکتورهای صادر شده در سیستم.</p>
                </div>

                <Link
                    href="/sales/new"
                    className="w-full sm:w-auto bg-[#009688] hover:bg-[#00796b] text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 text-sm font-black transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    صدور فاکتور جدید
                </Link>
            </div>

            {/* Quick Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-teal-100 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">مجموع درآمد ثبت شده</div>
                        <div className="text-xl font-black text-gray-800 font-sans tracking-tight">{totalRevenue.toLocaleString()} <small className="text-[10px] opacity-40">AFN</small></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-blue-100 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">تعداد کل اسناد</div>
                        <div className="text-xl font-black text-gray-800 font-sans tracking-tight">{invoices.length.toLocaleString()} <span className="text-xs font-bold text-gray-300">Docs</span></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-orange-100 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">آخرین فاکتور</div>
                        <div className="text-sm font-black text-gray-800">
                            {invoices.length > 0 ? new Date(invoices[0].createdAt).toLocaleDateString('fa-IR') : 'بدون فعالیت'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Filter Area */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                <div className="flex-1 relative group max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی فاکتور، مشتری یا داکتر..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pr-12 pl-6 bg-white border border-gray-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Filter className="w-4 h-4" /> پیشرفته
                    </button>
                    <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all text-xs">
                        امروز
                    </button>
                    <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all text-xs">
                        هفته اخیر
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="py-5 px-8">مشخصات فاکتور</th>
                                <th className="py-5 px-8">تاریخ و زمان</th>
                                <th className="py-5 px-8">هویت مشتری / داکتر</th>
                                <th className="py-5 px-8 text-center">مبلغ کل (AFN)</th>
                                <th className="py-5 px-8 text-left">مدیریت</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Loading Records...</td></tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr><td colSpan="5" className="py-20 text-center text-gray-300 font-black uppercase tracking-widest">No matching invoices found</td></tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="group hover:bg-teal-50/10 transition-all duration-300">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-teal-600 transition-all shadow-sm">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-800 font-sans tracking-widest group-hover:text-teal-600 transition-colors uppercase" dir="ltr">#{invoice.invoiceNumber}</div>
                                                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Confirmed Invoice</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-700">{new Date(invoice.createdAt).toLocaleDateString('fa-IR')}</span>
                                                <span className="text-[10px] text-gray-400 font-bold font-sans">{new Date(invoice.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="space-y-1">
                                                <div className="text-sm font-black text-gray-800">{invoice.customerName}</div>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                                                    <Stethoscope className="w-3 h-3 opacity-50" /> {invoice.doctorName || 'بدون داکتر معالج'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <span className="inline-flex px-4 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-sm font-black font-sans group-hover:bg-white transition-all">
                                                {invoice.totalAmount?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-left">
                                            <div className="flex items-center gap-3 justify-end">
                                                <Link
                                                    href={`/sales/invoice/${invoice._id}`}
                                                    className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-teal-600 text-xs font-black shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex items-center gap-2"
                                                >
                                                    مشاهده جزییات <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 hover:text-gray-900 transition-all">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 mb-6">
                {filteredInvoices.map((invoice) => (
                    <div key={invoice._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                                    <Receipt className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-gray-800 font-sans tracking-widest uppercase" dir="ltr">#{invoice.invoiceNumber}</div>
                                    <div className="text-[10px] text-gray-400 font-bold">{new Date(invoice.createdAt).toLocaleDateString('fa-IR')}</div>
                                </div>
                            </div>
                            <div className="text-left">
                                <span className="text-lg font-black text-gray-900 font-sans tracking-tight">{invoice.totalAmount?.toLocaleString()} <small className="text-[10px] opacity-40">AFN</small></span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl mb-6 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-gray-300" />
                                <span className="text-xs font-black text-gray-800">{invoice.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-3.5 h-3.5 text-gray-300" />
                                <span className="text-[10px] font-bold text-gray-500">{invoice.doctorName || 'بدون داکتر'}</span>
                            </div>
                        </div>

                        <Link
                            href={`/sales/invoice/${invoice._id}`}
                            className="w-full flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl text-xs font-black shadow-lg shadow-gray-200 group-active:scale-95 transition-all"
                        >
                            مشاهده و مدیریت فاکتور <ChevronLeft className="w-4 h-4 mr-2" />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Footer / Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>نمایش {filteredInvoices.length} سند از دیتابیس تراکنش‌ها</span>
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    Live Data Streaming Enabled
                </span>
            </div>
        </div>
    );
}
