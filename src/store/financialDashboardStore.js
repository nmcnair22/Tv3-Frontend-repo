// src/store/financialDashboardStore.js

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFinancialDashboardStore = defineStore('financialDashboardStore', () => {
    const inflowsData = ref({});
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
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(`${backendUrl}/financial-dashboard/inflows`, {
                params: { startDate, endDate },
            });

            if (response.data) {
                inflowsData.value = response.data;
                console.log('Fetched inflowsData:', inflowsData.value); // Add this line
            } else {
                inflowsData.value = {};
                console.error('Response data is empty or undefined:', response);
                error.value = 'No data received from the server.';
            }
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