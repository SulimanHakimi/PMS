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
        <div className="p-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8 text-right">
                <h1 className="text-2xl font-bold text-gray-800 flex flex-row-reverse items-center gap-2">
                    گدام <span className="text-gray-400">›</span> لیست دواها <span className="text-gray-400">›</span> اضافه کردن دوای جدید
                </h1>
                <p className="text-gray-500 text-sm mt-1">*تمام فیلدها الزامی هستند.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">نام دوا</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">آیدی دوا</label>
                        <input
                            name="medicineId"
                            type="text"
                            required
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">گروپ دوا</label>
                        <div className="relative">
                            <select name="group" required className="w-full h-11 px-4 pr-10 bg-white border border-gray-300 rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right">
                                <option value="">- انتخاب گروپ -</option>
                                {groups.map(group => (
                                    <option key={group._id} value={group.name}>{group.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">عرضه کننده</label>
                        <div className="relative">
                            <select name="supplier" required className="w-full h-11 px-4 pr-10 bg-white border border-gray-300 rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right">
                                <option value="">- انتخاب عرضه کننده -</option>
                                {suppliers?.map(supplier => (
                                    <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">قیمت خرید (افغانی)</label>
                        <input
                            name="buyPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">قیمت فروش (افغانی)</label>
                        <input
                            name="sellPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">مقدار موجودی</label>
                        <input
                            name="stock"
                            type="number"
                            required
                            min="0"
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                    <div></div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">طریقه استفاده</label>
                    <textarea
                        name="description"
                        rows={4}
                        className="w-full p-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none text-right"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">عوارض جانبی (اختیاری)</label>
                    <textarea
                        name="sideEffects"
                        rows={4}
                        className="w-full p-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none text-right"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-[#009688] hover:bg-[#00796b] text-white px-8 py-3 rounded shadow-sm text-sm font-medium transition-colors">
                        ذخیره مشخصات
                    </button>
                </div>
            </form>
        </div>
    );
}
