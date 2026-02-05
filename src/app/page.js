'use client';

import Link from "next/link";
import {
  ShieldCheck,
  Banknote,
  BriefcaseMedical,
  AlertOctagon,
  ChevronsLeft,
  ChevronDown
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
    <div className="p-8 font-sans">
      {/* Page Title Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">دشبورد</h1>
          <p className="text-gray-500 text-sm mt-1">مرور سریع وضعیت گدام</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-md text-gray-600 font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
          دانلود راپور
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={ShieldCheck}
          iconColor="text-[#4caf50]"
          borderColor="border-[#4caf50]"
          bgButton="bg-[#4caf50]/10"
          textButton="text-[#4caf50]"
          title="خوب"
          subtitle="وضعیت گدام"
          buttonText="مشاهده راپور مفصل"
          variant="green"
          href="/inventory/medicines"
        />
        <StatusCard
          icon={Banknote}
          iconColor="text-[#ffc107]"
          borderColor="border-[#ffc107]"
          bgButton="bg-[#ffc107]/10"
          textButton="text-[#ffc107]"
          value={`${stats.revenue} افغانی`}
          subtitle="عایدات : جنوری ۲۰۲۶"
          secondarySubtitle=""
          buttonText="مشاهده راپور مفصل"
          variant="yellow"
          href="/reports/sales"
        />
        <StatusCard
          icon={BriefcaseMedical}
          iconColor="text-[#2196f3]"
          borderColor="border-[#2196f3]"
          bgButton="bg-[#2196f3]/10"
          textButton="text-[#2196f3]"
          value={stats.totalMedicines}
          subtitle="دواهای موجود"
          buttonText="مشاهده گدام"
          variant="blue"
          href="/inventory/medicines"
        />
        <StatusCard
          icon={AlertOctagon}
          iconColor="text-[#f44336]"
          borderColor="border-[#f44336]"
          bgButton="bg-[#f44336]/10"
          textButton="text-[#f44336]"
          value={stats.shortageCount.toString().padStart(2, '0')}
          subtitle="کمبود دوا"
          buttonText="حل مشکل"
          variant="red"
          href="/inventory/medicines"
        />
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Inventory Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">گدام</h3>
            <Link href="/configuration" className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              رفتن به تنظیمات <ChevronsLeft className="w-4 h-4 mr-1" />
            </Link>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pl-4 border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalMedicines}</div>
              <div className="text-sm text-gray-500">تعداد مجموعی دواها</div>
            </div>
            <div className="flex-1 pr-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalGroups}</div>
              <div className="text-sm text-gray-500">گروپ های دوایی</div>
            </div>
          </div>
        </div>

        {/* Quick Report Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">راپور سریع</h3>
            <div className="flex items-center text-xs font-medium text-gray-500 cursor-pointer">
              جنوری ۲۰۲۶ <ChevronDown className="w-4 h-4 mr-1" />
            </div>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pl-4 border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.qtySold}</div>
              <div className="text-sm text-gray-500">تعداد دوای فروخته شده</div>
            </div>
            <div className="flex-1 pr-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.invoices}</div>
              <div className="text-sm text-gray-500">بل های ایجاد شده</div>
            </div>
          </div>
        </div>

        {/* My Pharmacy Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">دواخانه من</h3>
            <Link href="/users" className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              مدیریت کاربران <ChevronsLeft className="w-4 h-4 mr-1" />
            </Link>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pl-4 border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.suppliers.toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-500">تعداد عرضه کنندگان</div>
            </div>
            <div className="flex-1 pr-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.users.toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-500">تعداد کاربران</div>
            </div>
          </div>
        </div>

        {/* Customers Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">مشتریان</h3>
            <Link href="/contacts/list" className="flex items-center text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#009688]">
              صفحه مشتریان <ChevronsLeft className="w-4 h-4 mr-1" />
            </Link>
          </div>
          <div className="flex p-6">
            <div className="flex-1 pl-4 border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.customers}</div>
              <div className="text-sm text-gray-500">تعداد مشتریان</div>
            </div>
            <div className="flex-1 pr-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">---</div>
              <div className="text-sm text-gray-500">اقلام پرفروش</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  iconColor,
  borderColor,
  bgButton,
  textButton,
  title,
  value,
  subtitle,
  buttonText,
  variant,
  href
}) {
  const borderColors = {
    green: 'border-t-[#4caf50]',
    yellow: 'border-t-[#ffc107]',
    blue: 'border-t-[#2196f3]',
    red: 'border-t-[#f44336]'
  };

  const buttonBgs = {
    green: 'bg-[#4caf50]/20 hover:bg-[#4caf50]/30 text-[#4caf50]',
    yellow: 'bg-[#ffc107]/20 hover:bg-[#ffc107]/30 text-[#ff8f00]', // Adjusted text for contrast
    blue: 'bg-[#2196f3]/20 hover:bg-[#2196f3]/30 text-[#2196f3]',
    red: 'bg-[#f44336]/20 hover:bg-[#f44336]/30 text-[#f44336]'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm pt-6 flex flex-col items-center border border-gray-100 ${borderColors[variant]} border-t-4`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${variant === 'green' ? 'text-[#4caf50] border-2 border-[#4caf50]' : ''} ${variant === 'yellow' ? 'text-[#ffc107] border-2 border-[#ffc107]' : ''} ${variant === 'blue' ? 'text-[#2196f3] border-2 border-[#2196f3]' : ''} ${variant === 'red' ? 'text-[#f44336] border-2 border-[#f44336]' : ''} bg-white`}>
        <Icon className="w-6 h-6 stroke-2" />
      </div>

      {title && <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>}
      {value !== undefined && <h3 className="text-xl font-bold text-gray-800 mb-1" dir="ltr">{value}</h3>}

      <p className="text-sm font-medium text-gray-600 mb-6">{subtitle}</p>

      {href ? (
        <Link href={href} className={`w-full py-2.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${buttonBgs[variant]} rounded-b-lg mt-auto`}>
          {buttonText} <ChevronsLeft className="w-4 h-4" />
        </Link>
      ) : (
        <button className={`w-full py-2.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${buttonBgs[variant]} rounded-b-lg mt-auto`}>
          {buttonText} <ChevronsLeft className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
