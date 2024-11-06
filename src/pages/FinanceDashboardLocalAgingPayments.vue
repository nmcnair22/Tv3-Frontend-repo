<!-- src/pages/FinanceDashboardLocalAgingPayments.vue -->
<template>
    <div>
      <!-- Aging Report Section -->
      <div v-if="selectedEndDate && agingReportData.length > 0">
        <AgingReport
          :asOfDate="formatDate(selectedEndDate)"
          :reportData="agingReportData"
          :isLoading="agingReportIsLoading"
          :error="agingReportError"
        />
      </div>
      <div v-else-if="!agingReportIsLoading && agingReportError">
        <ErrorMessage :message="agingReportError" />
      </div>
      <div v-else-if="!agingReportIsLoading">
        <p>No aging report data available.</p>
      </div>
  
      <!-- Loading Component -->
      <Loading v-if="agingReportIsLoading" />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
import { useAgingReportStore } from '../store/agingReportStore';
  
  // Import components
  import AgingReport from '../components/AgingReport.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Loading from '../components/Loading.vue';
  
  const props = defineProps({
    selectedEndDate: {
      type: Date,
      default: null,
    },
  });
  
  const agingReportStore = useAgingReportStore();
  
  const agingReportData = computed(() => agingReportStore.agingReport || []);
  const agingReportIsLoading = computed(() => agingReportStore.isLoading);
  const agingReportError = computed(() => agingReportStore.error);
  
  // Helper functions
  function formatDate(date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  function formatDisplayDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  </script>
  
  <style scoped>
  .section-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #08294A;
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.5rem;
  }
  </style>