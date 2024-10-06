// src/store/cashFlowStore.js

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCashFlowStore = defineStore('cashFlowStore', () => {
    // State
    const currentCashFlow = ref(0);
    const inflowByMonth = ref([]);
    const outflowByMonth = ref([]);
    const months = ref([]);

    const isLoading = ref(false);
    const error = ref(null);

    // Actions
    const fetchCashFlowStatements = async (startDate, endDate) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get('http://localhost:3000/cash-flow-statements', {
                params: { startDate, endDate },
            });

            const data = response.data;

            currentCashFlow.value = data.currentCashFlow || 0;
            inflowByMonth.value = data.inflowByMonth || [];
            outflowByMonth.value = data.outflowByMonth || [];
            months.value = data.months || [];
        } catch (err) {
            console.error('Error fetching cash flow statements:', err);
            error.value = 'Failed to load cash flow data.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // State
        currentCashFlow,
        inflowByMonth,
        outflowByMonth,
        months,
        isLoading,
        error,
        // Actions
        fetchCashFlowStatements,
    };
});
