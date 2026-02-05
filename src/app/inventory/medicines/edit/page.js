'use client';

import { ChevronDown, ChevronLeft } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

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
            medicineId: medicineId, // Keep original ID for lookup
            name: formData.get('name'),
            group: formData.get('group'),
            supplier: formData.get('supplier'),
            stock: formData.get('stock'),
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

    if (loading) return <div className="p-8 font-sans text-right">در حال بارگزاری...</div>;
    if (!medicine) return <div className="p-8 font-sans text-right">دوا پیدا نشد</div>;

    return (
        <div className="p-8 max-w-5xl font-sans text-right">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-end gap-2">
                    {medicine.name} <span className="text-gray-400">‹</span> ویرایش دوا <span className="text-gray-400">‹</span> گدام
                </h1>
                <p className="text-gray-500 text-sm mt-1">*تمام فیلد ها الزامی هستند.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">آیدی دوا (غیر قابل تغییر)</label>
                        <input
                            name="medicineId"
                            type="text"
                            defaultValue={medicine.medicineId}
                            disabled
                            className="w-full h-11 px-4 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-500 text-right cursor-not-allowed"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">نام دوا</label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={medicine.name}
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">قیمت خرید (افغانی)</label>
                        <input
                            name="buyPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            defaultValue={medicine.buyPrice}
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">قیمت فروش (افغانی)</label>
                        <input
                            name="sellPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            defaultValue={medicine.sellPrice}
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">مقدار موجودی</label>
                        <input
                            name="stock"
                            type="number"
                            required
                            min="0"
                            defaultValue={medicine.stock}
                            className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                        />
                    </div>
                    <div></div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">گروپ دوا</label>
                        <div className="relative">
                            <select
                                name="group"
                                required
                                defaultValue={medicine.group}
                                className="w-full h-11 px-4 pr-10 bg-white border border-gray-300 rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                            >
                                <option value="">- انتخاب گروپ -</option>
                                {groups.map(group => (
                                    <option key={group._id} value={group.name}>{group.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">عرضه کننده</label>
                        <div className="relative">
                            <select
                                name="supplier"
                                required
                                defaultValue={medicine.supplier}
                                className="w-full h-11 px-4 pr-10 bg-white border border-gray-300 rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                            >
                                <option value="">- انتخاب عرضه کننده -</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">توضیحات</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={medicine.description}
                        className="w-full p-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none text-right"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded shadow-sm text-sm font-medium transition-colors"
                    >
                        انصراف
                    </button>
                    <button type="submit" className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-8 py-3 rounded shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
                        ذخیره تغییرات
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function EditMedicinePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditMedicineContent />
        </Suspense>
    );
}
