export class OfflineQueue {
    static STORAGE_KEY = 'PMS_OFFLINE_QUEUE';

    static getQueue() {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to parse offline queue', e);
            return [];
        }
    }

    static addToQueue(channel, data) {
        const queue = this.getQueue();
        const action = {
            id: Date.now().toString(),
            channel,
            data,
            timestamp: Date.now()
        };
        queue.push(action);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
        return action;
    }

    static removeFromQueue(id) {
        let queue = this.getQueue();
        queue = queue.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
    }

    static clearQueue() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
