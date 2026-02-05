'use client';

import { Edit, ChevronsLeft, Trash2 } from 'lucide-react';
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

    if (loading) return <div className="p-8 font-sans text-right">در حال بارگزاری...</div>;
    if (!medicine) return <div className="p-8 font-sans text-right">دوا پیدا نشد</div>;

    return (
        <div className="p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        گدام <span className="text-gray-400">›</span> لیست دواها <span className="text-gray-400">›</span> {medicine.name}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">لیست دواهای موجود برای فروش.</p>
                </div>
                <Link
                    href={`/inventory/medicines/edit?id=${medicine.medicineId}`}
                    className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    ویرایش جزئیات
                </Link>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Medicine Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 text-right">معلومات دوا</h3>
                    <div className="space-y-4">
                        <div className="flex flex-row-reverse">
                            <div className="flex-1 text-right">
                                <div className="text-2xl font-bold text-gray-800 mb-1">{medicine.medicineId}</div>
                                <div className="text-sm text-gray-500">آیدی دوا</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="text-2xl font-bold text-gray-800 mb-1">{medicine.group}</div>
                                <div className="text-sm text-gray-500">گروپ دوا</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex flex-row-reverse gap-4">
                            <div className="flex-1 text-right">
                                <div className="text-xl font-bold mb-1">{medicine.supplier || 'نامشخص'}</div>
                                <div className="text-sm text-gray-500">عرضه کننده</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="text-xl font-bold text-gray-800 mb-1">{medicine.buyPrice} afn</div>
                                <div className="text-sm text-gray-500">قیمت خرید</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="text-xl font-bold text-teal-600 mb-1">{medicine.sellPrice} afn</div>
                                <div className="text-sm text-gray-500">قیمت فروش</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">موجودی گدام</h3>
                        <button className="text-xs font-semibold text-gray-500 flex items-center hover: transition-colors">
                            ارسال درخواست موجودی <ChevronsLeft className="w-4 h-4 mr-1" />
                        </button>
                    </div>

                    <div className="flex justify-between flex-row-reverse">
                        <div className="flex-1 border-l border-gray-100 last:border-0 pl-4 text-right">
                            <div className="text-2xl font-bold text-gray-800 mb-1">298</div>
                            <div className="text-sm text-gray-500">مجموع عرضه</div>
                        </div>
                        <div className="flex-1 border-l border-gray-100 last:border-0 px-6 text-right">
                            <div className="text-2xl font-bold text-gray-800 mb-1">290</div>
                            <div className="text-sm text-gray-500">مجموع فروش</div>
                        </div>
                        <div className="flex-1 pr-6 text-right">
                            <div className="text-2xl font-bold text-gray-800 mb-1">{medicine.stock}</div>
                            <div className="text-sm text-gray-500">موجودی فعلی</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Boxes */}
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-right">توضیحات</h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-right">
                        {medicine.description || 'توضیحاتی برای این دوا موجود نیست.'}
                    </p>
                </div>
            </div>

            {/* Delete Button */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-[#f44336] border border-[#f44336] hover:bg-[#f44336] hover:text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? 'در حال حذف...' : 'حذف دوا'}
                </button>
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
