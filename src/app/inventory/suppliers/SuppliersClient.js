'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuppliersClient({ initialSuppliers }) {
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });
    const router = useRouter();

    // Update suppliers when initialSuppliers changes
    useEffect(() => {
        setSuppliers(initialSuppliers);
    }, [initialSuppliers]);

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        const result = await invokeIPC('add-supplier', newSupplier);
        if (result && result.success) {
            setSuppliers([...suppliers, result.supplier]);
            setShowAddModal(false);
            setNewSupplier({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });
            router.refresh();
        } else {
            alert('خطا در اضافه کردن عرضه کننده: ' + (result?.error || 'خطای ناشناخته'));
        }
    };

    const handleDeleteSupplier = async (supplierId, supplierName) => {
        if (!confirm(`آیا مطمئن هستید که میخواهید عرضه کننده "${supplierName}" را حذف کنید؟`)) return;

        const result = await invokeIPC('delete-supplier', supplierId);
        if (result && result.success) {
            setSuppliers(suppliers.filter(s => s._id !== supplierId));
            router.refresh();
        } else {
            alert('خطا در حذف عرضه کننده: ' + (result?.error || 'خطای ناشناخته'));
        }
    };

    return (
        <div className="p-8 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        گدام <span className="text-gray-400">›</span> لیست عرضه کنندگان
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">مدیریت عرضه کنندگان دوا</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#009688] hover:bg-[#00796b] text-white px-5 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    اضافه کردن عرضه کننده جدید
                </button>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">نام عرضه کننده</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">شخص تماس</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">تلفن</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">ایمیل</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">تعداد دواها</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-800">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    <Link
                                        href={`/inventory/suppliers/detail?id=${supplier._id}`}
                                        className=" hover:text-teal-800 hover:underline transition-colors"
                                    >
                                        {supplier.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{supplier.contactPerson || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600" dir="ltr">{supplier.phone || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600" dir="ltr">{supplier.email || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{supplier.medicineCount || 0}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDeleteSupplier(supplier._id, supplier.name)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {suppliers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                    هیچ عرضه کننده ای ثبت نشده است
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Supplier Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">اضافه کردن عرضه کننده جدید</h2>
                        <form onSubmit={handleAddSupplier} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">نام عرضه کننده *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">شخص تماس</label>
                                    <input
                                        type="text"
                                        value={newSupplier.contactPerson}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">تلفن</label>
                                    <input
                                        type="tel"
                                        value={newSupplier.phone}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                                    <input
                                        type="email"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                                <input
                                    type="text"
                                    value={newSupplier.address}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                    className="w-full h-11 px-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت</label>
                                <textarea
                                    value={newSupplier.notes}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                                    rows={3}
                                    className="w-full p-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    لغو
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#009688] hover:bg-[#00796b] text-white rounded transition-colors"
                                >
                                    ذخیره
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
