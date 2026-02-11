'use client';

import { useState } from 'react';
import {
    HelpCircle,
    Phone,
    MessageCircle,
    Mail,
    ExternalLink,
    Video,
    BookOpen,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Cpu,
    Wifi
} from 'lucide-react';

export default function Help() {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: 'چگونه می‌توانم از اطلاعات سیستم پشتیبان تهیه کنم؟',
            answer: 'شما می‌توانید به بخش "تنظیمات" و سپس به تب "مدیریت داده‌ها" بروید. در آنجا روی دکمه "دانلود فایل پشتیبان" کلیک کنید تا تمام اطلاعات شما در قالب یک فایل JSON ذخیره شود.'
        },
        {
            question: 'اگر موجودی یک دوا اشتباه وارد شده باشد، چگونه آن را اصلاح کنم؟',
            answer: 'در بخش "گدام" و سپس "لیست دواها"، دوای مورد نظر را جستجو کنید. روی دکمه ویرایش (آیکون قلم) کلیک کرده و مقدار موجودی را در فیلد "تعداد موجود" اصلاح نمایید.'
        },
        {
            question: 'آیا سیستم بدون انترنت کار می‌کند؟',
            answer: 'بله، این نرم‌افزار به گونه‌ای طراحی شده که تمام عملیات خرید و فروش را به صورت محلی انجام می‌دهد. اطلاعات شما در دیتابیس داخلی ذخیره شده و نیازی به اتصال دایمی انترنت نیست.'
        },
        {
            question: 'چگونه می‌توانم فکتورهای قبلی را مشاهده یا دوباره چاپ کنم؟',
            answer: 'به بخش "فروشات" و سپس "لیست فروشات" بروید. در آنجا می‌توانید لیست تمام فکتورهای صادر شده را مشاهده کنید و با کلیک روی هر کدام، جزئیات آن را دیده یا دوباره چاپ نمایید.'
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="p-8 font-sans max-w-6xl mx-auto" dir="rtl">
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 mb-4">
                    <HelpCircle className="w-10 h-10 text-teal-600 border-2 border-teal-500 rounded-full p-2" />
                </div>
                <h1 className="text-3xl font-black text-gray-800">مرکز کمک تخنیکی</h1>
                <p className="text-gray-500 mt-2 text-lg">چگونه می‌توانیم به شما کمک کنیم؟</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Contact Methods */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-teal-600" />
                        راه‌های ارتباطی
                    </h2>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">تماس مستقیم</p>
                                <p className="text-lg font-black text-gray-800" dir="ltr">+93 78 866 5544</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-gray-50 hover:bg-teal-50 text-teal-700 rounded-xl font-bold text-sm transition-colors border border-transparent hover:border-teal-100 flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            پیام در واتس‌اپ
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">ایمیل پشتیبانی</p>
                                <p className="text-sm font-bold text-gray-800">support@sheenpharma.com</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            پاسخگویی به ایمیل‌ها معمولاً در کمتر از ۲۴ ساعت انجام می‌شود.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Video className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            کمک از راه دور
                        </h3>
                        <p className="text-sm text-teal-50 mb-6 leading-relaxed">
                            برای حل مشکلات پیچیده، ما می‌توانیم از طریق AnyDesk یا TeamViewer به سیستم شما متصل شویم.
                        </p>
                        <button className="w-full py-3 bg-white text-teal-700 rounded-xl font-bold text-sm shadow-sm hover:bg-teal-50 transition-colors">
                            درخواست ریموت
                        </button>
                    </div>
                </div>

                {/* Right Column: FAQs & Guides */}
                <div className="lg:col-span-2 space-y-8">
                    {/* FAQ Items */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-teal-600" />
                            سوالات متداول (FAQ)
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all"
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-bold text-gray-700">{faq.question}</span>
                                        {openFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-teal-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 py-4 bg-teal-50/30 text-gray-600 text-sm leading-relaxed border-t border-teal-50 animate-in slide-in-from-top-2">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Status Section */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">وضعیت سلامت سیستم</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-teal-100 transition-all">
                                <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold mb-1 uppercase">امنیت</span>
                                <span className="text-sm font-black text-gray-800">فعال / مصون</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-teal-100 transition-all">
                                <Cpu className="w-8 h-8 text-blue-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold mb-1 uppercase">دیتابیس</span>
                                <span className="text-sm font-black text-gray-800">متصل (Local)</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-teal-100 transition-all">
                                <Wifi className="w-8 h-8 text-teal-500 mb-2" />
                                <span className="text-xs text-gray-500 font-bold mb-1 uppercase">انترنت برخط</span>
                                <span className="text-sm font-black text-gray-800">{typeof window !== 'undefined' && navigator.onLine ? 'وصل است' : 'قطع است'}</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                تمام حقوق محفوظ است برای شین فارما © ۲۰۲۶. نسخه نرم‌افزار ۱.۰.۰
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
