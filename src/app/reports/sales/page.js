'use client';

import { Calendar, ChevronDown, Download, Search, Filter, BarChart3, TrendingUp, Users, DollarSign, ChevronLeft } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { invokeIPC } from '@/lib/ipc';

export default function SalesReport() {
    const [invoices, setInvoices] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesData, groupsData, usersData, medicinesData] = await Promise.all([
                    invokeIPC('get-invoices'),
                    invokeIPC('get-groups'),
                    invokeIPC('get-users'),
                    invokeIPC('get-medicines')
                ]);
                setInvoices(invoicesData || []);
                setGroups(groupsData || []);
                setUsers(usersData || []);
                setMedicines(medicinesData || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const medicineGroupMap = useMemo(() => {
        const map = {};
        medicines.forEach(m => {
            if (m.medicineId) map[m.medicineId] = m.group;
        });
        return map;
    }, [medicines]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchSearch =
                (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

            let matchGroup = true;
            if (selectedGroup) {
                matchGroup = invoice.items.some(item => medicineGroupMap[item.medicineId] === selectedGroup);
            }

            let matchUser = true;
            if (selectedUser) {
                if (invoice.createdBy) {
                    matchUser = invoice.createdBy === selectedUser;
                } else {
                    matchUser = selectedUser === 'admin';
                }
            }

            return matchSearch && matchGroup && matchUser;
        });
    }, [invoices, searchTerm, selectedGroup, selectedUser, medicineGroupMap]);

    const totalSales = filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalInvoicesCount = filteredInvoices.length;

    const chartData = useMemo(() => {
        const daily = {};
        filteredInvoices.forEach(inv => {
            const date = new Date(inv.createdAt || inv.date).toLocaleDateString('fa-IR');
            daily[date] = (daily[date] || 0) + (inv.totalAmount || 0);
        });
        return Object.entries(daily).map(([date, amount]) => ({ date, amount }));
    }, [filteredInvoices]);

    const maxChartValue = Math.max(...chartData.map(d => d.amount), 1);

    return (
        <div className="p-4 md:p-8 font-sans max-w-[1600px] mx-auto" dir="rtl">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <BarChart3 className="w-4 h-4" /> مرکز تحلیل و داده‌های مالی
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight">
                        گزارش جامع فروشات
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">تجزیه و تحلیل دقیق تراکنش‌ها، سودآوری و عملکرد سیستم فروش.</p>
                </div>

                <button className="w-full sm:w-auto bg-gray-900 border border-gray-800 text-white px-8 py-4 rounded-2xl shadow-xl shadow-gray-500/10 flex items-center justify-center gap-2 text-sm font-black transition-all active:scale-95 group">
                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    خروجی اکسل و PDF
                </button>
            </div>

            {/* Premium Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <DollarSign className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">مجموع فروشات</div>
                        <div className="text-xl font-black text-gray-800 font-sans tracking-tight">{totalSales.toLocaleString()} <small className="text-[10px] opacity-40">AFN</small></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">تعداد فاکتورها</div>
                        <div className="text-xl font-black text-gray-800 font-sans tracking-tight">{totalInvoicesCount.toLocaleString()} <span className="text-xs font-bold text-gray-300">Case</span></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">میانگین هر فاکتور</div>
                        <div className="text-xl font-black text-gray-800 font-sans tracking-tight">
                            {totalInvoicesCount > 0 ? Math.round(totalSales / totalInvoicesCount).toLocaleString() : 0} <small className="text-[10px] opacity-40">AFN</small>
                        </div>
                    </div>
                </div>
                <div className="bg-teal-600 p-6 rounded-[2rem] shadow-xl shadow-teal-500/20 flex items-center gap-5 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">بازه زمانی فعال</div>
                        <div className="text-sm font-black tracking-tight">{chartData.length} روز اخیر</div>
                    </div>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="relative group lg:col-span-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="جستجوی فاکتور یا مشتری..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pr-12 pl-6 bg-white border border-gray-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all"
                    />
                </div>

                <div className="relative">
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full h-12 pr-12 pl-4 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    >
                        <option value="">همه گروپ‌ها</option>
                        {groups.map(g => (
                            <option key={g._id} value={g.name}>{g.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full h-12 pr-12 pl-4 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all shadow-sm"
                    >
                        <option value="">همه کاربران</option>
                        {users.map(u => (
                            <option key={u._id} value={u.username}>{u.username}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-base font-black text-gray-800">جزییات تراکنش‌های فیلتر شده</h3>
                            <div className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none">
                                Logs: {filteredInvoices.length} entries
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/20 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <th className="py-5 px-8">فاکتور</th>
                                        <th className="py-5 px-8">مشتری</th>
                                        <th className="py-5 px-8 text-center">زمان ثبت</th>
                                        <th className="py-5 px-8 text-center">مبلغ</th>
                                        <th className="py-5 px-8 text-left">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredInvoices.map((inv) => (
                                        <tr key={inv._id} className="group hover:bg-teal-50/10 transition-all duration-300">
                                            <td className="py-5 px-8">
                                                <div className="text-xs font-black text-gray-800 font-sans tracking-wider uppercase">#{inv.invoiceNumber}</div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="text-xs font-bold text-gray-600">{inv.customerName || 'مشتری ناشناس'}</div>
                                            </td>
                                            <td className="py-5 px-8 text-center" dir="ltr">
                                                <span className="text-[10px] font-black text-gray-400 font-sans">
                                                    {new Date(inv.createdAt || inv.date).toLocaleDateString('fa-IR')}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-center">
                                                <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-black font-sans">
                                                    {inv.totalAmount?.toLocaleString()} <small className="text-[8px] opacity-70">AFN</small>
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-left">
                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-teal-600 hover:text-white transition-all">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredInvoices.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                                    <Search className="w-16 h-16 opacity-10 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest opacity-20">No matching records</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Section */}
                <div className="space-y-8">
                    {/* Tiny Chart Card */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-400/20">
                        <h3 className="text-base font-black flex items-center gap-3 mb-10">
                            <TrendingUp className="w-5 h-5 text-teal-400" /> روند فروش روزانه
                        </h3>

                        <div className="flex items-end justify-between gap-2 h-48 border-b border-white/10 pb-4">
                            {chartData.length > 0 ? chartData.slice(-7).map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                                    <div
                                        className="w-full bg-teal-500 rounded-xl hover:bg-teal-400 transition-all duration-500 shadow-lg shadow-teal-500/20"
                                        style={{ height: `${(d.amount / maxChartValue) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                            {d.amount.toLocaleString()} AFN
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter truncate w-full text-center">{d.date.split('/')[2]} {d.date.split('/')[1]}</span>
                                </div>
                            )) : (
                                <div className="w-full text-center text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-30">
                                    Insufficient Data
                                </div>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Peak Sales</span>
                                <div className="text-base font-black font-sans">{Math.round(maxChartValue).toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Period</span>
                                <div className="text-base font-black font-sans">{chartData.length} Days</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Analytics Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50 pb-4">تحلیل سریع عملکرد</h3>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors">فروشات نقدی</span>
                                </div>
                                <span className="text-xs font-black font-sans text-gray-800">82%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                <div className="w-[82%] h-full bg-green-500 rounded-full"></div>
                            </div>

                            <div className="flex justify-between items-center group cursor-pointer pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors">فروشات اعتباری</span>
                                </div>
                                <span className="text-xs font-black font-sans text-gray-800">18%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                <div className="w-[18%] h-full bg-blue-500 rounded-full"></div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button className="w-full py-4 bg-teal-50 text-teal-700 rounded-2xl text-xs font-black hover:bg-teal-600 hover:text-white transition-all">
                                مشاهده سناریو‌های سودآوری
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
