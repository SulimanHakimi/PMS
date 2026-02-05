'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, ChevronLeft, CreditCard } from 'lucide-react';
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
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 font-sans" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 text-right">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex flex-row items-center gap-2">
                        فروشات <span className="text-gray-400">›</span> لیست فروشات
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">مدیریت و مشاهده تمام فکتورهای فروش</p>
                </div>
                <Link
                    href="/sales/new"
                    className="bg-[#009688] hover:bg-[#00796b] text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    ثبت فروش جدید
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">تعداد کل فکتورها</p>
                            <p className="text-xl font-bold text-gray-800">{invoices.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">مجموع فروشات</p>
                            <p className="text-xl font-bold text-gray-800">
                                {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()} <span className="text-xs font-normal">افغانی</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">آخرین فعالیت</p>
                            <p className="text-sm font-bold text-gray-800">
                                {invoices.length > 0 ? new Date(invoices[0].createdAt).toLocaleDateString('fa-AF') : '---'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="جستجوی فکتور، مشتری یا داکتر..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pr-10 pl-4 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">نمبر فکتور</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">تاریخ</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">نام مشتری</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">نام داکتر</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">مجموع کل</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">در حال بارگزاری...</td></tr>
                        ) : filteredInvoices.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">هیچ فکتوری یافت نشد.</td></tr>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-teal-600" dir="ltr">{invoice.invoiceNumber}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(invoice.createdAt).toLocaleDateString('fa-AF')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {invoice.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {invoice.doctorName}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800" dir="ltr">
                                        {invoice.totalAmount.toLocaleString()} AFN
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/sales/invoice/${invoice._id}`}
                                            className="text-gray-400 hover:text-teal-600 flex items-center gap-1 text-xs font-bold transition-colors"
                                        >
                                            مشاهده و چاپ <ChevronLeft className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
