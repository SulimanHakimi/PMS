import { Search, Bell } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-xl px-6 transition-all">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-white">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        className="h-10 w-64 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
                    />
                </div>

                <button className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
