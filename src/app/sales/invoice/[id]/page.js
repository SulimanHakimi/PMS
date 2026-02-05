'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { invokeIPC } from '@/lib/ipc';
import { Printer, ChevronRight, Download, Share2 } from 'lucide-react';

export default function InvoicePrintPage() {
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
        document.title = `فکتور_${invoice.invoiceNumber}_${invoice.customerName}`;
        window.print();
        document.title = originalTitle;
    };

    if (loading) return <div className="p-8 text-center font-sans">در حال بارگزاری فکتور...</div>;
    if (!invoice) return <div className="p-8 text-center font-sans">فکتور مورد نظر یافت نشد.</div>;

    const formattedDate = new Date(invoice.createdAt).toLocaleDateString('fa-AF', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="p-8 font-sans bg-gray-50 min-h-screen" dir="rtl">
            {/* Action Bar (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <button
                    onClick={() => router.push('/sales/new')}
                    className="text-gray-600 hover:text-teal-600 flex items-center gap-1 text-sm font-medium"
                >
                    <ChevronRight className="w-4 h-4" />
                    بازگشت به ثبت فروش
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="bg-[#009688] hover:bg-[#00796b] text-white px-5 py-2 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        چاپ فکتور
                    </button>
                    <button
                        onClick={handleSavePDF}
                        className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded shadow-sm hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        ذخیره PDF
                    </button>
                </div>
            </div>

            {/* Invoice Container */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none print:m-0 print:max-w-full">
                {/* Invoice Header */}
                <div className="p-8 bg-[#1a1f37] text-white flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black mb-2">شین فارما</h1>
                        <p className="text-gray-400 text-sm">سیستم مدیریت پیشرفته دواخانه</p>
                        <div className="mt-4 text-xs space-y-1 opacity-80">
                            <p>آدرس: کابل، افغانستان</p>
                            <p>شماره تماس: ۰۷۰۰۰۰۰۰۰۰</p>
                        </div>
                    </div>
                    <div className="text-left" dir="ltr">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-teal-400">INVOICE</h2>
                        <div className="mt-4 text-sm space-y-1">
                            <p className="flex justify-between gap-4"><span className="text-gray-400">Invoice No:</span> <span>{invoice.invoiceNumber}</span></p>
                            <p className="flex justify-between gap-4"><span className="text-gray-400">Date:</span> <span>{formattedDate}</span></p>
                        </div>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="p-8 grid grid-cols-2 gap-8 border-b border-gray-100">
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 px-1">مشتری (بیمار)</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-bold text-gray-800 text-lg">{invoice.customerName}</p>
                            {invoice.customerPhone && <p className="text-sm text-gray-500 mt-1">{invoice.customerPhone}</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 px-1 text-left">Prescribing Doctor</h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-left">
                            <p className="font-bold text-gray-800 text-lg">Dr. {invoice.doctorName}</p>
                            <p className="text-sm text-gray-500 mt-1 opacity-60">Verified Prescription</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-8">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 text-sm font-bold text-gray-800">شرح دوا</th>
                                <th className="py-4 text-sm font-bold text-gray-800 text-center">تعداد</th>
                                <th className="py-4 text-sm font-bold text-gray-800 text-left">قیمت واحد</th>
                                <th className="py-4 text-sm font-bold text-gray-800 text-left">مجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-50">
                                    <td className="py-4">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-xs text-teal-600 mt-1">{item.instructions}</div>
                                    </td>
                                    <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-4 text-left text-gray-600" dir="ltr">{item.unitPrice.toLocaleString()} AFN</td>
                                    <td className="py-4 text-left font-bold text-gray-800" dir="ltr">{item.totalPrice.toLocaleString()} AFN</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="p-8 bg-gray-50 flex justify-between items-start">
                    <div className="max-w-xs text-xs text-gray-400 leading-relaxed">
                        <p className="font-bold text-gray-500 mb-1">نوت:</p>
                        <p>این فکتور به صورت اتوماتیک توسط سیستم شین فارما صادر گردیده است. لطفاً در هنگام استفاده از دوا به رهنمای داکتر توجه نمایید.</p>
                    </div>
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">مجموع خالص:</span>
                            <span className="font-medium text-gray-800" dir="ltr">{invoice.subTotal.toLocaleString()} AFN</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">تخفیف:</span>
                            <span className="font-medium text-red-500" dir="ltr">-{invoice.discount.toLocaleString()} AFN</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                            <span className="text-lg font-bold text-gray-800">مجموع کل:</span>
                            <span className="text-2xl font-black text-teal-600" dir="ltr">{invoice.totalAmount.toLocaleString()} AFN</span>
                        </div>
                    </div>
                </div>

                {/* Footer Signature */}
                <div className="p-12 flex justify-between items-center opacity-40">
                    <div className="border-t border-gray-300 w-48 text-center pt-2 text-xs">امضای تحویل گیرنده</div>
                    <div className="border-t border-gray-300 w-48 text-center pt-2 text-xs">مهر و امضای فارمسست</div>
                </div>
            </div>

            {/* Print Styling */}
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background: white;
                        padding: 0;
                        margin: 0;
                    }
                    .font-sans {
                        font-family: inherit;
                    }
                }
            `}</style>
        </div>
    );
}
