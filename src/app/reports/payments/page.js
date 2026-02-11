'use client';

import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Search, Filter, ChevronDown } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { invokeIPC } from '@/lib/ipc';

export default function PaymentReport() {
    const [invoices, setInvoices] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesData, medicinesData, usersData] = await Promise.all([
                    invokeIPC('get-invoices'),
                    invokeIPC('get-medicines'),
                    invokeIPC('get-users')
                ]);
                setInvoices(invoicesData || []);
                setMedicines(medicinesData || []);
                setUsers(usersData || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const medicineMap = useMemo(() => {
        const map = {};
        medicines.forEach(m => {
            map[m.medicineId] = m;
        });
        return map;
    }, [medicines]);

    // Filter Logic
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            // Search Filter
            const matchSearch =
                (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

            // User Filter
            let matchUser = true;
            if (selectedUser) {
                matchUser = invoice.createdBy === selectedUser;
            }

            return matchSearch && matchUser;
        });
    }, [invoices, searchTerm, selectedUser]);

    // Financial Calculations on Filtered Data
    const stats = useMemo(() => {
        let totalRevenue = 0;
        let totalCost = 0;

        filteredInvoices.forEach(inv => {
            totalRevenue += (inv.totalAmount || 0);

            // Calculate Cost 
            if (inv.items && Array.isArray(inv.items)) {
                inv.items.forEach(item => {
                    const med = medicineMap[item.medicineId];
                    if (item.buyPrice !== undefined && item.buyPrice !== null) {
                        totalCost += (item.buyPrice * (item.quantity || 1));
                    } else if (med && med.buyPrice) {
                        totalCost += (med.buyPrice * (item.quantity || 1));
                    }
                });
            }
        });

        const grossProfit = totalRevenue - totalCost;
        const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

        return { totalRevenue, totalCost, grossProfit, margin };
    }, [filteredInvoices, medicineMap]);

    // Download Handler
    const handleDownload = () => {
        const headers = ["Invoice ID", "Customer", "Date", "Items Count", "Total Amount", "Status"];

        // Filter out any "Covid 19" related data if required, although filtering is primarily via UI states.
        // If user meant "exclude Covid 19 items from report", we can filter them here or in the main filter. 
        // For now, let's assume they want to exclude invoices that contain "Covid 19" in items or description?
        // Or specific items. csv usually lists invoices. 
        // Let's stick to exporting the filteredInvoices.

        const csvRows = [headers.join(",")];

        filteredInvoices.forEach(inv => {
            const dateStr = new Date(inv.createdAt || inv.date).toLocaleDateString('fa-IR');
            const row = [
                inv.invoiceNumber,
                inv.customerName || "N/A",
                dateStr,
                inv.items?.length || 0,
                inv.totalAmount,
                "Paid"
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = "data:text/csv;charset=utf-8," + "\uFEFF" + encodeURI(csvRows.join("\n")); // Add BOM for Excel
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "payment_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col font-sans text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-teal-600">راپور ها</span> <span className="text-gray-400 font-normal">›</span> راپور مالی و پرداخت ها
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">خلاصه وضعیت مالی، عواید و مفاد تخمینی</p>
                </div>
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                    دانلود گزارش (CSV)
                    <Download className="w-4 h-4" />
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
                <div className="relative sm:col-span-1 lg:col-span-2">
                    <input
                        type="text"
                        placeholder="جستجو (آیدی، نام مشتری)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pr-10 pl-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full h-11 pr-10 pl-10 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all"
                    >
                        <option value="">- همه کاربران -</option>
                        {users.map(u => (
                            <option key={u._id} value={u.username}>{u.username}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors">
                    <div>
                        <p className="text-gray-400 text-xs md:text-sm font-bold mb-1">مجموع عواید (فروش)</p>
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 font-sans">{stats.totalRevenue.toLocaleString()} <span className="text-xs font-bold text-gray-400 ml-1">AFN</span></h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-100 transition-colors">
                    <div>
                        <p className="text-gray-400 text-xs md:text-sm font-bold mb-1">مجموع مصارف (خرید)</p>
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 font-sans">{stats.totalCost.toLocaleString()} <span className="text-xs font-bold text-gray-400 ml-1">AFN</span></h3>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">بر اساس قیمت خرید فعلی</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-200 transition-colors sm:col-span-2 lg:col-span-1">
                    <div>
                        <p className="text-gray-400 text-xs md:text-sm font-bold mb-1">مفاد خالص (تخمینی)</p>
                        <h3 className={`text-xl md:text-2xl font-black font-sans ${stats.grossProfit >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                            {stats.grossProfit >= 0 ? '+' : ''}{stats.grossProfit.toLocaleString()} <span className="text-xs font-bold text-gray-400 ml-1">AFN</span>
                        </h3>
                        <p className={`text-[10px] sm:text-xs mt-1 font-bold ${stats.grossProfit >= 0 ? 'text-teal-500' : 'text-red-400'}`}>
                            {stats.margin.toFixed(1)}% مارجین سود نهایی
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${stats.grossProfit >= 0 ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}>
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                        تراکنش های اخیر
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                    </h3>
                    <span className="text-[10px] md:text-xs bg-white border border-gray-200 px-3 py-1 rounded-full font-bold text-gray-500">{filteredInvoices.length} مورد</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                            <span className="text-gray-400 text-sm font-medium font-sans">در حال دریافت اطلاعات...</span>
                        </div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-2">
                            <Search className="w-12 h-12 text-gray-100" />
                            <span className="text-gray-300 text-sm font-medium">هیچ تراکنشی یافت نشد</span>
                        </div>
                    ) : (
                        <table className="w-full text-right min-w-[600px] md:min-w-0">
                            <thead className="bg-gray-50/30 text-gray-400 text-[11px] font-bold uppercase sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">آیدی فکتور</th>
                                    <th className="px-6 py-4">مشتری</th>
                                    <th className="px-6 py-4 text-center">تاریخ</th>
                                    <th className="px-6 py-4">مبلغ فکتور</th>
                                    <th className="px-6 py-4 text-center">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800 font-sans">{inv.invoiceNumber}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">توسط: {inv.createdBy}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-700">{inv.customerName || "مشتری عادی"}</div>
                                            <div className="text-[10px] text-gray-400">{inv.items?.length || 0} قلم دوا</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs text-gray-500 font-sans" dir="ltr">
                                            {new Date(inv.createdAt || inv.date).toLocaleDateString('fa-IR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-teal-600 font-sans">+{inv.totalAmount?.toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400">افغانی</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-700">
                                                پرداخت شده
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
