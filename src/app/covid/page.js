'use client';

import { Shield } from 'lucide-react';

export default function CovidDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Covid-19 Dashboard</h1>
            <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100  mb-4">
                    <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">Covid-19 Updates</h2>
                <p className="text-gray-500 mt-2">Track the latest statistics and safety guidelines.</p>
            </div>
        </div>
    );
}
