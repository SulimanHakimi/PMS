'use client';

import { Search, ChevronRight, ChevronLeft, Plus, X, Trash2, Database, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { invokeIPC } from '@/lib/ipc';

export default function GroupsClient({ groups, onGroupAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;

        setLoading(true);
        try {
            const result = await invokeIPC('add-group', { name: newGroupName });
            setLoading(false);

            if (result === null) {
                alert('Connection Error: Access to Desktop Backend failed.\n\nAre you using a Web Browser? This app must be run as a Desktop Application (Electron) for database features to work.');
                return;
            }

            if (result && result.success) {
                setNewGroupName('');
                setIsModalOpen(false);
                if (onGroupAdded) onGroupAdded();
            } else {
                console.error('Add Group Error:', result);
                alert(result?.error || 'Failed to add group. Please check the logs.');
            }
        } catch (err) {
            setLoading(false);
            console.error('IPC Error:', err);
            alert('System Error: ' + err.message);
        }
    };

    const handleDeleteGroup = async (groupName) => {
        if (!confirm(`آیا مطمئن هستید که می خواهید گروپ "${groupName}" را حذف کنید؟`)) return;

        try {
            const result = await invokeIPC('delete-group', groupName);
            if (result && result.success) {
                if (onGroupAdded) onGroupAdded();
            } else {
                alert('خطا در حذف: ' + (result?.error || 'خطای ناشناخته'));
            }
        } catch (err) {
            alert('System Error: ' + err.message);
        }
    };

    return (
        <div className="p-4 md:p-8 font-sans max-w-6xl mx-auto" dir="rtl">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <LayoutGrid className="w-4 h-4" /> طبقه‌بندی محصولات
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        گروپ‌های دارویی <span className="text-gray-300 font-normal ml-2">({groups.length})</span>
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">سازماندهی هوشمند دواها بر اساس دسته‌بندی‌های درمانی و علمی.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-[#009688] hover:bg-[#00796b] text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 text-sm font-black transition-all active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    ایجاد گروپ جدید
                </button>
            </div>

            {/* Premium Search Area */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="relative group max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی سریع در بین گروپ‌ها..."
                        className="w-full h-12 pr-12 pl-6 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="py-5 px-8">نام و هویت گروپ</th>
                                <th className="py-5 px-8 text-center">تعداد اقلام زیرمجموعه</th>
                                <th className="py-5 px-8 text-left">عملیات مدیریت</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {groups.map((group, index) => (
                                <tr key={group._id || index} className="group hover:bg-teal-50/10 transition-all duration-300">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-teal-600 font-black group-hover:bg-white transition-all shadow-sm">
                                                {group.name.charAt(0)}
                                            </div>
                                            <div className="text-base font-black text-gray-800">{group.name}</div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center text-lg font-black text-gray-700 font-sans tracking-tight">
                                        {group.count.toString().padStart(2, '0')}
                                        <span className="text-[10px] text-gray-300 font-bold mr-2 uppercase">Items</span>
                                    </td>
                                    <td className="py-6 px-8 text-left">
                                        <div className="flex items-center gap-3 justify-end">
                                            <Link
                                                href={`/inventory/groups/${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-teal-600 text-xs font-black shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
                                            >
                                                مشاهده جزییات
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteGroup(group.name)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                title="حذف دائمی"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mb-6">
                {groups.map((group, index) => (
                    <div key={group._id || index} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-lg">
                                    {group.name.charAt(0)}
                                </div>
                                <h3 className="font-black text-gray-800 text-base">{group.name}</h3>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-gray-800 font-sans">{group.count}</div>
                                <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Items</div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-50">
                            <Link
                                href={`/inventory/groups/${group.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex-1 text-center py-3 bg-gray-50 rounded-xl text-teal-600 text-xs font-black"
                            >
                                مشاهده لیست
                            </Link>
                            <button
                                onClick={() => handleDeleteGroup(group.name)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {groups.length === 0 && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Database className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">هنوز هیچ گروپی تعریف نشده</h3>
                    <p className="text-gray-400 text-sm font-medium">برای شروع، اولین گروپ دارویی خود را ایجاد کنید.</p>
                </div>
            )}

            {/* Enhanced Add Group Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <div className="p-3 bg-teal-50 rounded-2xl">
                                    <LayoutGrid className="w-6 h-6 text-teal-600" />
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-black text-gray-800">ایجاد گروپ دارویی جدید</h3>
                            <p className="text-gray-400 text-sm font-medium mt-1">نام گروپ را برای سازماندهی دواها وارد کنید.</p>
                        </div>

                        <form onSubmit={handleAddGroup} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-right">نام گروپ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="مثلا: آنتی بیوتیک"
                                    className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-base text-right transition-all font-black"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-4 text-sm font-black text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
                                    disabled={loading}
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !newGroupName.trim()}
                                    className="flex-[2] px-4 py-4 text-sm font-black text-white bg-teal-600 rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-500/20 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {loading ? 'ثبت...' : 'ذخیره و ایجاد'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
