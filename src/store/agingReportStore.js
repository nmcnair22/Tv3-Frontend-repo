// src/store/agingReportStore.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAgingReportStore = defineStore('agingReportStore', () => {
    const agingReport = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchAgingReport(asOfDate) {
        isLoading.value = true;
        error.value = null;
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(`${backendUrl}/financial-dashboard/aging-report`, {
                params: { asOfDate },
            });
            if (response.data) {
                agingReport.value = response.data;
            } else {
                agingReport.value = [];
                error.value = 'No data received from the server.';
            }
        } catch (err) {
            console.error('Error fetching aging report:', err);
            error.value = 'Failed to load aging report data.';
        } finally {
            isLoading.value = false;
        }
    }

    return {
        agingReport,
        isLoading,
        error,
        fetchAgingReport,
    };
});