'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, User, Plus, Trash2, Database, Upload, Download } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';

export default function Configuration() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // general, users, data
    const [settings, setSettings] = useState({
        pharmacyName: '',
        address: '',
        phone: '',
        email: '',
        currency: 'AFN',
        taxRate: 0,
        receiptFooter: ''
    });
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'pharmacist' });

    useEffect(() => {
        fetchSettings();
        fetchUsers();
    }, []);

    const fetchSettings = async () => {
        const data = await invokeIPC('get-settings');
        if (data) setSettings(data);
    };

    const fetchUsers = async () => {
        const data = await invokeIPC('get-users');
        if (data) setUsers(data);
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        const result = await invokeIPC('update-settings', settings);
        setLoading(false);
        if (result && result.success) {
            alert('تنظیمات با موفقیت ذخیره شد.');
        } else {
            alert('خطا در ذخیره تنظیمات: ' + (result?.error || 'Unknown error'));
        }
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.password) {
            alert('لطفا نام کاربری و رمز عبور را وارد کنید.');
            return;
        }
        setLoading(true);
        const result = await invokeIPC('create-user', newUser);
        setLoading(false);
        if (result && result.success) {
            alert('کاربر جدید با موفقیت اضافه شد.');
            setNewUser({ username: '', password: '', role: 'pharmacist' });
            fetchUsers();
        } else {
            alert('خطا در افزودن کاربر: ' + (result?.error || 'Unknown error'));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
        const result = await invokeIPC('delete-user', userId);
        if (result && result.success) {
            fetchUsers();
        } else {
            alert('خطا در حذف کاربر: ' + (result?.error || 'Unknown error'));
        }
    };

    const handleBackup = async () => {
        setLoading(true);
        const result = await invokeIPC('backup-data');
        setLoading(false);
        if (result && result.success) {
            // Trigger download
            const blob = new Blob([result.data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pms-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('خطا در تهیه پشتیبان: ' + (result?.error || 'Unknown error'));
        }
    };

    return (
        <div className="p-8 font-sans h-full flex flex-col" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-teal-600" />
                    تنظیمات سیستم
                </h1>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'general' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    تنظیمات عمومی
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    مدیریت کاربران
                </button>
                <button
                    onClick={() => setActiveTab('data')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'data' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    مدیریت داده ها
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'general' && (
                    <div className="max-w-2xl bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام دواخانه</label>
                                <input
                                    type="text"
                                    value={settings.pharmacyName}
                                    onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                                <input
                                    type="text"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
                                <textarea
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">واحد پولی</label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                                >
                                    <option value="AFN">افغانی (AFN)</option>
                                    <option value="USD">دالر (USD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">متن پایین فکتور</label>
                                <input
                                    type="text"
                                    value={settings.receiptFooter}
                                    onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                disabled={loading}
                                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* List Users */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-right text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">نام کاربری</th>
                                        <th className="px-6 py-3">نقش</th>
                                        <th className="px-6 py-3 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td className="px-6 py-3 font-medium text-gray-800 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                </div>
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-3 text-gray-600">
                                                <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user.role === 'admin' ? 'ادمین' : 'کارمند'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add User Form */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-teal-600" />
                                افزودن کاربر جدید
                            </h3>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="نام کاربری"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="flex-1 h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                                <input
                                    type="password"
                                    placeholder="رمز عبور"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="flex-1 h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-32 h-10 px-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                                >
                                    <option value="pharmacist">کارمند</option>
                                    <option value="admin">ادمین</option>
                                </select>
                                <button
                                    onClick={handleAddUser}
                                    disabled={loading}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 h-10"
                                >
                                    افزودن
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-600" />
                            پشتیبانی و بازیابی داده ها
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            از اطلاعات سیستم خود به صورت منظم پشتیبان تهیه کنید تا در صورت بروز مشکل، بتوانید آن را بازیابی نمایید.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleBackup}
                                disabled={loading}
                                className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors shadow-sm"
                            >
                                <Download className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="font-bold text-sm">دانلود فایل پشتیبان</div>
                                    <div className="text-xs text-gray-400 mt-1">ذخیره تمام اطلاعات در قالب JSON</div>
                                </div>
                            </button>

                            <button
                                disabled={true}
                                className="border border-gray-200 bg-gray-50 text-gray-400 px-6 py-3 rounded-lg flex items-center gap-3 cursor-not-allowed"
                            >
                                <Upload className="w-5 h-5" />
                                <div>
                                    <div className="font-bold text-sm">بازیابی اطلاعات (بزودی)</div>
                                    <div className="text-xs text-gray-400 mt-1">بازگردانی اطلاعات از فایل پشتیبان</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
