'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, Save, ChevronDown, User, Stethoscope } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter } from 'next/navigation';

export default function NewSalePage() {
    const router = useRouter();
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [cart, setCart] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
    const [doctorName, setDoctorName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const fetchMedicines = async () => {
            const data = await invokeIPC('get-medicines');
            if (data) setMedicines(data);
        };
        fetchMedicines();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filtered = medicines.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.medicineId.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        setSearchResults(filtered);
    };

    const addToCart = (medicine) => {
        const existing = cart.find(item => item.medicineId === medicine.medicineId);
        if (existing) {
            setCart(cart.map(item =>
                item.medicineId === medicine.medicineId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                medicineId: medicine.medicineId,
                name: medicine.name,
                quantity: 1,
                unitPrice: medicine.sellPrice || 0,
                instructions: medicine.description || '', // Default instructions from medicine description
            }]);
        }
        setSearchQuery('');
        setSearchResults([]);
        searchInputRef.current?.focus();
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.medicineId !== id));
    };

    const updateQuantity = (id, qty) => {
        if (qty < 1) return;
        setCart(cart.map(item => item.medicineId === id ? { ...item, quantity: qty } : item));
    };

    const updateInstructions = (id, text) => {
        setCart(cart.map(item => item.medicineId === id ? { ...item, instructions: text } : item));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() - discount;
    };

    const handleSubmit = async () => {
        if (cart.length === 0) {
            alert('لطفا دواها را به لست اضافه کنید.');
            return;
        }
        if (!customerInfo.name || !doctorName) {
            alert('لطفا نام مشتری و داکتر را وارد کنید.');
            return;
        }

        setLoading(true);
        const invoiceData = {
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            doctorName: doctorName,
            items: cart.map(item => ({
                ...item,
                totalPrice: item.unitPrice * item.quantity
            })),
            subTotal: calculateSubtotal(),
            discount: Number(discount),
            totalAmount: calculateTotal(),
        };

        const result = await invokeIPC('create-invoice', invoiceData);
        setLoading(false);

        if (result && result.success) {
            if (confirm('فروش با موفقیت ثبت شد. آیا میخواهید فکتور را چاپ کنید؟')) {
                router.push(`/sales/invoice/${result.invoice._id}`);
            } else {
                router.push('/sales/list');
            }
        } else {
            alert('خطا در ثبت فروش: ' + (result?.error || 'Unknown error'));
        }
    };

    return (
        <div className="p-8 font-sans" dir="rtl">
            {/* Header */}
            <div className="mb-8 text-right">
                <h1 className="text-2xl font-bold text-gray-800 flex flex-row items-center gap-2">
                    فروشات <span className="text-gray-400">›</span> ثبت فروش جدید (نسخه)
                </h1>
                <p className="text-gray-500 text-sm mt-1">ثبت فروش دوا و چاپ فکتور</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Input & Cart (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer & Doctor Info */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm grid grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">نام مشتری</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full h-11 pr-10 pl-4 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                                    placeholder="نام کامل مشتری"
                                />
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">نام داکتر</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    className="w-full h-11 pr-10 pl-4 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                                    placeholder="نام داکتر معالج"
                                />
                                <Stethoscope className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">شماره تماس (اختیاری)</label>
                            <input
                                type="text"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-right"
                                placeholder="07xx xxx xxx"
                            />
                        </div>
                    </div>

                    {/* Medicine Search */}
                    <div className="relative">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full h-12 pr-12 pl-4 bg-white border-2 border-teal-500 rounded-lg text-sm focus:outline-none shadow-sm text-right font-medium"
                                placeholder="جستجوی دوا (نام یا آیدی) ..."
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                {searchResults.map(medicine => (
                                    <div
                                        key={medicine._id}
                                        onClick={() => addToCart(medicine)}
                                        className="px-4 py-3 hover:bg-teal-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-b-0"
                                    >
                                        <div className="text-left">
                                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">{medicine.sellPrice} افغانی</span>
                                            <span className="mr-3 text-xs text-gray-400">موجودی: {medicine.stock}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-gray-800">{medicine.name}</div>
                                            <div className="text-xs text-gray-500">{medicine.medicineId} • {medicine.group}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-right border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600">نام دوا</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600 w-24">تعداد</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600 w-32">قیمت واحد</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600">طریقه استفاده</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600 w-32">مجموع</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-600 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center text-gray-400 text-sm">
                                            هیچ دوایی انتخاب نشده است. لطفاً از کادر بالا جستجو کنید.
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((item, index) => (
                                        <tr key={item.medicineId} className="border-b border-gray-100 hover:bg-gray-50/50">
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-bold text-gray-800">{item.name}</div>
                                                <div className="text-[10px] text-gray-400">{item.medicineId}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.medicineId, Number(e.target.value))}
                                                    className="w-16 h-8 border border-gray-200 rounded px-2 text-center text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                    min="1"
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {item.unitPrice} <span className="text-[10px]">افغانی</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={item.instructions}
                                                    onChange={(e) => updateInstructions(item.medicineId, e.target.value)}
                                                    className="w-full h-8 border border-gray-200 rounded px-2 text-right text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                    placeholder="مثلاً: صبح و شب بعد از غذا"
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-teal-600">
                                                {item.unitPrice * item.quantity} <span className="text-[10px]">افغانی</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => removeFromCart(item.medicineId)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Summary & Checkout (1 column) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">خلاصه فکتور</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">مجموع دواها</span>
                                <span className="font-bold text-gray-800">{calculateSubtotal()} افغانی</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">تخفیف (افغانی)</span>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    className="w-24 h-8 border border-gray-200 rounded px-2 text-left text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    min="0"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">قابل پرداخت</span>
                                <span className="text-2xl font-black text-teal-600">{calculateTotal()} <span className="text-xs">افغانی</span></span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || cart.length === 0}
                                className="w-full bg-[#009688] hover:bg-[#00796b] text-white py-4 rounded-lg font-bold shadow-lg shadow-teal-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'در حال ثبت...' : 'ثبت فروش و تولید فکتور'}
                            </button>

                            <p className="text-[10px] text-center text-gray-400">
                                با کلیک بر روی دکمه بالا، موجودی دواخانه آپدیت شده و فکتور ایجاد میگردد.
                            </p>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-right">
                        <h4 className="text-xs font-bold text-teal-800 mb-2">راهنمای سریع:</h4>
                        <ul className="text-[10px] text-teal-700 space-y-1 list-disc list-inside">
                            <li>برای جستجو نام یا آیدی دوا را تایپ کنید.</li>
                            <li>تعداد دوا را میتوانید به صورت دستی تغییر دهید.</li>
                            <li>طریقه استفاده در فکتور نهایی چاپ خواهد شد.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
