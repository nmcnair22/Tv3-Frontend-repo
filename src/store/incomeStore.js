// src/store/incomeStore.js

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIncomeStore = defineStore('incomeStore', () => {
    // State
    const totalRevenue = ref(0);
    const totalExpenses = ref(0);
    const netProfit = ref(0);
    const revenueByMonth = ref([]);
    const expensesByMonth = ref([]);
    const expenseCategories = ref([]);
    const expenseByCategory = ref([]);
    const months = ref([]);

    const isLoading = ref(false);
    const error = ref(null);

    // Actions
    const fetchIncomeStatements = async (startDate, endDate) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get('http://localhost:3000/income-statements', {
                params: { startDate, endDate },
            });

            const data = response.data;

            totalRevenue.value = data.totalRevenue || 0;
            totalExpenses.value = data.totalExpenses || 0;
            netProfit.value = data.netProfit || 0;
            revenueByMonth.value = data.revenueByMonth || [];
            expensesByMonth.value = data.expensesByMonth || [];
            expenseCategories.value = data.expenseCategories || [];
            expenseByCategory.value = data.expenseByCategory || [];
            months.value = data.months || [];
        } catch (err) {
            console.error('Error fetching income statements:', err);
            error.value = 'Failed to load income data.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // State
        totalRevenue,
        totalExpenses,
        netProfit,
        revenueByMonth,
        expensesByMonth,
        expenseCategories,
        expenseByCategory,
        months,
        isLoading,
        error,
        // Actions
        fetchIncomeStatements,
    };
});
