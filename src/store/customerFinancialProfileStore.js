// src/store/customerFinancialProfileStore.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCustomerFinancialProfileStore = defineStore('customerFinancialProfile', () => {
    const customerData = ref(null);
    const creditScoreHistory = ref([]);
    const spendTrendData = ref({});
    const spendByCategoryData = ref([]);
    const paymentHistory = ref({
        payments: [],
        unpaidInvoices: [],
        partiallyPaidInvoices: [],
    });
    const contributingFactors = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Fetch customer credit score and tier
    async function fetchCreditScore(customerNumber) {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(`${backendUrl}/customers/${customerNumber}/credit/score`);
            // Merge new data into customerData
            customerData.value = {
                ...customerData.value,
                ...response.data,
            };
        } catch (err) {
            error.value = `Error fetching credit score: ${err.message}`;
            console.error('Error fetching credit score:', err);
            throw err; // To propagate the error to fetchAllData
        }
    }

    // Fetch credit score history
    async function fetchCreditScoreHistory(customerNumber, startDate, endDate, interval = 'monthly') {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(
                `${backendUrl}/customers/${customerNumber}/credit/credit-score-history`,
                {
                    params: { startDate, endDate, interval },
                },
            );
            creditScoreHistory.value = response.data.history;
        } catch (err) {
            error.value = `Error fetching credit score history: ${err.message}`;
            console.error('Error fetching credit score history:', err);
        }
    }

    // Fetch spend trend data
    async function fetchSpendTrend(customerNumber, startDate, endDate) {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(
                `${backendUrl}/customers/${customerNumber}/credit/spend-trend`,
                {
                    params: { startDate, endDate },
                },
            );
            spendTrendData.value = response.data;
        } catch (err) {
            error.value = `Error fetching spend trend data: ${err.message}`;
            console.error('Error fetching spend trend data:', err);
        }
    }

    // Fetch spend by category
    async function fetchSpendByCategory(customerNumber, startDate, endDate) {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(
                `${backendUrl}/customers/${customerNumber}/credit/spend-by-category`,
                {
                    params: { startDate, endDate },
                },
            );
            spendByCategoryData.value = response.data.data;
        } catch (err) {
            error.value = `Error fetching spend by category data: ${err.message}`;
            console.error('Error fetching spend by category data:', err);
        }
    }

    // Fetch payment history
    async function fetchPaymentHistory(customerNumber, startDate, endDate) {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(
                `${backendUrl}/customers/${customerNumber}/credit/payment-history`,
                {
                    params: { startDate, endDate },
                },
            );
            paymentHistory.value = response.data;
        } catch (err) {
            error.value = `Error fetching payment history: ${err.message}`;
            console.error('Error fetching payment history:', err);
        }
    }

    // Fetch contributing factors
    async function fetchContributingFactors(customerNumber, limit = 5) {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(
                `${backendUrl}/customers/${customerNumber}/credit/contributing-factors`,
                {
                    params: { limit },
                },
            );
            contributingFactors.value = response.data.factors;
        } catch (err) {
            error.value = `Error fetching contributing factors: ${err.message}`;
            console.error('Error fetching contributing factors:', err);
        }
    }

    // Method to fetch all data
    async function fetchAllData(customerNumber, dateRange) {
        isLoading.value = true;
        error.value = null;

        const { startDate, endDate } = dateRange;

        try {
            // Fetch credit score first
            await fetchCreditScore(customerNumber);
            // Fetch other data in parallel
            await Promise.all([
                fetchCreditScoreHistory(customerNumber, startDate, endDate),
                fetchSpendTrend(customerNumber, startDate, endDate),
                fetchSpendByCategory(customerNumber, startDate, endDate),
                fetchPaymentHistory(customerNumber, startDate, endDate),
                fetchContributingFactors(customerNumber),
            ]);
        } catch (err) {
            // Error is already set in each function
            console.error('Error fetching all customer financial profile data:', err);
        } finally {
            isLoading.value = false;
        }
    }

    // Add the clearData method
    function clearData() {
        customerData.value = {};
        creditScoreHistory.value = [];
        spendTrendData.value = {};
        spendByCategoryData.value = [];
        paymentHistory.value = {
            payments: [],
            unpaidInvoices: [],
            partiallyPaidInvoices: [],
        };
        contributingFactors.value = [];
        error.value = null;
    }

    return {
        customerData,
        creditScoreHistory,
        spendTrendData,
        spendByCategoryData,
        paymentHistory,
        contributingFactors,
        isLoading,
        error,
        fetchAllData,
        clearData,
    };
});