// src/store/balanceSheetStore.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBalanceSheetStore = defineStore('balanceSheetStore', () => {
    const balanceSheet = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch balance sheet data from backend
    const fetchBalanceSheet = async (date) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get('http://localhost:3000/balance-sheet', {
                params: { date },
            });

            if (response.data && Array.isArray(response.data.value)) {
                balanceSheet.value = response.data.value;
                console.log(`[${new Date().toLocaleTimeString()}] Fetched balance sheet data:`, balanceSheet.value);
            } else {
                console.warn('Unexpected balance sheet data format:', response.data);
                balanceSheet.value = [];
            }

        } catch (err) {
            console.error('Error fetching balance sheet:', err);
            error.value = 'Failed to load balance sheet data.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        balanceSheet,
        isLoading,
        error,
        fetchBalanceSheet,
    };
});
