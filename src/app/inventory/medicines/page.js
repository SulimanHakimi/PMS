'use client';

import { Search, Filter, ChevronRight, ChevronLeft, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

const medicines = [
    { name: 'Augmentin 625 Duo Tablet', id: 'D06ID232435454', group: 'Generic Medicine', stock: 350 },
    { name: 'Azithral 500 Tablet', id: 'D06ID232435451', group: 'Generic Medicine', stock: 20 },
    { name: 'Ascoril LS Syrup', id: 'D06ID232435452', group: 'Diabetes', stock: 85 },
    { name: 'Azee 500 Tablet', id: 'D06ID232435450', group: 'Generic Medicine', stock: 75 },
    { name: 'Allegra 120mg Tablet', id: 'D06ID232435455', group: 'Diabetes', stock: 44 },
    { name: 'Alex Syrup', id: 'D06ID232435456', group: 'Generic Medicine', stock: 65 },
    { name: 'Amoxyclav 625 Tablet', id: 'D06ID232435457', group: 'Generic Medicine', stock: 150 },
    { name: 'Avil 25 Tablet', id: 'D06ID232435458', group: 'Generic Medicine', stock: 270 },
];

export default function MedicinesList() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Inventory <span className="text-gray-400">›</span> List of Medicines (298)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">List of medicines available for sales.</p>
                </div>
                <Link
                    href="/inventory/medicines/add"
                    className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Item
                </Link>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="Search Medicine Inventory.."
                        className="w-full h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:border-teal-500"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <div className="relative">
                        <select className="h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-md text-sm text-gray-600 appearance-none cursor-pointer focus:outline-none focus:border-teal-500 min-w-[160px]">
                            <option>- Select Group -</option>
                            <option>Generic Medicine</option>
                            <option>Diabetes</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[25%] cursor-pointer group">
                                Medicine Name <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%] cursor-pointer group">
                                Medicine ID <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%] cursor-pointer group">
                                Group Name <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[15%] cursor-pointer group">
                                Stock in Qty <span className="inline-block ml-1 opacity-50 group-hover:opacity-100">sort</span>
                            </th>
                            <th className="py-4 px-6 text-sm font-bold text-gray-800 w-[20%]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine, index) => (
                            <tr key={medicine.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-700">{medicine.name}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.group}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{medicine.stock}</td>
                                <td className="py-4 px-6">
                                    <Link
                                        href={`/inventory/medicines/${medicine.id}`}
                                        className="text-gray-500 hover:text-teal-600 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        View Full Detail <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500">
                        Showing 1 - 8 results of 298
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 font-medium">Page 01</span>
                        <button className="p-2 rounded hover:bg-gray-100 text-gray-500">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
