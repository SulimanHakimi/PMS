'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useEffect, useState } from 'react';
import { OfflineQueue } from '@/lib/offline-sync';
import { invokeIPC } from '@/lib/ipc';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Close sidebar on route change (mobile)
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        // Redirection logic
        if (!loading) {
            if (!user && !isLoginPage) {
                router.push('/login');
            } else if (user && isLoginPage) {
                router.push('/');
            }
        }
    }, [user, loading, isLoginPage, router]);

    useEffect(() => {
        const syncOfflineActions = async () => {
            if (typeof navigator !== 'undefined' && navigator.onLine) {
                const queue = OfflineQueue.getQueue();
                if (queue.length > 0) {
                    console.log(`Syncing ${queue.length} offline actions...`);
                    for (const action of queue) {
                        try {
                            const result = await invokeIPC(action.channel, action.data);
                            if (result && result.success) {
                                OfflineQueue.removeFromQueue(action.id);
                            }
                        } catch (e) {
                            console.error('Error syncing action:', e);
                        }
                    }
                }
            }
        };

        window.addEventListener('online', syncOfflineActions);
        syncOfflineActions();
        return () => window.removeEventListener('online', syncOfflineActions);
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center font-sans">در حال بارگزاری...</div>;
    }

    if (isLoginPage) {
        return (
            <main className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
                {children}
            </main>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen flex bg-[#f8fafc]">
            {/* Sidebar with toggle state */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'mr-0' : 'lg:mr-64'}`}>
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
