// src/store/cashAnalysisStore.js

import axios from 'axios';
import { defineStore } from 'pinia';

export const useCashAnalysisStore = defineStore('cashAnalysisStore', {
    state: () => ({
        cashAnalysisData: null,
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchCashAnalysis(startDate, endDate, growthRate) {
            this.isLoading = true;
            this.error = null;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(`${backendUrl}/financial-dashboard/cash-analysis`, {
                    params: { startDate, endDate, growthRate },
                });
                this.cashAnalysisData = response.data;
            } catch (err) {
                console.error('Error fetching cash analysis:', err);
                this.error = 'Failed to load cash analysis data.';
            } finally {
                this.isLoading = false;
            }
        },
    },
});