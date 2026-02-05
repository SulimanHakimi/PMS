'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    ClipboardList,
    BarChart3,
    Settings,
    Users,
    Bell,
    MessageSquare,
    Shield,
    HelpCircle,
    ChevronDown,
    ChevronLeft,
    MoreVertical,
    ShoppingCart
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'دشبورد', icon: LayoutDashboard, href: '/' },
    {
        name: 'گدام',
        icon: ClipboardList,
        href: '#',
        submenu: [
            { name: 'لیست دواها', href: '/inventory/medicines' },
            { name: 'گروپ های دوایی', href: '/inventory/groups' },
            { name: 'عرضه کنندگان', href: '/inventory/suppliers' }
        ]
    },
    {
        name: 'فروشات',
        icon: ShoppingCart,
        href: '#',
        submenu: [
            { name: 'ثبت فروش جدید', href: '/sales/new' },
            { name: 'لیست فروشات', href: '/sales/list' }
        ]
    },
    {
        name: 'راپور ها',
        icon: BarChart3,
        href: '#',
        submenu: [
            { name: 'راپور فروشات', href: '/reports/sales' },
            { name: 'راپور پرداخت ها', href: '/reports/payments' }
        ]
    },
    { name: 'تنظیمات', icon: Settings, href: '/configuration' },
    { name: 'مدیریت تماس ها', icon: Users, href: '/contacts', submenu: [{ name: 'لیست تماس ها', href: '/contacts/list' }] },
    { name: 'نوتیفیکیشن ها', icon: Bell, href: '/notifications', badge: 1 },
    { name: 'چت با بازدیدکنندگان', icon: MessageSquare, href: '/chat' },
    { name: 'تنظیمات برنامه', icon: Settings, href: '/app-settings' },
    { name: 'کووید - ۱۹', icon: Shield, href: '/covid' },
    { name: 'کمک تخنیکی', icon: HelpCircle, href: '/help' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <aside className="fixed right-0 top-0 z-40 h-screen w-64 bg-[#1a1f37] text-white flex flex-col font-sans border-l border-white/10">

            {/* Profile Section */}
            <div className="px-4 py-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            {/* Placeholder for user image */}
                            <img src="https://media.licdn.com/dms/image/v2/D4E03AQH2jDaojHEPeA/profile-displayphoto-scale_400_400/B4EZt0fR1VJwAo-/0/1767185916706?e=2147483647&v=beta&t=SAkM3JwmVakGyS9AdpKxhZqMiGExd_9KHHrpX-yApP0" alt="User" className="w-full rounded-full h-full object-cover" />
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">سلیمان حکیمی</p>
                            <p className="text-xs text-yellow-400">ادمین عمومی</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isExpanded = expandedMenus[item.name];
                        const hasSubmenu = item.submenu && item.submenu.length > 0;

                        return (
                            <li key={item.name}>
                                <div
                                    className={`
                                        relative flex items-center px-6 py-3 cursor-pointer transition-colors
                                        ${isActive ? 'bg-[#009688] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                        ${isActive ? 'border-r-4 border-white' : 'border-r-4 border-transparent'}
                                    `}
                                    onClick={() => hasSubmenu ? toggleMenu(item.name) : null}
                                >
                                    {/* Link wrapper if no submenu */}
                                    {!hasSubmenu ? (
                                        <Link href={item.href} className="absolute inset-0" />
                                    ) : null}

                                    <item.icon className={`w-5 h-5 ml-3 ${isActive ? 'text-white' : ''}`} />
                                    <span className="flex-1 font-medium text-sm text-right">{item.name}</span>

                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                            {item.badge}
                                        </span>
                                    )}

                                    {hasSubmenu && (
                                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Submenu */}
                                {hasSubmenu && isExpanded && (
                                    <ul className="bg-black/20">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.href}
                                                    className="flex items-center pr-14 pl-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 text-right block"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 text-xs text-gray-500 border-t border-white/10 text-center">
                <p>قدرت گرفته از شین © ۲۰۲۶</p>
                <p className="mt-1 flex justify-center gap-1"><span dir="ltr">v 1.0.0</span> <span>نسخه</span></p>
            </div>
        </aside>
    );
}
