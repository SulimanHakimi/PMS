'use client';

import { ChevronDown } from 'lucide-react';

export default function AddMedicine() {
    return (
        <div className="p-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Inventory <span className="text-gray-400">›</span> List of Medicines <span className="text-gray-400">›</span> Add New Medicine
                </h1>
                <p className="text-gray-500 text-sm mt-1">*All fields are mandatory, except mentioned as (optional).</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name</label>
                        <input
                            type="text"
                            className="w-full h-11 px-4 bg-white border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine ID</label>
                        <input
                            type="text"
                            className="w-full h-11 px-4 bg-white border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Group</label>
                        <div className="relative">
                            <select className="w-full h-11 px-4 pr-10 bg-white border border-black rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500">
                                <option>- Select Group -</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity in Number</label>
                        <input
                            type="text"
                            className="w-full h-11 px-4 bg-white border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">How to Use</label>
                    <textarea
                        rows={4}
                        className="w-full p-4 bg-white border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Side Effects</label>
                    <textarea
                        rows={4}
                        className="w-full p-4 bg-white border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                    />
                </div>

                <div className="pt-4">
                    <button className="bg-[#f44336] hover:bg-[#d32f2f] text-white px-8 py-3 rounded shadow-sm text-sm font-medium transition-colors">
                        Save Details
                    </button>
                </div>
            </div>
        </div>
    );
}
