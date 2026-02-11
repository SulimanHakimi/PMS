import { OfflineQueue } from './offline-sync';

export async function invokeIPC(channel, data) {
    // List of actions that can be queued
    const mutationChannels = [
        'add-medicine', 'update-medicine', 'delete-medicine',
        'add-group', 'delete-group',
        'add-supplier', 'update-supplier', 'delete-supplier',
        'add-customer', 'create-invoice',
        'send-message', 'mark-chat-read'
    ];

    // 1. Try Electron IPC
    if (typeof window !== 'undefined' && window.require) {
        try {
            const { ipcRenderer } = window.require('electron');
            return await ipcRenderer.invoke(channel, data);
        } catch (e) {
            console.warn('Electron IPC failed, falling back to Web API:', e);
            // If Electron IPC fails, it might be due to backend issues, but we usually drift to web API or offline check
        }
    }

    // 2. Check Offline Status First (Browser Environment)
    if (typeof navigator !== 'undefined' && !navigator.onLine && mutationChannels.includes(channel)) {
        console.log(`Offline detected. Queueing action: ${channel}`);
        OfflineQueue.addToQueue(channel, data);

        // Return simulated success
        return {
            success: true,
            offline: true,
            warning: 'You are offline. Changes saved locally and will sync when online.'
        };
    }

    // 3. Web API (Next.js API Routes)
    try {
        const response = await fetch('/api/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: channel, data }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('IPC/API invocation failed:', error);

        // If fetch fails and we suspect network issue (and it's a mutation), queue it
        // Note: fetch throws on network error, so this catches it.
        if (typeof navigator !== 'undefined' && mutationChannels.includes(channel)) {
            console.log(`Network request failed. Queueing action: ${channel}`);
            OfflineQueue.addToQueue(channel, data);
            return {
                success: true,
                offline: true,
                warning: 'Network request failed. Changes saved locally and will sync when online.'
            };
        }

        return null; // Return null on failure usually
    }
}
