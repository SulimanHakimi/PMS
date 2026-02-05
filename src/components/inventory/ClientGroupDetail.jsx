'use client';

import { Search, ChevronLeft, Plus, Trash2, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { invokeIPC } from '@/lib/ipc';

export default function ClientGroupDetail() {
    const params = useParams();
    const router = useRouter();
    // Normalize group name from URL
    const groupNameSlug = params.groupId; // e.g. "generic-medicine"
    // We assume the slug is formed by replacing spaces with hyphens and lowercase
    // Note: In a real app we might pass ID, but here we try to match by name or fetch group details

    // State
    const [groupName, setGroupName] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [allMedicines, setAllMedicines] = useState([]); // For adding new
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalSearchTerm, setModalSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [groupNameSlug]);

    const loadData = async () => {
        setLoading(true);
        // Fetch all groups to find the matching one
        const groups = await invokeIPC('get-groups');
        if (groups) {
            const group = groups.find(g => g.name.toLowerCase().replace(/\s+/g, '-') === groupNameSlug);
            if (group) {
                setGroupName(group.name);
                // Fetch all medicines
                const allMeds = await invokeIPC('get-medicines');
                if (allMeds) {
                    setAllMedicines(allMeds);
                    const groupMeds = allMeds.filter(m => m.group === group.name);
                    setMedicines(groupMeds);
                }
            } else {
                setGroupName('یافت نشد');
            }
        }
        setLoading(false);
    };

    const handleRemoveFromGroup = async (medicine) => {
        if (!confirm(`آیا مطمئن هستید که میخواهید "${medicine.name}" را از این گروپ حذف کنید؟`)) return;

        // "Removing" from a group usually means assigning to a default group or null.
        // Let's assume we reassign to "Generic Medicine" if current isn't Generic, or just 'Unassigned'
        // But schema requires group. Let's make it 'Generic Medicine' as default fallback.
        const defaultGroup = 'Generic Medicine';
        if (groupName === defaultGroup) {
            alert('نمیتوان از گروپ عمومی حذف کرد. لطفا دوا را مستقیما حذف کنید یا گروپ آن را تغییر دهید.');
            return;
        }

        const result = await invokeIPC('update-medicine', {
            medicineId: medicine.medicineId,
            group: defaultGroup
        });

        if (result && result.success) {
            loadData(); // Reload list
        } else {
            alert('خطا در تغییر گروپ: ' + (result?.error || 'خطای ناشناخته'));
        }
    };

    const handleDeleteGroup = async () => {
        if (medicines.length > 0) {
            alert(`این گروپ دارای ${medicines.length} دوا است. ابتدا باید دواها را حذف یا منتقل کنید.`);
            return;
        }
        if (!confirm(`آیا مطمئن هستید که میخواهید گروپ "${groupName}" را حذف کنید؟`)) return;

        const result = await invokeIPC('delete-group', groupName);
        if (result && result.success) {
            router.push('/inventory/groups');
        } else {
            alert('خطا در حذف گروپ: ' + (result?.error || 'خطای ناشناخته'));
        }
    };

    // Helper to add medicine to this group (reassign)
    const handleAddToGroup = async (medicineToMove) => {
        const result = await invokeIPC('update-medicine', {
            medicineId: medicineToMove.medicineId,
            group: groupName
        });

        if (result && result.success) {
            setIsModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            loadData();
        } else {
            alert('خطا در افزودن به گروپ: ' + (result?.error || 'خطای ناشناخته'));
        }
    };

    // Filter available medicines for modal (exclude currents)
    const availableMedicines = allMedicines
        .filter(m => m.group !== groupName)
        .filter(m => m.name.toLowerCase().includes(modalSearchTerm.toLowerCase()));

    if (loading) return <div className="p-8 text-right font-sans">در حال بارگزاری...</div>;

    return (
        <div className="p-8 relative min-h-screen font-sans text-right">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-end gap-2">
                        {groupName} ({medicines.length.toString().padStart(2, '0')}) <span className="text-gray-400">›</span> گروپ های دوایی <span className="text-gray-400">›</span> گدام
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">جزئیات گروپ دواها</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    افزودن دوا به گروپ
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md ml-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="جستجو در این گروپ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pr-4 pl-10 bg-[#f1f5f9] border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-gray-400 text-right"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[40%] cursor-pointer group">
                                نام دوا
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%] cursor-pointer group">
                                موجودی
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%]">عملکرد</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines
                            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((medicine, index) => (
                                <tr key={medicine._id || index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-700">{medicine.name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{medicine.stock}</td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleRemoveFromGroup(medicine)}
                                            className="text-[#f44336] hover:text-[#d32f2f] text-sm flex items-center gap-2 transition-colors border border-transparent hover:border-[#f44336]/10 px-2 py-1 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" /> حذف از گروپ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {medicines.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-8 text-gray-500">هیچ دوایی در این گروپ موجود نیست.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Group Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleDeleteGroup}
                    className="text-[#f44336] border border-[#f44336] hover:bg-[#f44336] hover:text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                    حذف کلی گروپ
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] transform transition-all p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">افزودن دوا به گروپ</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">جستجوی دوا</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="نام دوا را وارد کنید..."
                                    value={modalSearchTerm}
                                    onChange={(e) => setModalSearchTerm(e.target.value)}
                                    className="w-full h-11 pr-10 pl-4 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto mb-4 border rounded border-gray-100 p-2 custom-scrollbar">
                            {availableMedicines.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm p-4">دوایی یافت نشد.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {availableMedicines.map(m => (
                                        <li key={m._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                            <span className="text-sm text-gray-600">{m.group}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{m.name}</span>
                                                <button
                                                    onClick={() => handleAddToGroup(m)}
                                                    className="bg-teal-500 text-white p-1 rounded hover:bg-teal-600"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#a3cfbb] text-[#0f5132] px-6 py-3 rounded shadow-lg flex items-center gap-3 animate-slide-up z-50">
                    <Check className="w-5 h-5" />
                    <span className="font-medium text-sm">دوا با موفقیت افزوده شد</span>
                </div>
            )}
        </div>
    );
}
