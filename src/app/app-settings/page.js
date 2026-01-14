'use client';

import { Settings } from 'lucide-react';

export default function AppSettings() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Settings</h1>
            <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                    <Settings className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">App Preferences</h2>
                <p className="text-gray-500 mt-2">Customize the application behavior, themes, and other global settings.</p>
            </div>
        </div>
    );
}
