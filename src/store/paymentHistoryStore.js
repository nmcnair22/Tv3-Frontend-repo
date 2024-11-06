// src/store/paymentHistoryStore.js

import axios from 'axios';
import { defineStore } from 'pinia';

export const usePaymentHistoryStore = defineStore('paymentHistory', {
    state: () => ({
        payments: [],
        unpaidInvoices: [],
        partiallyPaidInvoices: [],
        creditScoreData: null, // Added for credit score details
        creditScoreHistory: [], // Added for credit score history
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchPaymentHistory(customerNumber) {
            this.isLoading = true;
            this.error = null;

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(
                    `${backendUrl}/api/local/financial-dashboard/customer-payment-history`,
                    {
                        params: { customerNumber },
                    },
                );

                if (response.data) {
                    this.payments = response.data.payments || [];
                    this.unpaidInvoices = response.data.unpaidInvoices || [];
                    this.partiallyPaidInvoices = response.data.partiallyPaidInvoices || [];
                } else {
                    this.payments = [];
                    this.unpaidInvoices = [];
                    this.partiallyPaidInvoices = [];
                    this.error = 'No data received from the server.';
                }
            } catch (error) {
                console.error('Error fetching payment history:', error);
                this.error = 'Failed to fetch payment history.';
            } finally {
                this.isLoading = false;
            }
        },

        // Method to fetch credit score
        async fetchCreditScore(customerNumber) {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(
                    `${backendUrl}/api/local/financial-dashboard/customer-credit-score`,
                    {
                        params: { customerNumber },
                    },
                );

                if (response.data) {
                    console.log('Credit Score Data:', response.data);
                    this.creditScoreData = response.data;
                } else {
                    this.creditScoreData = null;
                    this.error = 'No credit score data received from the server.';
                }
            } catch (error) {
                console.error('Error fetching credit score:', error);
                this.error = 'Failed to fetch credit score.';
            }
        },

        // Method to fetch credit score history
        async fetchCreditScoreHistory(customerNumber, startDate, endDate) {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(
                    `${backendUrl}/api/local/financial-dashboard/customer-credit-score-history`,
                    {
                        params: { customerNumber, startDate, endDate, interval: 'monthly' },
                    },
                );

                if (response.data) {
                    console.log('Credit Score History Data:', response.data);
                    this.creditScoreHistory = response.data;
                } else {
                    this.creditScoreHistory = [];
                    this.error = 'No credit score history data received from the server.';
                }
            } catch (error) {
                console.error('Error fetching credit score history:', error);
                this.error = 'Failed to fetch credit score history.';
            }
        },
    },
});
