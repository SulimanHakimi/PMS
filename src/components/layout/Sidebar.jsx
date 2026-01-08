import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Users, Settings, Pill } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                    <Pill className="h-8 w-8 text-primary-400 mr-3" />
                    <span className="text-xl font-bold font-heading tracking-tight text-white">
                        Pharma<span className="text-primary-400">Care</span>
                    </span>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="flex items-center rounded-lg px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                    <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User Profile (Visual only) */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                            SH
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Dr. Hakimi</p>
                            <p className="text-xs text-slate-400">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
