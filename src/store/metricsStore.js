import axios from 'axios';
import { defineStore } from 'pinia';

export const useMetricsStore = defineStore('metrics', {
    state: () => ({
        metrics: [],
    }),
    actions: {
        async fetchMetrics() {
            try {
                const response = await axios.get('/api/metrics');
                this.metrics = response.data.metrics;
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        },
    },
});
