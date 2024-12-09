// src/store/billDetailStore.js

import axios from 'axios';
import { defineStore } from 'pinia';

export const useBillDetailStore = defineStore('billDetail', {
    state: () => ({
        billDetails: null,
    }),
    actions: {
        // Fetch bill details
        async fetchBillDetails(billId) {
            try {
                const response = await axios.get(`/api/bills/${billId}`);
                this.billDetails = response.data.bill;
            } catch (error) {
                console.error('Error fetching bill details:', error);
                throw error;
            }
        },
        // Add note to bill
        async addNoteToBill(billId, noteContent) {
            try {
                const response = await axios.post(`/api/bills/${billId}/notes`, { note: noteContent });
                console.log('Note added:', response.data);
            } catch (error) {
                console.error('Error adding note:', error);
                throw error;
            }
        },
        // Add audit flag to bill
        async addAuditFlagToBill(billId, reason) {
            try {
                const response = await axios.post(`/api/bills/${billId}/audit-flag`, { reason });
                console.log('Audit flag added:', response.data);
            } catch (error) {
                console.error('Error adding audit flag:', error);
                throw error;
            }
        },
        // Add account flag to bill
        async addAccountFlagToBill(billId, flag) {
            try {
                // Assuming accountNumber is part of billDetails
                const accountNumber = this.billDetails.accountNumber;
                const response = await axios.post(`/api/accounts/${accountNumber}/flags`, { flag });
                console.log('Account flag added:', response.data);
            } catch (error) {
                console.error('Error adding account flag:', error);
                throw error;
            }
        },
    },
});
