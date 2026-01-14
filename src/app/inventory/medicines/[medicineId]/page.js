
import { Edit, ChevronsRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MedicineDetail() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Inventory <span className="text-gray-400">›</span> List of Medicines <span className="text-gray-400">›</span> Azithral 500 Tablet
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">List of medicines available for sales.</p>
                </div>
                <Link
                    href="/inventory/medicines/add"
                    className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Edit Details
                </Link>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Medicine Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Medicine</h3>
                    <div className="flex">
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-gray-800 mb-1">298</div>
                            <div className="text-sm text-gray-500">Medicine ID</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-2xl font-bold text-gray-800 mb-1">24</div>
                            <div className="text-sm text-gray-500">Medicine Group</div>
                        </div>
                    </div>
                </div>

                {/* Inventory Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Inventory in Qty</h3>
                        <button className="text-xs font-semibold text-gray-500 flex items-center hover:text-teal-600 transition-colors">
                            Send Stock Request <ChevronsRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex-1 border-r border-gray-100 last:border-0 pr-4">
                            <div className="text-2xl font-bold text-gray-800 mb-1">298</div>
                            <div className="text-sm text-gray-500">Lifetime Supply</div>
                        </div>
                        <div className="flex-1 border-r border-gray-100 last:border-0 px-6">
                            <div className="text-2xl font-bold text-gray-800 mb-1">290</div>
                            <div className="text-sm text-gray-500">Lifetime Sales</div>
                        </div>
                        <div className="flex-1 pl-6">
                            <div className="text-2xl font-bold text-gray-800 mb-1">08</div>
                            <div className="text-sm text-gray-500">Stock Left</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Boxes */}
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">How to use</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Take this medication by mouth with or without food as directed by your doctor, usually once daily.
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Side Effects</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Dizziness, lightheadedness, drowsiness, nausea, vomiting, tiredness, excess saliva/drooling, blurred vision, weight gain, constipation, headache, and trouble sleeping may occur. If any of these effects persist or worsen, consult your doctor.
                    </p>
                </div>
            </div>

            {/* Delete Button */}
            <div className="mt-8">
                <button className="text-[#f44336] border border-[#f44336] hover:bg-[#f44336] hover:text-white px-6 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-all">
                    <Trash2 className="w-4 h-4" />
                    Delete Medicine
                </button>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    return [{ medicineId: '298' }];
}
