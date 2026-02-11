'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, UserCheck, Phone, Mail, MapPin, Building2, X, Search, ChevronLeft } from 'lucide-react';
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
        <div className="p-4 md:p-8 font-sans max-w-[1600px] mx-auto" dir="rtl">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <Building2 className="w-4 h-4" /> شبکه تأمین گنندگان
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        لیست عرضه کنندگان <span className="text-gray-300 font-normal ml-2">({suppliers.length})</span>
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">مدیریت تعاملات، اطلاعات تماس و ثبت قراردادهای منابع تأمین کالا.</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-[#009688] hover:bg-[#00796b] text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 text-sm font-black transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    ثبت عرضه کننده جدید
                </button>
            </div>

            {/* Premium Search Area */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                <div className="flex-1 relative group max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی نام یا کد تأمین کننده..."
                        className="w-full h-12 pr-12 pl-6 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="py-5 px-8">مشخصات کمپانی</th>
                                <th className="py-5 px-8">مسئول رابط</th>
                                <th className="py-5 px-8">اطلاعات تماس</th>
                                <th className="py-5 px-8 text-center">حجم همکاری</th>
                                <th className="py-5 px-8 text-left">مدیریت</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {suppliers.map((supplier) => (
                                <tr key={supplier._id} className="group hover:bg-teal-50/10 transition-all duration-300">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-lg group-hover:bg-white transition-all shadow-sm">
                                                {supplier.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/inventory/suppliers/detail?id=${supplier._id}`}
                                                    className="text-base font-black text-gray-800 hover:text-teal-600 transition-colors block"
                                                >
                                                    {supplier.name}
                                                </Link>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Manufacturer</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                            <UserCheck className="w-4 h-4 text-gray-300" />
                                            {supplier.contactPerson || 'ثبت نشده'}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="space-y-1.5 font-sans">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-700" dir="ltr">
                                                <Phone className="w-3.5 h-3.5 text-teal-500" />
                                                {supplier.phone || '---'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-tight" dir="ltr">
                                                <Mail className="w-3.5 h-3.5 opacity-50" />
                                                {supplier.email || 'no-email@database.com'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <span className="inline-flex px-4 py-1.5 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-black group-hover:bg-white transition-all">
                                            {supplier.medicineCount || 0} قلم محصول
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-left">
                                        <div className="flex items-center gap-3 justify-end">
                                            <button
                                                onClick={() => handleDeleteSupplier(supplier._id, supplier.name)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                title="حذف عرضه کننده"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 mb-6">
                {suppliers.map((supplier) => (
                    <div key={supplier._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xl">
                                    {supplier.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-none mb-2">{supplier.name}</h3>
                                    <div className="flex items-center gap-1.5 text-teal-600 text-[10px] font-black uppercase tracking-wider">
                                        <UserCheck className="w-3 h-3" /> {supplier.contactPerson || 'No Contact'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Phone className="w-4 h-4 text-gray-300 mb-2" />
                                <span className="text-[10px] font-sans font-black text-gray-800" dir="ltr">{supplier.phone || '---'}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Building2 className="w-4 h-4 text-gray-300 mb-2" />
                                <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{supplier.medicineCount || 0} Items</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/inventory/suppliers/detail?id=${supplier._id}`}
                                className="flex-1 text-center py-4 bg-gray-900 text-white rounded-2xl text-xs font-black shadow-lg shadow-gray-200"
                            >
                                مشاهده جزییات پرونده
                            </Link>
                            <button
                                onClick={() => handleDeleteSupplier(supplier._id, supplier.name)}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {suppliers.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">دییتابیس تأمین کنندگان خالی است</h3>
                    <p className="text-gray-400 text-sm font-medium">برای شروع مدیریت زنجیره تأمین، اولین عرضه کننده را اضافه کنید.</p>
                </div>
            )}

            {/* Enhanced Add Supplier Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-10 border-b border-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <div className="p-4 bg-teal-50 rounded-2xl">
                                    <Building2 className="w-6 h-6 text-teal-600" />
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-gray-800">ایجاد پرونده جدید عرضه کننده</h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">کلیه اطلاعات مرتبط با کمپانی تأمین کننده را جهت مراجعات بعدی وارد کنید.</p>
                        </div>

                        <form onSubmit={handleAddSupplier} className="p-8 md:p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">نام رسمی کمپانی <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                        className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black"
                                        placeholder="نام برند یا شرکت..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">شخص رابط (Sales Rep)</label>
                                    <input
                                        type="text"
                                        value={newSupplier.contactPerson}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                                        className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black"
                                        placeholder="نام و تخلص رابط..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">شماره تماس مستقیم</label>
                                    <input
                                        type="tel"
                                        value={newSupplier.phone}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                        className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black font-sans"
                                        dir="ltr"
                                        placeholder="+93 (0) XXX XXX XXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">پست الکترونیک (Email)</label>
                                    <input
                                        type="email"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                        className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black font-sans"
                                        dir="ltr"
                                        placeholder="vendor@company.af"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">آدرس فیزیکی دفتر مرکزی</label>
                                <div className="relative">
                                    <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={newSupplier.address}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                        className="w-full h-14 pr-14 pl-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black"
                                        placeholder="شهر، جاده، شماره تعمیر..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="order-2 sm:order-1 flex-1 py-4 text-sm font-black text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
                                >
                                    انصراف و بستن
                                </button>
                                <button
                                    type="submit"
                                    className="order-1 sm:order-2 flex-[2] py-4 text-sm font-black text-white bg-teal-600 rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-500/20 transition-all active:scale-95"
                                >
                                    ذخیره و ثبت عرضه کننده
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
