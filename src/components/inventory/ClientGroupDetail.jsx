'use client';

import { Search, ChevronRight, Plus, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';

const initialGroupMedicines = [
    { name: 'Augmentin 625 Duo Tablet', count: 22 },
    { name: 'Azithral 500 Tablet', count: 8 },
];

export default function ClientGroupDetail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [medicines, setMedicines] = useState(initialGroupMedicines);

    const handleAddMedicine = () => {
        // Simulate adding
        setMedicines([...medicines, { name: 'Anapthaline Cite', count: 14 }]);
        setIsModalOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="p-8 relative min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Inventory <span className="text-gray-400">›</span> Medicine Groups <span className="text-gray-400">›</span> Generic Medicine (0{medicines.length.toString().padStart(2, '0')})
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Detailed view of a medicine group.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Medicine
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for Medicine"
                        className="w-full h-10 pl-4 pr-10 bg-[#f1f5f9] border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-gray-400"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[40%] cursor-pointer group">
                                Medicine Name <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%] cursor-pointer group">
                                No of Medicines <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{medicine.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.count.toString().padStart(2, '0')}</td>
                                <td className="py-4 px-6">
                                    <button className="text-[#f44336] hover:text-[#d32f2f] text-sm flex items-center gap-2 transition-colors border border-transparent hover:border-[#f44336]/10 px-2 py-1 rounded">
                                        <Trash2 className="w-4 h-4" /> Remove from Group
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Group Button */}
            <button className="text-[#f44336] border border-[#f44336] hover:bg-[#f44336] hover:text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-all">
                <Trash2 className="w-4 h-4" />
                Delete Group
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-[500px] transform transition-all p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Add Medicine</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medicine</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Medicine Name or Medicine ID"
                                    className="w-full h-11 pl-4 pr-10 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <button
                            onClick={handleAddMedicine}
                            className="w-full bg-[#f44336] hover:bg-[#d32f2f] text-white py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Medicine to Group
                        </button>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#a3cfbb] text-[#0f5132] px-6 py-3 rounded shadow-lg flex items-center gap-3 animate-slide-up z-50">
                    <Check className="w-5 h-5" />
                    <span className="font-medium text-sm">Medicine Added to Group</span>
                </div>
            )}
        </div>
    );
}
