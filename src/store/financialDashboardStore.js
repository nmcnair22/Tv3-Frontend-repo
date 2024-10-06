// src/store/financialDashboardStore.ts

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFinancialDashboardStore = defineStore('financialDashboardStore', () => {
    const inflowsData = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    /**
     * Fetches inflows data from the financial service backend.
     * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
     * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
     */
    async function fetchInflowsData(startDate, endDate) {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get('http://localhost:3000/financial-dashboard/inflows', {
                params: { startDate, endDate },
            });
            inflowsData.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch inflows data';
            console.error('Error fetching inflows data:', err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        inflowsData,
        fetchInflowsData,
        isLoading,
        error,
    };
});
