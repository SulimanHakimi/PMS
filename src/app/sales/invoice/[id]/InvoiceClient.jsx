'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { invokeIPC } from '@/lib/ipc';
import { Printer, ChevronRight, Download, Share2, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, BadgeCheck, FileCheck, User } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceClient() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            const data = await invokeIPC('get-invoice-by-id', id);
            if (data) setInvoice(data);
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleSavePDF = () => {
        const originalTitle = document.title;
        document.title = `Invoice_${invoice.invoiceNumber}_${invoice.customerName}`;
        window.print();
        document.title = originalTitle;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
    );

    if (!invoice) return (
        <div className="p-8 text-center bg-white rounded-3xl m-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-800">فاکتور یافت نشد</h2>
            <Link href="/sales/list" className="text-teal-600 font-bold mt-4 inline-block font-sans">بازگشت به لیست فروشات</Link>
        </div>
    );

    const formattedDate = new Date(invoice.createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="p-4 md:p-8 font-sans bg-gray-50/50 min-h-screen" dir="rtl">
            {/* Header Action Bar (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-6 print:hidden">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-teal-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mb-2"
                    >
                        <ChevronRight className="w-4 h-4" /> بازگشت به تاریخچه
                    </button>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        جزییات فاکتور <span className="text-gray-300 font-normal font-sans">#{invoice.invoiceNumber}</span>
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-black rounded-full uppercase">Verified</span>
                    </h1>
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                    <button
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 text-sm font-black transition-all active:scale-95"
                    >
                        <Printer className="w-5 h-5" />
                        چاپ مستقیم
                    </button>
                    <button
                        onClick={handleSavePDF}
                        className="flex-1 sm:flex-none bg-white border border-gray-100 text-gray-600 px-8 py-4 rounded-2xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-black transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5 opacity-40" />
                        خروجی PDF
                    </button>
                </div>
            </div>

            {/* Paper Invoice Container */}
            <div className="max-w-4xl mx-auto bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden border border-gray-100 print:shadow-none print:border-none print:m-0 print:max-w-full print:rounded-none">

                {/* Visual Accent Top Bar */}
                <div className="h-3 bg-gradient-to-l from-teal-500 via-teal-400 to-blue-500 print:hidden"></div>

                {/* Company Branding Section */}
                <div className="p-10 md:p-14 flex flex-col md:flex-row justify-between items-start border-b border-gray-50 gap-8 bg-gray-50/20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck className="w-9 h-9 text-teal-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">PANTEA</h1>
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] font-sans">Medical Management Group</p>
                            </div>
                        </div>
                        <div className="space-y-1.5 pt-2">
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                <MapPin className="w-4 h-4 opacity-30" /> کابل، سب استیشن، جاده ۲، ساختمان الماس
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 font-sans" dir="ltr">
                                <Phone className="w-4 h-4 opacity-30" /> +93 (0) 7XX XXX XXX
                            </div>
                        </div>
                    </div>

                    <div className="text-right md:text-left flex flex-col md:items-end gap-2" dir="ltr">
                        <div className="text-4xl font-black text-gray-900/10 uppercase tracking-[0.2em] mb-2 hidden md:block select-none">INVOICE</div>
                        <div className="p-6 bg-gray-900 rounded-[2rem] text-white space-y-3 min-w-[240px] shadow-2xl">
                            <div className="flex justify-between items-center gap-8">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Serial Number</span>
                                <span className="text-sm font-black font-sans text-teal-400">#{invoice.invoiceNumber}</span>
                            </div>
                            <div className="flex justify-between items-center gap-8 pt-3 border-t border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Issue Date</span>
                                <span className="text-xs font-black font-sans">{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient & Doctor Context */}
                <div className="p-10 md:p-14 bg-white grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">
                            <User className="w-3.5 h-3.5" />Patient (Recipient)
                        </h3>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-gray-800 tracking-tight">{invoice.customerName}</div>
                            <div className="text-sm font-bold text-teal-600/60 font-sans" dir="ltr">{invoice.customerPhone || 'Verified System User'}</div>
                        </div>
                    </div>
                    <div className="space-y-4 md:text-left">
                        <h3 className="flex items-center md:justify-end gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">
                            Prescribing Doctor <CheckCircle2 className="w-3.5 h-3.5" />
                        </h3>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-gray-800 tracking-tight">Dr. {invoice.doctorName}</div>
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest opacity-60">Authentication: Med-ID-9922</div>
                        </div>
                    </div>
                </div>

                {/* Professional Medicine Table */}
                <div className="px-10 md:px-14 pb-10">
                    <div className="rounded-[2rem] border border-gray-50 overflow-hidden shadow-sm">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="py-6 px-8">شرح دوا و دستورالعمل مصرفی</th>
                                    <th className="py-6 px-8 text-center">تعداد</th>
                                    <th className="py-6 px-8 text-center">قیمت واحد (AFN)</th>
                                    <th className="py-6 px-8 text-left">مجموع کل (AFN)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50/20 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="font-black text-gray-800 text-sm">{item.name}</div>
                                            <div className="text-[10px] font-bold text-teal-600 mt-1 flex items-center gap-2">
                                                <div className="w-1.5 h-3 bg-teal-500 rounded-full"></div>
                                                {item.instructions}
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center font-sans font-black text-gray-600 text-xs">{item.quantity}</td>
                                        <td className="py-6 px-8 text-center font-sans font-black text-gray-400 text-xs">{item.unitPrice.toLocaleString()}</td>
                                        <td className="py-6 px-8 text-left font-sans font-black text-gray-900 text-sm">{item.totalPrice.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary & Signatures */}
                <div className="p-10 md:p-14 bg-gray-50/50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <BadgeCheck className="w-5 h-5 text-teal-500" />
                            <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Terms & Validation</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium leading-[1.8] max-w-sm">
                            این سند به عنوان رسید معتبر گدام و تراکنش مالی سیستم پانته‌آ محسوب می‌گردد. هرگونه تغییر فیزیکی در مفاد فکتور فاقد اعتبار است. بیمار محترم طبق دستور داکتر معالج مصرف دوا را ادامه دهد.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-4 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                <span>Sub-total Amount</span>
                                <span className="font-black font-sans text-gray-700">{invoice.subTotal.toLocaleString()} AFN</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-red-400">
                                <span>Applied Discount</span>
                                <span className="font-black font-sans">-{invoice.discount.toLocaleString()} AFN</span>
                            </div>
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Grand Total</span>
                                    <span className="text-3xl font-black text-gray-900 font-sans tracking-tight">{invoice.totalAmount.toLocaleString()}</span>
                                </div>
                                <span className="text-xs font-black text-teal-600 uppercase mb-1">Afghani</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Authentication Footer */}
                <div className="px-14 py-16 flex flex-col md:flex-row justify-between items-center gap-12 opacity-30 select-none grayscale">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-0.5 bg-gray-300"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest">Patient Signature</span>
                    </div>
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-[8px] font-black text-center px-4 uppercase leading-tight">Official Stamp Area</div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-0.5 bg-gray-300"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest">Pharmacist Auth</span>
                    </div>
                </div>
            </div>

            {/* Print Styling */}
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .print\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
