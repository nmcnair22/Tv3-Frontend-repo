<!-- src/components/DSOReport.vue -->

<template>
    <div class="dso-report">
      <h2 class="section-title">DSO Report</h2>
  
      <!-- Date Range Selection -->
      <div class="date-range">
        <DatePicker v-model="dateRange.startDate" label="Start Date" />
        <DatePicker v-model="dateRange.endDate" label="End Date" />
        <Button label="Calculate DSO" @click="fetchDSO" />
      </div>
  
      <!-- Loading Indicator -->
      <Loading v-if="isLoading" />
  
      <!-- Error Message -->
      <ErrorMessage v-if="error" :message="error" />
  
      <!-- DSO Metrics -->
      <div v-if="!isLoading && dsoData.length">
        <p><strong>Average DSO:</strong> {{ calculateAverageDSO }} days</p>
  
        <!-- DSO Metrics Table -->
        <DataTable :value="dsoData" paginator :rows="10" class="dso-table">
          <Column field="invoiceNumber" header="Invoice Number" sortable></Column>
          <Column field="customerName" header="Customer Name" sortable></Column>
          <Column field="invoiceDate" header="Invoice Date" sortable></Column>
          <Column field="paymentDate" header="Payment Date" sortable></Column>
          <Column field="daysOutstanding" header="Days Outstanding" sortable></Column>
        </DataTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, ref } from 'vue';
import DatePicker from './DatePicker.vue'; // Assume you have a DatePicker component
import ErrorMessage from './ErrorMessage.vue';
import Loading from './Loading.vue';
  
  // Backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  
  // Reactive variables
  const dateRange = ref({
    startDate: '',
    endDate: '',
  });
  const dsoData = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Computed property to calculate average DSO
  const calculateAverageDSO = computed(() => {
    if (dsoData.value.length === 0) return 0;
    const totalDays = dsoData.value.reduce(
      (sum, metric) => sum + metric.daysOutstanding,
      0,
    );
    return (totalDays / dsoData.value.length).toFixed(2);
  });
  
  // Function to fetch DSO metrics
  async function fetchDSO() {
    if (!dateRange.value.startDate || !dateRange.value.endDate) {
      error.value = 'Please select both start and end dates.';
      return;
    }
  
    isLoading.value = true;
    error.value = null;
    dsoData.value = [];
  
    try {
      const response = await axios.get(`${backendUrl}/financial-dashboard/dso-metrics`, {
        params: {
          startDate: dateRange.value.startDate,
          endDate: dateRange.value.endDate,
        },
      });
  
      dsoData.value = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched DSO data:', dsoData.value);
    } catch (err) {
      console.error('Error fetching DSO data:', err);
      error.value = 'Failed to fetch DSO data.';
    } finally {
      isLoading.value = false;
    }
  }
  </script>
  
  <style scoped>
  .dso-report {
    padding: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #08294a; /* Night Sky */
    margin-bottom: 1rem;
  }
  
  .date-range {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .dso-table {
    margin-top: 1rem;
  }
  </style>
  