<!-- src/pages/CustomerFinancialProfile.vue -->
<template>
  <div class="customer-financial-profile">
    <!-- Customer Selector -->
    <CustomerSelector />

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="loading-container">
      <p>Loading customer financial profile...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else-if="!selectedCustomer">
      <p>Please select a customer to view their financial profile.</p>
    </div>
    <div v-else>
      <!-- Header Section -->
      <HeaderSection :customerData="customerData" :isLoading="isLoading" :error="error" />

      <!-- Financial Summary Cards -->
      <div class="summary-cards">
        <FinancialSummaryCards :customerData="customerData" />
      </div>

      <!-- Graphs and Charts -->
      <div class="charts-section">
        <div class="chart-item">
          <CreditScoreHistoryChart :data="creditScoreHistory" />
        </div>
        <div class="chart-item">
          <SpendTrendChart :data="spendTrendData" />
        </div>
      </div>

      <!-- Spend by Category -->
      <div class="chart-item">
        <SpendByCategoryChart :data="spendByCategoryData" />
      </div>

      <!-- Recent Transactions -->
      <RecentTransactions :paymentHistory="paymentHistory" />

      <!-- Contributing Factors -->
      <ContributingFactors :factors="contributingFactors" />

      <!-- Add a Trends Section -->
      <div class="trends-section">
        <h2>Financial Trends</h2>
        <div class="trend-charts">
          <div class="chart-item">
            <CreditScoreHistoryChart :data="creditScoreHistory" />
          </div>
          <div class="chart-item">
            <SpendTrendChart :data="spendTrendData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useCustomerFinancialProfileStore } from '../store/customerFinancialProfileStore';
import { useCustomerStore } from '../store/customerStore';

// Import components
import ContributingFactors from '../components/ContributingFactors.vue';
import CreditScoreHistoryChart from '../components/CreditScoreHistoryChart.vue';
import CustomerSelector from '../components/CustomerSelector.vue';
import FinancialSummaryCards from '../components/FinancialSummaryCards.vue';
import HeaderSection from '../components/HeaderSection.vue';
import RecentTransactions from '../components/RecentTransactions.vue';
import SpendByCategoryChart from '../components/SpendByCategoryChart.vue';
import SpendTrendChart from '../components/SpendTrendChart.vue';

const customerStore = useCustomerStore();
const customerFinancialProfileStore = useCustomerFinancialProfileStore();

const { selectedCustomer } = storeToRefs(customerStore);

// Compute customerData by merging selectedCustomer and customerFinancialProfileStore.customerData
const customerData = computed(() => {
  return {
    ...selectedCustomer.value,
    ...customerFinancialProfileStore.customerData,
  };
});

const selectedRange = ref('lastSixMonths'); // Default date range

const dateRangeValues = {
  lastSixMonths: {
    startDate: formatDate(subtractMonths(new Date(), 6)),
    endDate: formatDate(new Date()),
  },
  yearToDate: {
    startDate: formatDate(startOfYear(new Date())),
    endDate: formatDate(new Date()),
  },
  lastYear: {
    startDate: formatDate(startOfYear(subtractYears(new Date(), 1))),
    endDate: formatDate(endOfYear(subtractYears(new Date(), 1))),
  },
};

watch(
  () => selectedCustomer.value,
  async (newCustomer) => {
    if (newCustomer) {
      await applyDateFilter(selectedRange.value, newCustomer.customerNumber);
    } else {
      // Clear data if no customer is selected
      customerFinancialProfileStore.clearData();
    }
  },
  { immediate: true }
);

// Extract data from the store using storeToRefs
const {
  creditScoreHistory,
  spendTrendData,
  spendByCategoryData,
  paymentHistory,
  contributingFactors,
  isLoading,
  error,
} = storeToRefs(customerFinancialProfileStore);

async function applyDateFilter(range, customerNumber) {
  let dateRange;
  if (range !== 'custom') {
    dateRange = dateRangeValues[range];
  } else {
    // Handle custom date range (implement if needed)
    dateRange = {
      startDate: '2024-01-01',
      endDate: '2024-11-12',
    };
  }
  await customerFinancialProfileStore.fetchAllData(customerNumber, dateRange);
}

// Helper date functions
function formatDate(date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

function subtractMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
}

function subtractYears(date, years) {
  return new Date(date.getFullYear() - years, date.getMonth(), date.getDate());
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date) {
  return new Date(date.getFullYear(), 11, 31);
}
</script>

<style scoped>
.customer-financial-profile {
  padding: 1rem;
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.charts-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.chart-item {
  flex: 1 1 48%;
  min-width: 300px;
  height: 300px;
}

@media (max-width: 768px) {
  .chart-item {
    flex: 1 1 100%;
  }
}

/* Loading and Error Styles */
.loading-container,
.error-container {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #595959;
}
</style>
