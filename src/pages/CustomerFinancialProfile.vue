<!-- src/pages/CustomerFinancialProfile.vue -->
<template>
  <div class="customer-financial-profile">
    <!-- Loading and Error States -->
    <div v-if="isLoading" class="loading-container">
      <p>Loading customer financial profile...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else>
      <!-- Header Section -->
      <HeaderSection :customerData="customerData" :isLoading="isLoading" :error="error" />

      <!-- Financial Summary Cards -->
      <div class="summary-cards">
        <FinancialSummaryCards :customerData="customerData" />
      </div>

      <!-- Date Range Selector -->
      <DateRangeSelector
        :initialSelectedRange="selectedRange"
        :dateRanges="dateRanges"
        @apply-filter="applyDateFilter"
      />

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
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomerFinancialProfileStore } from '../store/customerFinancialProfileStore';

// Import components
import ContributingFactors from '../components/ContributingFactors.vue';
import CreditScoreHistoryChart from '../components/CreditScoreHistoryChart.vue';
import DateRangeSelector from '../components/DateRangeSelector.vue';
import FinancialSummaryCards from '../components/FinancialSummaryCards.vue';
import HeaderSection from '../components/HeaderSection.vue';
import RecentTransactions from '../components/RecentTransactions.vue';
import SpendByCategoryChart from '../components/SpendByCategoryChart.vue';
import SpendTrendChart from '../components/SpendTrendChart.vue';

const route = useRoute();
const store = useCustomerFinancialProfileStore();

const customerNumber = route.params.customerNumber || '713'; // Default customer number for testing
const selectedRange = ref('lastSixMonths'); // Default date range
const dateRanges = [
  { label: 'Last 6 Months', value: 'lastSixMonths' },
  { label: 'Year to Date', value: 'yearToDate' },
  { label: 'Last Year', value: 'lastYear' },
  { label: 'Custom', value: 'custom' },
];

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

onMounted(() => {
  applyDateFilter(selectedRange.value);
});

// Extract data from the store using computed properties
const customerData = computed(() => store.customerData || {});
const creditScoreHistory = computed(() => store.creditScoreHistory);
const spendTrendData = computed(() => store.spendTrendData);
const spendByCategoryData = computed(() => store.spendByCategoryData);
const paymentHistory = computed(() => store.paymentHistory);
const contributingFactors = computed(() => store.contributingFactors);
const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);

async function applyDateFilter(range) {
  let dateRange;
  if (range !== 'custom') {
    dateRange = dateRangeValues[range];
  } else {
    // Handle custom date range (you can implement custom date selection)
    dateRange = {
      startDate: '2024-01-01',
      endDate: '2024-11-12',
    };
  }
  await store.fetchAllData(customerNumber, dateRange);
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