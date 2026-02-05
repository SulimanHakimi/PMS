'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { invokeIPC } from '@/lib/ipc';
import { Lock, User, UserPlus, LogIn, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const channel = isLogin ? 'login' : 'create-user';
            const result = await invokeIPC(channel, formData);

            if (result === null) {
                setError('دسترسی به سرور برقرار نشد. لطفا برنامه را مجددا اجرا کنید.');
                setLoading(false);
                return;
            }

            if (result && result.success) {
                // Update auth state
                login(result.user);
                router.push('/');
            } else {
                setError(result?.error || (isLogin ? 'نام کاربری یا رمز عبور اشتباه است' : 'خطا در ایجاد حساب'));
            }
        } catch (err) {
            setError('خطای سیستمی: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md px-6 font-sans">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 text-center bg-[#1a1f37] text-white">
                    <div className="inline-flex items-center justify-center mb-4 rounded-full bg-transparent ">
                        <img src="https://agency.sheen.af/logo.png" alt="sheen" className="w-28 h-28 rounded-full" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading mb-1">شین فارما</h1>
                    <p className="text-gray-400 text-xs">سیستم مدیریت دواخانه</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
                        {isLogin ? 'ورود به سیستم' : 'ایجاد حساب جدید'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نام کاربری</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full h-11 pr-10 pl-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-right text-sm"
                                    placeholder="نام کاربری خود را وارد کنید"
                                    required
                                />
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رمز عبور</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-11 pr-10 pl-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-right text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? 'لطفا صبر کنید...' : (
                                <>
                                    {isLogin ? 'ورود' : 'ثبت نام'}
                                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ username: '', password: '' });
                            }}
                            className="text-sm text-gray-500 hover: transition-colors"
                        >
                            {isLogin ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'حساب دارید؟ وارد شوید'}
                        </button>
                    </div>
                </div>
            </div>
            <p className="mt-6 text-center text-xs text-gray-400">قدرت گرفته از شین فارما © ۲۰۲۶</p>
        </div>
    );
}
