'use client';

import { Search, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

const groups = [
    { name: 'Generic Medicine', count: 2 },
    { name: 'Diabetes', count: 32 },
];

export default function MedicineGroups() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Inventory <span className="text-gray-400">›</span> Medicine Groups (02)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">List of medicines groups.</p>
                </div>
                <button className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors">
                    <Plus className="w-5 h-5" />
                    Add New Group
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Medicine Groups.."
                        className="w-full h-10 pl-4 pr-10 bg-[#f1f5f9] border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-gray-400"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[50%] cursor-pointer group">
                                Group Name <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[30%] cursor-pointer group">
                                No of Medicines <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{group.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{group.count.toString().padStart(2, '0')}</td>
                                <td className="py-4 px-6">
                                    <Link href={`/inventory/groups/${group.name.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-teal-600 text-sm flex items-center gap-1 transition-colors">
                                        View Full Detail <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
