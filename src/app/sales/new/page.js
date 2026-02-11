'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, Save, ChevronDown, User, Stethoscope, ShoppingCart, Info, Phone, Receipt, CreditCard, Minus } from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function NewSalePage() {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const user = authUser || { username: 'admin' };
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
                instructions: medicine.description || '',
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
            createdBy: user?.username || 'admin',
        };

        const result = await invokeIPC('create-invoice', invoiceData);
        setLoading(false);

        if (result && result.success) {
            router.push('/sales/list');
        } else {
            alert('خطا در ثبت فروش: ' + (result?.error || 'Unknown error'));
        }
    };

    return (
        <div className="p-4 md:p-8 font-sans max-w-[1700px] mx-auto" dir="rtl">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 md:mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-black text-teal-600 uppercase tracking-widest">
                        <Receipt className="w-4 h-4" /> سیستم فروشات و صدور فاکتور
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        ثبت فروش جدید محصول <span className="text-gray-300 font-normal mr-2">/ نسخه داکتر</span>
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">پایانه فروش متصل به انبارداری مرکزی جهت ثبت آنی تراکنش‌ها و چاپ رسید مشتری.</p>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs uppercase">
                            {user.username.charAt(0)}
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-tighter">Current Cashier</span>
                            <span className="block text-xs font-black text-gray-800">{user.username}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Billing Section (3/4) */}
                <div className="xl:col-span-3 space-y-8">

                    {/* Customer & Doctor Profile Card */}
                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-50 transition-colors duration-500"></div>

                        <div className="space-y-3 relative z-10">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">هویت بیمار / مشتری <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full h-14 pr-12 pl-6 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all"
                                    placeholder="نام کامل بیمار..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">داکتر معالج <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Stethoscope className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    className="w-full h-14 pr-12 pl-6 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all"
                                    placeholder="نام داکتر..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">تلفن تماس (اختیاری)</label>
                            <div className="relative">
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    className="w-full h-14 pr-12 pl-6 bg-gray-50 border border-transparent rounded-2xl text-sm font-black font-sans focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 text-right transition-all"
                                    placeholder="07XX XXX XXX"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Smart Search Bar */}
                    <div className="relative">
                        <div className="relative group">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full h-16 md:h-20 pr-16 pl-6 bg-white border-2 border-teal-500 rounded-[2rem] text-base md:text-xl font-black focus:outline-none shadow-2xl shadow-teal-500/20 text-right transition-all placeholder:text-gray-300"
                                placeholder="جستجوی هوشمند کالا (نام، برند یا بارکد) ..."
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/40 transition-transform group-focus-within:scale-110">
                                <Search className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Enhanced Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-4 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="p-4 bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest px-8">نتایج جستجو (بر اساس موجودی گدام)</div>
                                {searchResults.map(medicine => (
                                    <div
                                        key={medicine._id}
                                        onClick={() => addToCart(medicine)}
                                        className="px-8 py-5 hover:bg-teal-50/50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-b-0 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-black text-gray-800 group-hover:text-teal-600 transition-colors">{medicine.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold tracking-tight">{medicine.medicineId} • {medicine.group}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-xs font-black text-teal-600 font-sans">{medicine.sellPrice.toLocaleString()} <small className="text-[10px] opacity-60">AFN</small></span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${medicine.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Stock: {medicine.stock}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-teal-500 group-hover:text-white transition-all">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Basket */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <h3 className="text-base font-black text-gray-800 flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-teal-600" /> لیست اقلام نسخه
                            </h3>
                            <div className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                {cart.length} items in cart
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/10 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <th className="py-5 px-8">مشخصات کالا</th>
                                        <th className="py-5 px-8 text-center w-32">تعداد (QTY)</th>
                                        <th className="py-5 px-8 text-center">قیمت واحد</th>
                                        <th className="py-5 px-8">دستورات مصرف</th>
                                        <th className="py-5 px-8 text-center">جمع کل (AFN)</th>
                                        <th className="py-5 px-8 text-left w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cart.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-32 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-20">
                                                    <ShoppingCart className="w-20 h-20 mb-4" />
                                                    <p className="text-sm font-black uppercase tracking-[0.2em]">The basket is empty</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        cart.map((item) => (
                                            <tr key={item.medicineId} className="group hover:bg-teal-50/10 transition-all duration-300">
                                                <td className="py-6 px-8">
                                                    <div className="text-sm font-black text-gray-800">{item.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {item.medicineId}</div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                                                            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.medicineId, Number(e.target.value))}
                                                            className="w-12 h-10 bg-transparent text-center text-sm font-black font-sans focus:outline-none"
                                                            min="1"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-center font-sans font-black text-gray-600 text-xs">
                                                    {item.unitPrice.toLocaleString()}
                                                </td>
                                                <td className="py-6 px-8">
                                                    <input
                                                        type="text"
                                                        value={item.instructions}
                                                        onChange={(e) => updateInstructions(item.medicineId, e.target.value)}
                                                        className="w-full h-10 px-4 bg-gray-50 border border-transparent rounded-xl text-xs font-medium focus:bg-white focus:ring-1 focus:ring-teal-500/20 text-right transition-all"
                                                        placeholder="طریقه استفاده..."
                                                    />
                                                </td>
                                                <td className="py-6 px-8 text-center">
                                                    <span className="text-sm font-black text-teal-600 font-sans">
                                                        {(item.unitPrice * item.quantity).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-8 text-left">
                                                    <button
                                                        onClick={() => removeFromCart(item.medicineId)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
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
                </div>

                {/* Checkout Summary (1/4) */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl shadow-gray-400/30 sticky top-8">
                        <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-teal-400">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-black">تسویه و پرداخت نهایی</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">مجموع ناخالص</span>
                                <span className="text-base font-black font-sans">{calculateSubtotal().toLocaleString()} <small className="text-[10px] opacity-40">AFN</small></span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">تخفیف ویژه</span>
                                    <span className="text-xs font-black text-teal-500 font-sans">-{discount.toLocaleString()}</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-full h-12 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:outline-none focus:border-teal-500/50 transition-all font-sans"
                                        min="0"
                                        placeholder="0"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500">DISCOUNT</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 space-y-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block text-center mb-2">Total Amount Payable</span>
                                <div className="text-6xl font-black text-center text-teal-400 font-sans tracking-tight mb-2">
                                    {calculateTotal().toLocaleString()}
                                </div>
                                <div className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest tracking-widest">Afghani (Local Currency)</div>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || cart.length === 0}
                                    className="w-full h-16 bg-teal-500 hover:bg-teal-400 text-gray-900 rounded-[1.5rem] font-black text-base shadow-[0_20px_40px_-10px_rgba(20,184,166,0.3)] active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden group"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            <span>ثبت و صدور فاکتور</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Order Safety Tip */}
                        <div className="mt-10 p-5 bg-white/5 rounded-[2rem] border border-white/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Info className="w-4 h-4 text-gray-500" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">دستورالعمل امنیتی</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                لطفا قبل از تایید نهایی، تعداد داروهای انتخاب شده و دستورات داکتر را مجددا با نسخه فیزیکی تطبیق دهید. پس از صدور، کاهش موجودی به صورت سیستمی اعمال خواهد شد.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

