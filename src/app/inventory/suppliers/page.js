'use client';

import { useEffect, useState } from 'react';
import { invokeIPC } from '@/lib/ipc';
import SuppliersClient from './SuppliersClient';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const data = await invokeIPC('get-suppliers');
            if (data) setSuppliers(data);
        };
        fetchSuppliers();
    }, []);

    return <SuppliersClient initialSuppliers={suppliers} />;
}
