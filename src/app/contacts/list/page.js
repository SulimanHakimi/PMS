'use client';

import { Users } from 'lucide-react';

export default function ContactList() {
    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">لیست تماس ها</h1>
            <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100  mb-4">
                    <Users className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">مدیریت تماس ها</h2>
                <p className="text-gray-500 mt-2">مشاهده و مدیریت عرضه کنندگان، مشتریان و تماس های کاربران در اینجا.</p>
            </div>
        </div>
    );
}
