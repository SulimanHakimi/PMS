'use client';

import { HelpCircle } from 'lucide-react';

export default function Help() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Technical Help</h1>
            <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">Need Assistance?</h2>
                <p className="text-gray-500 mt-2">Contact our support team for technical issues or browse the FAQs.</p>
            </div>
        </div>
    );
}
