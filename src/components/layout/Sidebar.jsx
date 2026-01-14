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
    ChevronRight,
    MoreVertical,
    ShoppingCart
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    {
        name: 'Inventory',
        icon: ClipboardList,
        href: '#',
        submenu: [
            { name: 'List of Medicines', href: '/inventory/medicines' },
            { name: 'Medicine Groups', href: '/inventory/groups' }
        ]
    },
    {
        name: 'Reports',
        icon: BarChart3,
        href: '#',
        submenu: [
            { name: 'Sales Report', href: '/reports/sales' },
            { name: 'Payments Report', href: '/reports/payments' }
        ]
    },
    { name: 'Configuration', icon: Settings, href: '/configuration' },
    { name: 'Contact Management', icon: Users, href: '/contacts', submenu: [{ name: 'Contact List', href: '/contacts/list' }] },
    { name: 'Notifications', icon: Bell, href: '/notifications', badge: 1 },
    { name: 'Chat with Visitors', icon: MessageSquare, href: '/chat' },
    { name: 'Application Settings', icon: Settings, href: '/app-settings' },
    { name: 'Covid -19', icon: Shield, href: '/covid' },
    { name: 'Get Technical Help', icon: HelpCircle, href: '/help' },
];

export default function Sidebar() {
    const pathname = usePathname();
    // Initialize with open menus if needed, or empty
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#1a1f37] text-white flex flex-col font-sans">
            {/* Logo Section */}
            <div className="flex items-center h-16 px-6 border-b border-white/10">
                <div className="relative flex items-center justify-center w-8 h-8 mr-3 rounded bg-transparent border-2 border-yellow-500 text-yellow-500">
                    <ShoppingCart className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full text-[6px] flex items-center justify-center">+</div>
                </div>
                <h1 className="text-xl font-bold font-heading">Pharma One</h1>
            </div>

            {/* Profile Section */}
            <div className="px-4 py-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200">
                            {/* Placeholder for user image */}
                            <img src="https://ui-avatars.com/api/?name=Subash&background=random" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Subash</p>
                            <p className="text-xs text-yellow-400">Super Admin</p>
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
                                        ${isActive ? 'border-l-4 border-white' : 'border-l-4 border-transparent'}
                                    `}
                                    onClick={() => hasSubmenu ? toggleMenu(item.name) : null}
                                >
                                    {/* Link wrapper if no submenu */}
                                    {!hasSubmenu ? (
                                        <Link href={item.href} className="absolute inset-0" />
                                    ) : null}

                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : ''}`} />
                                    <span className="flex-1 font-medium text-sm">{item.name}</span>

                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                                            {item.badge}
                                        </span>
                                    )}

                                    {hasSubmenu && (
                                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Submenu */}
                                {hasSubmenu && isExpanded && (
                                    <ul className="bg-black/20">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.href}
                                                    className="flex items-center pl-14 pr-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
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
            <div className="px-6 py-4 text-xs text-gray-500 border-t border-white/10">
                <p>Powered by Sheen © 2026</p>
                <p className="mt-1">v 1.0.0</p>
            </div>
        </aside>
    );
}
