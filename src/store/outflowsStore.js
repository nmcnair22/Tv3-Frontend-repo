// src/store/outflowsStore.js

import axios from 'axios';
import { defineStore } from 'pinia';

export const useOutflowsStore = defineStore('outflowsStore', {
    state: () => ({
        outflowsData: null,
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchOutflowsData(startDate, endDate) {
            this.isLoading = true;
            this.error = null;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(`${backendUrl}/financial-dashboard/outflows`, {
                    params: { startDate, endDate },
                });
                this.outflowsData = response.data;
            } catch (err) {
                console.error('Error fetching outflows data:', err);
                this.error = 'Failed to load outflows data.';
            } finally {
                this.isLoading = false;
            }
        },
    },
});