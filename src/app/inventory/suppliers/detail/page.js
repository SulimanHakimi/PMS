'use client';

import { Edit, ChevronsLeft, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { invokeIPC } from '@/lib/ipc';

function SupplierDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supplierId = searchParams.get('id');
    const [supplier, setSupplier] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!supplierId) return;

            const [supplierData, allMedicines] = await Promise.all([
                invokeIPC('get-supplier-by-id', supplierId),
                invokeIPC('get-medicines')
            ]);

            setSupplier(supplierData);

            // Filter medicines by this supplier
            if (supplierData && allMedicines) {
                const supplierMedicines = allMedicines.filter(
                    med => med.supplier === supplierData.name
                );
                setMedicines(supplierMedicines);
            }

            setLoading(false);
        };
        fetchData();
    }, [supplierId]);

    const handleDelete = async () => {
        if (!confirm('آیا مطمئن هستید که می خواهید این عرضه کننده را حذف کنید؟ این عمل قابل بازگشت نیست.')) {
            return;
        }

        setDeleting(true);
        const result = await invokeIPC('delete-supplier', supplierId);

        if (result && result.success) {
            router.push('/inventory/suppliers');
        } else {
            alert('حذف ناموفق بود: ' + (result?.error || 'خطای ناشناخته'));
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-8 font-sans text-right">در حال بارگزاری...</div>;
    if (!supplier) return <div className="p-8 font-sans text-right">عرضه کننده پیدا نشد</div>;

    return (
        <div className="p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        گدام <span className="text-gray-400">›</span> عرضه کنندگان <span className="text-gray-400">›</span> {supplier.name}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">جزئیات کامل عرضه کننده</p>
                </div>
                <Link
                    href={`/inventory/suppliers/edit?id=${supplier._id}`}
                    className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    ویرایش جزئیات
                </Link>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Contact Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 text-right">معلومات تماس</h3>
                    <div className="space-y-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">شخص تماس</div>
                            <div className="text-lg font-medium text-gray-800">{supplier.contactPerson || 'نامشخص'}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">تلفن</div>
                            <div className="text-lg font-medium text-gray-800" dir="ltr">{supplier.phone || 'نامشخص'}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">ایمیل</div>
                            <div className="text-lg font-medium text-gray-800" dir="ltr">{supplier.email || 'نامشخص'}</div>
                        </div>
                    </div>
                </div>

                {/* Address & Stats */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 text-right">آدرس و آمار</h3>
                    <div className="space-y-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">آدرس</div>
                            <div className="text-lg font-medium text-gray-800">{supplier.address || 'نامشخص'}</div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <Package className="w-8 h-8 " />
                                <div className="text-right">
                                    <div className="text-2xl font-bold ">{medicines.length}</div>
                                    <div className="text-sm text-gray-500">تعداد دواها</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {supplier.notes && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4 text-right">یادداشت ها</h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-right">
                        {supplier.notes}
                    </p>
                </div>
            )}

            {/* Medicines List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 text-right">لیست دواهای این عرضه کننده</h3>
                {medicines.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">نام دوا</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">آیدی دوا</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">نام گروپ</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">قیمت خرید</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">موجودی</th>
                                    <th className="px-4 py-3 text-sm font-bold text-gray-800">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine) => (
                                    <tr key={medicine._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{medicine.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{medicine.medicineId}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{medicine.group}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-gray-800">{medicine.buyPrice || '0'} afn</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{medicine.stock}</td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/inventory/medicines/detail?id=${medicine.medicineId}`}
                                                className=" hover:text-teal-800 text-sm transition-colors"
                                            >
                                                مشاهده
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        هیچ دوایی از این عرضه کننده موجود نیست
                    </div>
                )}
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleDelete}
                    disabled={deleting || medicines.length > 0}
                    className="text-[#f44336] border border-[#f44336] hover:bg-[#f44336] hover:text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={medicines.length > 0 ? 'نمی توان عرضه کننده را حذف کرد زیرا دواهایی از این عرضه کننده موجود است' : ''}
                >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? 'در حال حذف...' : 'حذف عرضه کننده'}
                </button>
            </div>
        </div>
    );
}

export default function SupplierDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SupplierDetailContent />
        </Suspense>
    );
}
