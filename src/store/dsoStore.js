// src/store/dsoStore.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDSOStore = defineStore('dsoStore', () => {
    const averageDSO = ref(0);
    const previousDSO = ref(0);
    const perCustomerDSO = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Use the same backend URL as other stores
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    console.log('DSO Store Backend URL:', backendUrl); // Debugging log

    // Fetch current DSO
    const fetchCurrentDSO = async (startDate, endDate) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${backendUrl}/dso/company-wide`, {
                params: { startDate, endDate },
            });
            if (response.data && typeof response.data.dso === 'number') {
                averageDSO.value = response.data.dso;
                console.log(`[${new Date().toLocaleTimeString()}] Fetched Current DSO:`, averageDSO.value);
            } else {
                console.warn('Invalid DSO data received for current period.');
                averageDSO.value = 0;
            }
        } catch (err) {
            console.error('Error fetching current DSO:', err);
            error.value = 'Failed to load current DSO data.';
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch previous DSO
    const fetchPreviousDSO = async (startDate, endDate) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${backendUrl}/dso/company-wide`, {
                params: { startDate, endDate },
            });
            if (response.data && typeof response.data.dso === 'number') {
                previousDSO.value = response.data.dso;
                console.log(`[${new Date().toLocaleTimeString()}] Fetched Previous DSO:`, previousDSO.value);
            } else {
                console.warn('Invalid DSO data received for previous period.');
                previousDSO.value = 0;
            }
        } catch (err) {
            console.error('Error fetching previous DSO:', err);
            error.value = 'Failed to load previous DSO data.';
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch per-customer DSO
    const fetchPerCustomerDSO = async (startDate, endDate) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${backendUrl}/dso/per-customer`, {
                params: { startDate, endDate },
            });
            if (Array.isArray(response.data)) {
                perCustomerDSO.value = response.data.slice(0, 5); // Top 5 customers
                console.log(`[${new Date().toLocaleTimeString()}] Fetched Per-Customer DSO:`, perCustomerDSO.value);
            } else {
                console.warn('Invalid per-customer DSO data received.');
                perCustomerDSO.value = [];
            }
        } catch (err) {
            console.error('Error fetching per-customer DSO:', err);
            error.value = 'Failed to load per-customer DSO data.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        averageDSO,
        previousDSO,
        perCustomerDSO,
        isLoading,
        error,
        fetchCurrentDSO,
        fetchPreviousDSO,
        fetchPerCustomerDSO,
    };
});
