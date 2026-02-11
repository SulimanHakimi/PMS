'use client';

import { Edit, ChevronLeft, Trash2, Database } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { invokeIPC } from '@/lib/ipc';

function MedicineDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const medicineId = searchParams.get('id');
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchMedicine = async () => {
            if (!medicineId) return;
            const data = await invokeIPC('get-medicine-by-id', medicineId);
            setMedicine(data);
            setLoading(false);
        };
        fetchMedicine();
    }, [medicineId]);

    const handleDelete = async () => {
        if (!confirm('آیا مطمئن هستید که می خواهید این دوا را حذف کنید؟ این عمل قابل بازگشت نیست.')) {
            return;
        }

        setDeleting(true);
        const result = await invokeIPC('delete-medicine', medicineId);

        if (result && result.success) {
            router.push('/inventory/medicines');
        } else {
            alert('حذف ناموفق بود: ' + (result?.error || 'خطای ناشناخته'));
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
    );

    if (!medicine) return (
        <div className="p-8 text-center bg-white rounded-3xl m-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-800">دوا پیدا نشد</h2>
            <Link href="/inventory/medicines" className="text-teal-600 font-bold mt-4 inline-block">بازگشت به لست</Link>
        </div>
    );

    return (
        <div className="p-4 md:p-8 font-sans max-w-6xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
                <div>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest mb-2">
                        اطلاعات تکمیلی محصول
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        {medicine.name}
                        <span className="text-gray-300 font-normal text-xl">/</span>
                        <span className="text-gray-400 font-black text-xl font-sans uppercase">{medicine.medicineId}</span>
                    </h1>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Link
                        href={`/inventory/medicines/edit?id=${medicine.medicineId}`}
                        className="flex-1 md:flex-none justify-center bg-white border border-gray-100 hover:border-teal-500 hover:text-teal-600 text-gray-600 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-2 text-sm font-black transition-all active:scale-95"
                    >
                        <Edit className="w-5 h-5" />
                        ویرایش محتوا
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 md:flex-none justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-4 rounded-2xl flex items-center gap-2 text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                        {deleting ? '...' : 'حذف ریکورد'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Side: Stats & Info Cards */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Primary Info Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-10">
                        <h3 className="text-base md:text-lg font-black text-gray-800 mb-8 border-b border-gray-50 pb-4">مشخصات کلیدی و برندینگ</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">عرضه کننده محصول</label>
                                <div className="text-xl font-black text-gray-800">{medicine.supplier || 'توزیع‌کننده ناشناخته'}</div>
                                <div className="inline-flex px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-tight">Verified Source</div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">دسته بندی دارویی</label>
                                <div className="text-xl font-black text-gray-800">{medicine.group}</div>
                                <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tight">Medical Library</div>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
                            <div className="p-6 bg-gray-50 rounded-2xl space-y-1">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">خرید فکتور</span>
                                <div className="text-xl font-black text-gray-800 font-sans">{medicine.buyPrice} <small className="text-[10px] opacity-40 uppercase">Afn</small></div>
                            </div>
                            <div className="p-6 bg-teal-50 rounded-2xl space-y-1">
                                <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">فروش نهایی</span>
                                <div className="text-xl font-black text-teal-700 font-sans">{medicine.sellPrice} <small className="text-[10px] opacity-40 uppercase">Afn</small></div>
                            </div>
                            <div className="p-6 bg-gray-900 rounded-2xl space-y-1">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">تفاوت سود</span>
                                <div className="text-xl font-black text-green-400 font-sans">+{medicine.sellPrice - medicine.buyPrice} <small className="text-[10px] opacity-40 uppercase">Afn</small></div>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10">
                        <h3 className="text-base md:text-lg font-black text-gray-800 mb-4">توضیحات و کاربرد</h3>
                        <p className="text-sm md:text-base text-gray-500 leading-loose text-right font-medium">
                            {medicine.description || 'برای این محصول هنوز توضیحاتی درج نشده است. توضیحات دقیق به پروسه تشخیص سریع‌تر توسط داکتر و فارمسست کمک می‌کند.'}
                        </p>
                    </div>
                </div>

                {/* Right Side: Inventory Status Card */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-teal-500/30 overflow-hidden relative group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Database className="w-8 h-8 text-teal-100" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[4px] mb-2 opacity-60">Current Inventory</p>
                            <div className="text-6xl font-black font-sans mb-4 tracking-tighter">
                                {medicine.stock}
                                <span className="text-xl font-medium ml-2 opacity-40 leading-none">PCS</span>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${medicine.stock < 10 ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-green-500 shadow-lg shadow-green-500/20'}`}>
                                {medicine.stock < 10 ? 'Critically Low' : 'Adequate Supply'}
                            </div>
                        </div>

                        <div className="relative z-10 mt-10 pt-8 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold opacity-60">مجموع دریافتی</span>
                                <span className="font-black font-sans tracking-wide">450 <small className="opacity-40">pcs</small></span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold opacity-60">فروخته شده</span>
                                <span className="font-black font-sans tracking-wide">152 <small className="opacity-40">pcs</small></span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Link Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3">
                        <button className="w-full justify-between px-6 py-4 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 rounded-2xl font-black text-xs transition-all flex items-center group">
                            تاریخچه ورود و خروج <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full justify-between px-6 py-4 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 rounded-2xl font-black text-xs transition-all flex items-center group">
                            چاپ بارکد محصول <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MedicineDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MedicineDetailContent />
        </Suspense>
    );
}
