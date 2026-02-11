'use client';

import { ChevronDown } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter } from 'next/navigation';

export default function AddMedicineForm({ groups, suppliers }) {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            medicineId: formData.get('medicineId'),
            group: formData.get('group'),
            supplier: formData.get('supplier'),
            stock: formData.get('stock'),
            buyPrice: Number(formData.get('buyPrice')),
            sellPrice: Number(formData.get('sellPrice')),
            description: formData.get('description'),
            sideEffects: formData.get('sideEffects'),
        };

        const result = await invokeIPC('add-medicine', data);
        if (result && result.success) {
            router.refresh();
            router.push('/inventory/medicines');
        } else {
            alert('Error adding medicine: ' + (result?.error || 'Unknown error'));
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="mb-6 md:mb-10 text-right">
                <h1 className="text-xl md:text-2xl font-black text-gray-800 flex flex-row items-center gap-2">
                    گدام <span className="text-gray-300 font-normal">›</span> لیست دواها <span className="text-gray-300 font-normal">›</span> اضافه کردن دوای جدید
                </h1>
                <p className="text-gray-400 text-xs md:text-sm mt-1.5 font-medium">لطفاً تمامی مشخصات دوا را با دقت وارد نمایید.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-right">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6 md:space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">نام مکمل دوا <span className="text-red-500">*</span></label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="مثلاً: Panadol 500mg"
                                className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-right"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">آیدی یا کد دوا <span className="text-red-500">*</span></label>
                            <input
                                name="medicineId"
                                type="text"
                                required
                                placeholder="مثلاً: MED-001"
                                className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-right font-sans"
                            />
                        </div>
                    </div>

                    {/* Classification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">گروپ یا دسته بندی <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="group" required className="w-full h-12 px-4 pr-10 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-right">
                                    <option value="">- انتخاب گروپ -</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group.name}>{group.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">عرضه کننده معتبر <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="supplier" required className="w-full h-12 px-4 pr-10 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-right">
                                    <option value="">- انتخاب عرضه کننده -</option>
                                    {suppliers?.map(supplier => (
                                        <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">قیمت خرید (واحد)</label>
                            <div className="relative">
                                <input
                                    name="buyPrice"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-black text-right font-sans"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">AFN</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">قیمت فروش (واحد)</label>
                            <div className="relative">
                                <input
                                    name="sellPrice"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-black text-right font-sans"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">AFN</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">مقدار موجودی اول</label>
                            <input
                                name="stock"
                                type="number"
                                required
                                min="0"
                                placeholder="0"
                                className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-black text-right font-sans"
                            />
                        </div>
                    </div>

                    {/* Extended Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">طریقه استفاده و توضیحات</label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="دستورالعمل های مصرف را اینجا بنویسید..."
                                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium resize-none text-right"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 text-right">عوارض جانبی احتمالی</label>
                            <textarea
                                name="sideEffects"
                                rows={4}
                                placeholder="در صورت وجود عوارض خاص، ذکر کنید..."
                                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium resize-none text-right"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="order-2 sm:order-1 px-8 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95"
                    >
                        انصراف
                    </button>
                    <button
                        type="submit"
                        className="order-1 sm:order-2 bg-[#009688] hover:bg-[#00796b] text-white px-12 py-3.5 rounded-xl shadow-lg shadow-teal-500/20 text-sm font-black transition-all active:scale-95"
                    >
                        تایید و ذخیره نهایی دوا
                    </button>
                </div>
            </form>
        </div>
    );
}
