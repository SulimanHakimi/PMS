'use client';

import GroupsClient from './GroupsClient';
import { invokeIPC } from '@/lib/ipc';
import { useEffect, useState } from 'react';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        const data = await invokeIPC('get-groups');
        if (data) setGroups(data);
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return <GroupsClient groups={groups} onGroupAdded={fetchGroups} />;
}
