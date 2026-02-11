'use client';

import { ChevronDown, ChevronLeft, Edit, Save, Trash2, Database } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function EditMedicineContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const medicineId = searchParams.get('id');

    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [groupsData, suppliersData, medicineData] = await Promise.all([
                invokeIPC('get-groups'),
                invokeIPC('get-suppliers'),
                invokeIPC('get-medicine-by-id', medicineId)
            ]);
            if (groupsData) setGroups(groupsData);
            if (suppliersData) setSuppliers(suppliersData);
            if (medicineData) setMedicine(medicineData);
            setLoading(false);
        };
        if (medicineId) loadData();
    }, [medicineId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            medicineId: medicineId,
            name: formData.get('name'),
            group: formData.get('group'),
            supplier: formData.get('supplier'),
            stock: Number(formData.get('stock')),
            buyPrice: Number(formData.get('buyPrice')),
            sellPrice: Number(formData.get('sellPrice')),
            description: formData.get('description'),
        };

        const result = await invokeIPC('update-medicine', data);
        if (result && result.success) {
            router.refresh();
            router.push(`/inventory/medicines/detail?id=${medicineId}`);
        } else {
            alert('خطا در ویرایش: ' + (result?.error || 'خطای ناشناخته'));
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
            <Link href="/inventory/medicines" className="text-teal-600 font-bold mt-4 inline-block font-sans">بازگشت به لست</Link>
        </div>
    );

    return (
        <div className="p-4 md:p-8 font-sans max-w-5xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest mb-2">
                    <Edit className="w-4 h-4" /> ویرایش و بروزرسانی محصول
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                    {medicine.name}
                    <span className="text-gray-300 font-normal mx-2">/</span>
                    <span className="text-gray-400 font-black text-xl font-sans uppercase">{medicine.medicineId}</span>
                </h1>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-medium">تمامی تغییرات پس از ذخیره به صورت آنی در سیستم اعمال می‌شوند.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-10 space-y-8 md:space-y-12">

                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                <Database className="w-4 h-4 text-teal-600" />
                            </div>
                            <h3 className="text-base font-black text-gray-800">اطلاعات پایه و هویت</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">نام ثبت شده دوا</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={medicine.name}
                                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">آیدی دوا (غیر قابل تغییر)</label>
                                <input
                                    type="text"
                                    disabled
                                    defaultValue={medicine.medicineId}
                                    className="w-full h-14 px-6 bg-gray-100/50 border border-gray-100 rounded-2xl text-sm font-black text-gray-400 cursor-not-allowed text-right font-sans"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">گروپ درمانی</label>
                                <div className="relative">
                                    <select
                                        name="group"
                                        required
                                        defaultValue={medicine.group}
                                        className="w-full h-14 px-6 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-800 appearance-none focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right"
                                    >
                                        <option value="">- انتخاب گروپ -</option>
                                        {groups.map(group => (
                                            <option key={group._id} value={group.name}>{group.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">نماینده یا عرضه کننده</label>
                                <div className="relative">
                                    <select
                                        name="supplier"
                                        required
                                        defaultValue={medicine.supplier}
                                        className="w-full h-14 px-6 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-800 appearance-none focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right"
                                    >
                                        <option value="">- انتخاب عرضه کننده -</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                <Save className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-black text-gray-800">قیمت گذاری و موجودی</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">قیمت خرید (واحد)</label>
                                <div className="relative">
                                    <input
                                        name="buyPrice"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        defaultValue={medicine.buyPrice}
                                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right font-sans"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">AFN</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">قیمت فروش (واحد)</label>
                                <div className="relative">
                                    <input
                                        name="sellPrice"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        defaultValue={medicine.sellPrice}
                                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right font-sans"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-teal-200">AFN</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">موجودی فعلی (تعداد)</label>
                                <input
                                    name="stock"
                                    type="number"
                                    required
                                    min="0"
                                    defaultValue={medicine.stock}
                                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all text-right font-sans"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">توضیحات و دستورالعمل‌ها</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={medicine.description}
                            placeholder="برای بروزرسانی توضیحات اینجا بنویسید..."
                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all resize-none text-right placeholder:text-gray-300"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="order-2 sm:order-1 px-10 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        انصراف و بازگشت
                    </button>
                    <button
                        type="submit"
                        className="order-1 sm:order-2 bg-teal-600 hover:bg-teal-700 text-white px-12 py-4 rounded-2xl shadow-xl shadow-teal-500/20 text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        ثبت نهایی تغییرات
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function EditMedicinePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>}>
            <EditMedicineContent />
        </Suspense>
    );
}
