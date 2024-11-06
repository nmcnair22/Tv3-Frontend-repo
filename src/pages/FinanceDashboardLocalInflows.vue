<!-- src/pages/FinanceDashboardLocalInflows.vue -->
<template>
    <div>
      <!-- Inflows Section -->
      <div v-if="!isLoading && inflowsData">
        <h2 class="section-title">
          Inflows{{ formattedDateRange ? ': ' + formattedDateRange : '' }}
        </h2>
  
        <!-- Receivables Overview Cards Component -->
        <div class="receivables-overview-container">
          <ReceivablesOverview :inflowsData="inflowsData" />
        </div>
  
        <!-- Add spacing between KPI cards and charts -->
        <div class="section-spacing"></div>
  
        <!-- Charts and Activity Feed Container -->
        <div class="charts-activity-container">
          <!-- Left Column: RevenueByCategoryChart and ActivityFeed -->
          <div class="left-column">
            <div class="chart-item">
              <RevenueByCategoryChart
                v-if="inflowsData.revenueCategories && inflowsData.revenueCategories.length"
                :revenueCategories="inflowsData.revenueCategories"
              />
            </div>
            <!-- Activity Feed Component -->
            <div class="activity-feed-container">
              <ActivityFeed />
            </div>
          </div>
  
          <!-- Right Column: PaymentsByCustomerChart -->
          <div class="right-column">
            <div class="chart-item">
              <PaymentsByCustomerChart
                v-if="inflowsData.paymentsByCustomer && inflowsData.paymentsByCustomer.length"
                :paymentsByCustomer="inflowsData.paymentsByCustomer"
              />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading and Error Components -->
      <Loading v-if="isLoading" />
      <ErrorMessage v-if="error" :message="error" />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
import { useFinancialDashboardLocalStore } from '../store/financialDashboardLocalStore';
  
  // Import components
  import ActivityFeed from '../components/ActivityFeed.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Loading from '../components/Loading.vue';
import PaymentsByCustomerChart from '../components/PaymentsByCustomerChart.vue';
import ReceivablesOverview from '../components/ReceivablesOverview.vue';
import RevenueByCategoryChart from '../components/RevenueByCategoryChart.vue';
  
  const props = defineProps({
    formattedDateRange: {
      type: String,
      default: '',
    },
  });
  
  const dashboardStore = useFinancialDashboardLocalStore();
  
  const isLoading = computed(() => dashboardStore.isLoading);
  const inflowsData = computed(() => dashboardStore.inflowsData || {});
  const error = computed(() => dashboardStore.error);
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
  
  .charts-activity-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .left-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .right-column {
    flex: 2;
  }
  
  .chart-item {
    height: 350px;
    background-color: #F7F9FC;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .activity-feed-container {
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 1rem;
    max-height: 450px;
    overflow-y: auto;
  }
  
  /* Responsive Design for Smaller Screens */
  @media (max-width: 768px) {
    .charts-activity-container {
      flex-direction: column;
    }
  
    .left-column, .right-column {
      flex: 1;
    }
  
    .section-title {
      font-size: 1.5rem;
    }
  }
  </style>