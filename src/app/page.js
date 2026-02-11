'use client';

import Link from "next/link";
import {
  ShieldCheck,
  Banknote,
  BriefcaseMedical,
  AlertOctagon,
  ChevronsLeft,
  ChevronDown,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Users,
  Package,
  CalendarDays,
  ArrowUpRight,
  Database,
  Briefcase
} from "lucide-react";
import { useEffect, useState } from 'react';
import { invokeIPC } from '@/lib/ipc';

export default function Home() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalGroups: 0,
    shortageCount: 0,
    revenue: 0,
    qtySold: 0,
    invoices: 0,
    suppliers: 0,
    users: 0,
    customers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await invokeIPC('get-dashboard-stats');
      if (data) {
        setStats(prev => ({ ...prev, ...data }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-8 font-sans max-w-[1600px] mx-auto" dir="rtl">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 md:mb-14">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
            <LayoutDashboard className="w-4 h-4" /> سیستم مدیریت هوشمند پانته‌آ
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            خلاصه وضعیت سیستم
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl">خوش آمدید. در اینجا نمایی کلی از عملکردهای حیاتی، موجودی گدام و جریان‌های نقدی دواخانه را در لحظه مشاهده می‌کنید.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-600 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-gray-200/20 hover:bg-gray-50 transition-all active:scale-95 group">
            <CalendarDays className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
            امروز: {new Date().toLocaleDateString('fa-IR')}
          </button>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        <StatusCard
          icon={Activity}
          title="وضعیت عملیاتی"
          subtitle="سیستم در پایداری کامل است"
          value="بسیار عالی"
          variant="teal"
          href="/inventory/medicines"
          buttonText="مدیریت گدام"
        />
        <StatusCard
          icon={TrendingUp}
          title="فروشات ماهانه"
          subtitle="رشد ۱۳٪ نسبت به ماه قبل"
          value={`${stats.revenue.toLocaleString()} AFN`}
          variant="indigo"
          href="/reports/sales"
          buttonText="تحلیل فروش"
        />
        <StatusCard
          icon={Package}
          title="تنوع موجودی"
          subtitle="بروزرسانی شده: همین حالا"
          value={stats.totalMedicines}
          variant="blue"
          href="/inventory/medicines"
          buttonText="لیست محصولات"
        />
        <StatusCard
          icon={AlertOctagon}
          title="اقلام بحرانی"
          subtitle="نیاز به شارژ مجدد فوری"
          value={stats.shortageCount.toString().padStart(2, '0')}
          variant="rose"
          href="/inventory/medicines"
          buttonText="بررسی کمبودها"
        />
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {/* Main Analytics Card */}
        <div className="xl:col-span-2 bg-gray-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-gray-400/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-all duration-700"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h3 className="text-xl font-black mb-1">عملکرد مالی و تراکنش‌ها</h3>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Financial Performance Index</p>
              </div>
              <Link href="/reports/sales" className="flex items-center gap-2 text-teal-400 text-xs font-black hover:text-teal-300 transition-colors group/link">
                مشاهده گزارش تفصیلی <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-teal-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">تعداد فروش</div>
                  <div className="text-2xl font-black font-sans">{stats.qtySold}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">بل‌های صادره</div>
                  <div className="text-2xl font-black font-sans">{stats.invoices}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">مشتریان جدید</div>
                  <div className="text-2xl font-black font-sans">{stats.customers}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">دیتابیس گدام</div>
                  <div className="text-2xl font-black font-sans">{stats.totalGroups} <span className="text-[8px] opacity-40">GROUPS</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
            <Activity className="w-5 h-5 text-teal-500" /> دسترسی سریع مدیریتی
          </h3>

          <div className="space-y-4 flex-1">
            <QuickActionLink
              href="/inventory/medicines/add"
              title="ثبت محصول جدید"
              desc="افزودن دوا به دیتابیس گدام"
              color="teal"
            />
            <QuickActionLink
              href="/sales/new"
              title="صدور فاکتور فروش"
              desc="ثبت تراکنش و کاهش موجودی"
              color="blue"
            />
            <QuickActionLink
              href="/contacts/list"
              title="مدیریت مخاطبین"
              desc="تأمین‌کنندگان و مشتریان"
              color="orange"
            />
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Active Sessions</span>
              <span className="text-teal-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                {stats.users} Users Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, subtitle, value, variant, href, buttonText }) {
  const variants = {
    teal: {
      bg: 'bg-teal-50',
      icon: 'text-teal-600',
      btn: 'bg-teal-600 shadow-teal-500/20',
      border: 'hover:border-teal-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      btn: 'bg-indigo-600 shadow-indigo-500/20',
      border: 'hover:border-indigo-200'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      btn: 'bg-blue-600 shadow-blue-500/20',
      border: 'hover:border-blue-200'
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      btn: 'bg-rose-600 shadow-rose-500/20',
      border: 'hover:border-rose-200'
    }
  };

  const v = variants[variant];

  return (
    <div className={`bg-white rounded-[2.5rem] p-4 flex flex-col border border-gray-100 shadow-sm transition-all duration-300 ${v.border} group relative overflow-hidden`}>
      <div className="p-4 md:p-6 mb-6">
        <div className={`w-14 h-14 rounded-2xl ${v.bg} ${v.icon} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7 stroke-[2.5px]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
          <div className="text-xl md:text-2xl font-black text-gray-900 font-sans tracking-tight">{value}</div>
          <p className="text-xs font-bold text-gray-400">{subtitle}</p>
        </div>
      </div>

      <Link
        href={href}
        className={`w-full py-4 rounded-2xl ${v.btn} text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] group-hover:translate-y-[-2px]`}
      >
        {buttonText} <ChevronsLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}

function QuickActionLink({ href, title, desc, color }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group">
      <div className={`w-12 h-12 rounded-[1.25rem] ${colors[color]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <ArrowUpRight className="w-5 h-5" />
      </div>
      <div className="text-right">
        <div className="text-sm font-black text-gray-800">{title}</div>
        <div className="text-[10px] font-bold text-gray-400 truncate">{desc}</div>
      </div>
    </Link>
  );
}
