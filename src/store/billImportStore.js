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
        selectedBill: null,
        isLoadingSelectedBill: false,
        socket: null,
        isLoadingProcessingQueue: false,
        isLoadingAuditBills: false,
        isLoadingProcessedBills: false,
        isLoadingMetrics: false,
        isLoadingMissingBills: false, // Added for missing bills loading state
        fetchError: null,
        jobUpdates: {},
        registeredJobs: new Set(),
        // For Events
        selectedJobId: null,
        selectedJobEvents: [],
        isLoadingEvents: false,
        // New state for missing bills
        missingBills: [] // Will hold the array of missing bills accounts
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
                await apiClient.post('/api/bills/process', formData, {
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

        async fetchBillById(billId) {
            this.isLoadingSelectedBill = true;
            try {
                const response = await apiClient.get(`/api/bills/bill/${billId}`);
                const bill = response.data;

                const account = bill.account || {};
                const customer = account.customer || {};
                const location = account.location || {};
                const vendor = account.vendor || {};

                this.selectedBill = {
                    ...bill,
                    customer_name: customer.name ?? 'N/A',
                    location_name: location.name ?? 'N/A',
                    carrier_name: vendor.name ?? account.provider_name ?? 'N/A',
                    account_number: account.account_number ?? 'N/A',
                    expected_amount: account.expected_amount ?? null,
                };

                this.fetchError = null;
            } catch (error) {
                console.error(`Error fetching bill with ID ${billId}:`, error);
                this.fetchError = `Failed to load bill ${billId}.`;
            } finally {
                this.isLoadingSelectedBill = false;
            }
        },

        setupSocket() {
            if (this.socket) {
                console.log('Socket already connected.');
                return;
            }

            this.socket = socket;

            this.socket.on('connect', () => {
                console.log('Socket connected.');
                this.fetchProcessingQueue().then(() => {
                    this.processingQueue.forEach(job => this.registerJobListeners(job.id));
                });
            });

            this.socket.on('reconnect', () => {
                console.log('Socket reconnected.');
                this.fetchProcessingQueue().then(() => {
                    this.processingQueue.forEach(job => this.registerJobListeners(job.id));
                });
            });

            this.socket.on('processingQueueUpdate', (data) => {
                if (Array.isArray(data)) {
                    this.processingQueue = data;
                    data.forEach(job => this.registerJobListeners(job.id));
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

        registerJobListeners(jobId) {
            if (!this.socket) {
                this.setupSocket();
            }

            if (this.registeredJobs.has(jobId)) {
                return;
            }
            this.registeredJobs.add(jobId);

            if (!this.jobUpdates[jobId]) {
                this.jobUpdates[jobId] = {
                    status: 'Processing',
                    step: 'Started',
                    detail: 'Waiting for updates...',
                };
            }

            this.socket.off(`update-${jobId}`);
            this.socket.off(`error-${jobId}`);

            this.socket.on(`update-${jobId}`, (data) => {
                this.jobUpdates[jobId] = { ...this.jobUpdates[jobId], ...data };

                if (['Completed', 'Audit', 'Duplicate', 'Error'].includes(this.jobUpdates[jobId].status)) {
                    setTimeout(() => {
                        this.processingQueue = this.processingQueue.filter(j => j.id !== jobId);
                        delete this.jobUpdates[jobId];
                        this.registeredJobs.delete(jobId);
                    }, 30000);
                }
            });

            this.socket.on(`error-${jobId}`, (errorData) => {
                this.jobUpdates[jobId] = {
                    ...this.jobUpdates[jobId],
                    status: 'Error',
                    error: errorData.error || 'An error occurred during processing.',
                };

                setTimeout(() => {
                    this.processingQueue = this.processingQueue.filter(j => j.id !== jobId);
                    delete this.jobUpdates[jobId];
                    this.registeredJobs.delete(jobId);
                }, 30000);
            });
        },

        // New action to fetch event logs for a given job
        async fetchEventsForJob(jobId) {
            this.isLoadingEvents = true;
            this.selectedJobId = jobId;
            this.selectedJobEvents = [];
            try {
                const response = await apiClient.get(`/api/bills/events/${jobId}`);
                this.selectedJobEvents = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error(`Error fetching events for job ${jobId}:`, error);
            } finally {
                this.isLoadingEvents = false;
            }
        },

        // New action to fetch missing bills data
        async fetchMissingBills() {
            this.isLoadingMissingBills = true;
            try {
                const response = await apiClient.get('/api/bills/missing-bills');
                this.missingBills = Array.isArray(response.data) ? response.data : [];
                this.fetchError = null;
            } catch (error) {
                console.error('Error fetching missing bills:', error);
                this.fetchError = 'Failed to load missing bills.';
            } finally {
                this.isLoadingMissingBills = false;
            }
        }
    },
});
