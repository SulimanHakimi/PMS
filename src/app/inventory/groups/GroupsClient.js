'use client';

import { Search, ChevronRight, ChevronLeft, Plus, X, Trash2 } from 'lucide-react';
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
                alert('Connection Error: Access to Desktop Backend failed.\\n\\nAre you using a Web Browser? This app must be run as a Desktop Application (Electron) for database features to work.');
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
        <div className="p-8 relative font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        گدام <span className="text-gray-400">›</span> گروپ های دوایی ({groups.length.toString().padStart(2, '0')})
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">لیست گروپ های دوا.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    افزودن گروپ جدید
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="جستجو در گروپ های دوا..."
                        className="w-full h-10 pr-4 pl-10 bg-[#f1f5f9] border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-gray-400 text-right"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[50%] cursor-pointer group">
                                نام گروپ <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%] cursor-pointer group">
                                تعداد دواها <span className="inline-block mr-1 opacity-50 group-hover:opacity-100 text-xs">(مرتب سازی)</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%]">عملکرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group, index) => (
                            <tr key={group._id || index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{group.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{group.count.toString().padStart(2, '0')}</td>
                                <td className="py-4 px-6 flex items-center gap-3">
                                    <Link href={`/inventory/groups/${group.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-500 hover: text-sm flex items-center gap-1 transition-colors">
                                        مشاهده جزئیات <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteGroup(group.name)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="حذف گروپ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Group Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">افزودن گروپ جدید</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddGroup} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                                    نام گروپ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="مثلا: انتی بیوتیک"
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-right"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    disabled={loading}
                                >
                                    لغو
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !newGroupName.trim()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'در حال افزودن...' : 'افزودن گروپ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
