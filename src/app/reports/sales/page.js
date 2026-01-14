'use client';

import { Calendar, ChevronDown, Download } from 'lucide-react';

const salesData = [
    { id: '2485855848598', date: '01 Dec 2021 10:25' },
    { id: '2485855848577', date: '02 Dec 2021 18:25' },
    { id: '2485855848563', date: '03 Dec 2021 18:25' },
    { id: '2485855848599', date: '05 Dec 2021 18:25' },
    { id: '2485855848568', date: '09 Dec 2021 18:25' },
    { id: '2485855848567', date: '10 Dec 2021 18:25' },
    { id: '2485855848564', date: '15 Dec 2021 18:25' },
    { id: '2485855848544', date: '21 Dec 2021 18:25' },
];

export default function SalesReport() {
    return (
        <div className="p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Reports <span className="text-gray-400">›</span> Sales Report
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Sales related report of the pharmacy.</p>
                </div>
                <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                    Download Report
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="relative">
                        <input
                            type="text"
                            defaultValue="01 December 2021 - 31 December 2021"
                            className="w-full h-11 pl-4 pr-10 bg-white border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Group</label>
                    <div className="relative">
                        <select className="w-full h-11 pl-4 pr-10 bg-[#f1f5f9] border border-transparent rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option>- Select Group -</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                    <div className="relative">
                        <select className="w-full h-11 pl-4 pr-10 bg-[#f1f5f9] border border-transparent rounded-md text-sm text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option>- Select User Name -</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Sales Made</h3>

                    <div className="flex-1 relative flex items-end pb-8 pl-8 pr-4">
                        {/* Y Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                            <span>250</span>
                            <span>150</span>
                            <span>100</span>
                            <span>50</span>
                            <span>0</span>
                        </div>

                        {/* Chart Grid Lines */}
                        <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between z-0">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-full border-t border-dashed border-gray-100 h-0"></div>
                            ))}
                        </div>

                        {/* Chart Curve (SVG Mock) */}
                        <svg className="w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#2196f3" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#2196f3" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 Q10,70 20,60 T40,50 T60,20 T80,30 T100,25 L100,100 L0,100 Z"
                                fill="url(#gradient)"
                            />
                            <path
                                d="M0,80 Q10,70 20,60 T40,50 T60,20 T80,30 T100,25"
                                fill="none"
                                stroke="#2196f3"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            {/* Highlight Point */}
                            <circle cx="60" cy="20" r="3" fill="white" stroke="#2196f3" strokeWidth="2" vectorEffect="non-scaling-stroke">
                            </circle>
                        </svg>

                        {/* Tooltip Mock */}
                        <div className="absolute top-[20%] left-[60%] -translate-x-1/2 -translate-y-[20px] bg-slate-700 text-white text-[10px] py-1 px-2 rounded opacity-80">
                            146
                        </div>
                    </div>

                    {/* X Axis Labels */}
                    <div className="flex justify-between pl-8 text-xs text-gray-400 mt-2">
                        <span>1 Dec</span>
                        <span>8 Dec</span>
                        <span>16 Dec</span>
                        <span>31 Dec</span>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Order ID</h3>
                        <h3 className="font-bold text-gray-800">Date & Time</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full">
                            <tbody>
                                {salesData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
