// src/store/billImportStore.js
import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import socket from '../services/socket';

export const useBillImportStore = defineStore('billImport', {
    state: () => ({
        processingQueue: [],
        auditBills: [],
        processedBills: [],
        metrics: {},
        socket: null,
        isLoadingProcessingQueue: false,
        isLoadingAuditBills: false,
        isLoadingProcessedBills: false,
        isLoadingMetrics: false,
        fetchError: null,
    }),
    actions: {
        async fetchProcessingQueue() {
            this.isLoadingProcessingQueue = true;
            try {
                const response = await apiClient.get('/api/bills/processing-queue');
                this.processingQueue = Array.isArray(response.data) ? response.data : [];
                this.fetchError = null;
            } catch (error) {
                console.error('Error fetching processing queue:', error);
                this.fetchError = 'Failed to load processing queue.';
            } finally {
                this.isLoadingProcessingQueue = false;
            }
        },

        async fetchAuditBills() {
            this.isLoadingAuditBills = true;
            try {
                const response = await apiClient.get('/api/bills/audit');
                this.auditBills = Array.isArray(response.data) ? response.data : [];
                this.fetchError = null;
            } catch (error) {
                console.error('Error fetching audit bills:', error);
                this.fetchError = 'Failed to load audit bills.';
            } finally {
                this.isLoadingAuditBills = false;
            }
        },

        async fetchProcessedBills(hours = 100) {
            this.isLoadingProcessedBills = true;
            console.log(`Fetching Processed Bills from the last ${hours} hours...`);
            try {
                const response = await apiClient.get('/api/bills/processed-recent', { params: { hours } });
                let data = Array.isArray(response.data) ? response.data : [];

                // Map nested fields to top-level fields
                data = data.map(bill => {
                    const account = bill.account || {};
                    const customer = account.customer || {};
                    const location = account.location || {};
                    const vendor = account.vendor || {};

                    return {
                        ...bill,
                        customer_name: customer.name ?? 'N/A',
                        location_name: location.name ?? 'N/A',
                        carrier_name: vendor.name ?? account.provider_name ?? 'N/A',
                        account_number: account.account_number ?? 'N/A',
                        expected_amount: account.expected_amount ?? null,
                    };
                });

                this.processedBills = data;
                this.fetchError = null;
            } catch (error) {
                console.error('Error fetching processed bills:', error);
                this.fetchError = 'Failed to load processed bills.';
            } finally {
                this.isLoadingProcessedBills = false;
            }
        },

        async fetchMetrics() {
            this.isLoadingMetrics = true;
            try {
                const response = await apiClient.get('/api/bills/metrics');
                this.metrics = response.data || {};
                this.fetchError = null;
            } catch (error) {
                console.error('Error fetching metrics:', error);
                this.fetchError = 'Failed to load metrics.';
            } finally {
                this.isLoadingMetrics = false;
            }
        },

        async uploadBills(formData) {
            try {
                const response = await apiClient.post('/api/bills/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                await this.fetchProcessingQueue();
                this.fetchError = null;
                console.log('Bills uploaded successfully.');
            } catch (error) {
                console.error('Error uploading bills:', error);
                this.fetchError = 'Failed to upload bills.';
                throw error;
            }
        },

        setupSocket() {
            if (this.socket) {
                console.log('Socket already connected.');
                return;
            }

            this.socket = socket;

            this.socket.on('processingQueueUpdate', (data) => {
                if (Array.isArray(data)) {
                    this.processingQueue = data;
                }
            });

            this.socket.on('auditBillsUpdate', (data) => {
                if (Array.isArray(data)) {
                    this.auditBills = data;
                }
            });

            this.socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });
        },
    },
});