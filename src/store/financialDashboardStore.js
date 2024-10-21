import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFinancialDashboardStore = defineStore('financialDashboardStore', () => {
    const inflowsData = ref({});
    const dsoCurrent = ref(0);
    const dsoPrevious = ref(0);
    const dsoYTD = ref(0);
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
                console.log('Fetched inflowsData:', inflowsData.value);
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

    /**
     * Fetches DSO from the backend for a specified period.
     * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
     * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
     * @param {string} type - The period type ('current', 'previous', 'ytd').
     */
    async function fetchDSO(startDate, endDate, type) {
        isLoading.value = true;
        error.value = null;

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(`${backendUrl}/financial-dashboard/dso`, {
                params: { startDate, endDate },
            });

            if (response.data && response.data.dso !== undefined) {
                if (type === 'current') dsoCurrent.value = parseFloat(response.data.dso);
                else if (type === 'previous') dsoPrevious.value = parseFloat(response.data.dso);
                else if (type === 'ytd') dsoYTD.value = parseFloat(response.data.dso);
            } else {
                error.value = 'No DSO data received from the server.';
            }
        } catch (err) {
            error.value = `Failed to fetch DSO for ${type} period`;
            console.error(`Error fetching DSO for ${type} period:`, err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        inflowsData,
        fetchInflowsData,
        dsoCurrent,
        dsoPrevious,
        dsoYTD,
        fetchDSO,
        isLoading,
        error,
    };
});
