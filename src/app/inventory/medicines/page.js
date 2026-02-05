'use client';

import MedicinesClient from './MedicinesClient';
import { invokeIPC } from '@/lib/ipc';
import { useEffect, useState } from 'react';

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        const fetchMedicines = async () => {
            const data = await invokeIPC('get-medicines');
            if (data) setMedicines(data);
        };
        fetchMedicines();
    }, []);

    return <MedicinesClient medicines={medicines} />;
}
