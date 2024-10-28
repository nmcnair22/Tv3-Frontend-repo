// src/stores/prequalStore.js

import axios from 'axios';
import { defineStore } from 'pinia';

export const usePrequalStore = defineStore('prequal', {
    state: () => ({
        requests: [],
        queue: [],
        analytics: {},
        // Add more state properties as needed
    }),
    actions: {
        async submitPrequalRequest(requestData) {
            try {
                const response = await axios.post('/api/prequal/requests', requestData);
                this.requests.push(response.data);
                return response.data;
            } catch (error) {
                console.error('Error submitting Prequal request:', error);
                throw error;
            }
        },
        async fetchQueue() {
            try {
                const response = await axios.get('/api/prequal/queue');
                this.queue = response.data;
            } catch (error) {
                console.error('Error fetching Prequal queue:', error);
            }
        },
        // Add more actions as needed (e.g., fetchAnalytics, importData, exportData)
    },
});
