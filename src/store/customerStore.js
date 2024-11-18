// src/store/customerStore.js

import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCustomerStore = defineStore('customerStore', () => {
    const customers = ref([]);
    const selectedCustomer = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchCustomers() {
        isLoading.value = true;
        error.value = null;
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await axios.get(`${backendUrl}/customers`);
            customers.value = response.data;
        } catch (err) {
            error.value = `Error fetching customers: ${err.message}`;
            console.error('Error fetching customers:', err);
        } finally {
            isLoading.value = false;
        }
    }

    function selectCustomer(customer) {
        selectedCustomer.value = customer;
    }

    return {
        customers,
        selectedCustomer,
        isLoading,
        error,
        fetchCustomers,
        selectCustomer,
    };
});
