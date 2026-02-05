'use client';

import AddMedicineForm from './AddMedicineForm';
import { invokeIPC } from '@/lib/ipc';
import { useEffect, useState } from 'react';

export default function AddMedicinePage() {
    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [groupsData, suppliersData] = await Promise.all([
                invokeIPC('get-groups'),
                invokeIPC('get-suppliers')
            ]);
            if (groupsData) setGroups(groupsData);
            if (suppliersData) setSuppliers(suppliersData);
        };
        fetchData();
    }, []);

    return <AddMedicineForm groups={groups} suppliers={suppliers} />;
}
