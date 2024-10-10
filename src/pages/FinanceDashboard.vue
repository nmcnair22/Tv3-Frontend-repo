<!-- src/pages/FinanceDashboard.vue -->
<template>
  <div class="finance-dashboard">
    <h1>Finance Dashboard</h1>

    <!-- Date Range Selector Component -->
    <DateRangeSelector
      v-model:modelValueRange="selectedRange"
      v-model:modelValueDates="selectedDates"
      :dateRanges="dateRanges"
      @apply-filter="applyDateFilter"
    />

    <!-- Loading and Error Components -->
    <Loading v-if="isLoading" />
    <ErrorMessage v-if="error" :message="error" />

    <!-- Inflows Section -->
    <div v-if="!isLoading && inflowsData">
      <h2>Inflows{{ formattedDateRange ? ': ' + formattedDateRange : '' }}</h2>

      <!-- Receivables Overview Cards Component -->
      <ReceivablesOverview :inflowsData="inflowsData" />

      <!-- Add spacing between KPI cards and charts -->
      <div class="section-spacing"></div>

      <!-- Charts Container -->
      <div class="charts-container">
        <!-- Pie Chart (RevenueByCategoryChart) -->
        <div class="chart-item pie-chart">
          <RevenueByCategoryChart
            v-if="inflowsData.revenueCategories && inflowsData.revenueCategories.length"
            :revenueCategories="inflowsData.revenueCategories"
          />
        </div>

        <!-- Line Chart (PaymentsByCustomerChart) -->
        <div class="chart-item payment-chart">
          <PaymentsByCustomerChart
            v-if="inflowsData.paymentsByCustomer && inflowsData.paymentsByCustomer.length"
            :paymentsByCustomer="inflowsData.paymentsByCustomer"
          />
        </div>
      </div>

      <!-- Aging Report Section -->
      <AgingReport
        v-if="selectedEndDate && agingReportData.length > 0"
        :asOfDate="formatDate(selectedEndDate)"
        :reportData="agingReportData"
        :isLoading="agingReportIsLoading"
        :error="agingReportError"
      />
      <div v-else-if="!agingReportIsLoading && agingReportError">
        <ErrorMessage :message="agingReportError" />
      </div>
      <div v-else-if="!agingReportIsLoading">
        <p>No aging report data available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useAgingReportStore } from '../store/agingReportStore';
import { useFinancialDashboardStore } from '../store/financialDashboardStore';

// Import components
import AgingReport from '../components/AgingReport.vue';
import DateRangeSelector from '../components/DateRangeSelector.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Loading from '../components/Loading.vue';
import PaymentsByCustomerChart from '../components/PaymentsByCustomerChart.vue';
import ReceivablesOverview from '../components/ReceivablesOverview.vue';
import RevenueByCategoryChart from '../components/RevenueByCategoryChart.vue';

const dashboardStore = useFinancialDashboardStore();
const agingReportStore = useAgingReportStore();

const isLoading = computed(() => dashboardStore.isLoading);
const inflowsData = computed(() => dashboardStore.inflowsData || {});
const error = computed(() => dashboardStore.error);

const agingReportData = computed(() => agingReportStore.agingReport || []);
const agingReportIsLoading = computed(() => agingReportStore.isLoading);
const agingReportError = computed(() => agingReportStore.error);

// Initialize selectedRange and selectedDates
const selectedRange = ref(null);
const selectedDates = ref(null);
const selectedEndDate = ref(null); // Store the end date separately

// Define dateRanges
const dateRanges = [
  { label: 'Month to Date', value: 'monthToDate' },
  { label: 'Year to Date', value: 'yearToDate' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
];

// Property to store formatted date range
const formattedDateRange = ref('');

// Watch for changes in selectedRange and selectedDates to update formattedDateRange
watch([selectedRange, selectedDates], () => {
  console.log('Watch Triggered: selectedRange or selectedDates changed');
  formattedDateRange.value = getFormattedDateRange();
  selectedEndDate.value = getSelectedEndDate(); // Update the selected end date
  console.log('Updated Selected End Date:', selectedEndDate.value);

  if (selectedEndDate.value) {
    fetchAgingReport(formatDate(selectedEndDate.value)); // Pass formatted date string
  }
});

function getFormattedDateRange() {
  let startDate, endDate;
  const today = new Date();

  if (selectedRange.value && selectedRange.value.value !== 'custom') {
    if (selectedRange.value.value === 'monthToDate') {
      startDate = startOfMonth(today);
      endDate = today;
      return `Month to Date (${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`;
    } else if (selectedRange.value.value === 'yearToDate') {
      startDate = startOfYear(today);
      endDate = today;
      return `Year to Date (${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`;
    } else if (selectedRange.value.value === 'lastMonth') {
      const lastMonthDate = subMonths(today, 1);
      startDate = startOfMonth(lastMonthDate);
      endDate = endOfMonth(lastMonthDate);
      return `Last Month (${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`;
    }
  } else if (
    selectedRange.value &&
    selectedRange.value.value === 'custom' &&
    selectedDates.value &&
    selectedDates.value.length === 2
  ) {
    [startDate, endDate] = selectedDates.value;
    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
  }

  return '';
}

function getSelectedEndDate() {
  if (selectedRange.value && selectedRange.value.value !== 'custom') {
    const today = new Date();
    if (selectedRange.value.value === 'monthToDate') {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else if (selectedRange.value.value === 'yearToDate') {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else if (selectedRange.value.value === 'lastMonth') {
      const lastMonthDate = subMonths(today, 1);
      return endOfMonth(lastMonthDate);
    }
  } else if (selectedDates.value && selectedDates.value.length === 2) {
    const endDate = selectedDates.value[1];
    return new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  }
  return null;
}

onMounted(async () => {
  // Set default selected range to 'Month to Date' if not already set
  if (!selectedRange.value) {
    selectedRange.value = dateRanges[0]; // Default to 'Month to Date'
    selectedEndDate.value = getSelectedEndDate();
  }
  await applyDateFilter();
});

async function applyDateFilter() {
  let startDate, endDate;
  const today = new Date();

  if (selectedRange.value && selectedRange.value.value !== 'custom') {
    if (selectedRange.value.value === 'monthToDate') {
      startDate = formatDate(startOfMonth(today));
      endDate = formatDate(today);
    } else if (selectedRange.value.value === 'yearToDate') {
      startDate = formatDate(startOfYear(today));
      endDate = formatDate(today);
    } else if (selectedRange.value.value === 'lastMonth') {
      const lastMonthDate = subMonths(today, 1);
      startDate = formatDate(startOfMonth(lastMonthDate));
      endDate = formatDate(endOfMonth(lastMonthDate));
    }
  } else if (selectedDates.value && selectedDates.value.length === 2) {
    [startDate, endDate] = selectedDates.value.map((date) => formatDate(date));
  }

  if (startDate && endDate) {
    console.log('Fetching inflows data with startDate:', startDate, 'and endDate:', endDate);
    await dashboardStore.fetchInflowsData(startDate, endDate);
    // Update formattedDateRange
    formattedDateRange.value = getFormattedDateRange();
    selectedEndDate.value = parseDate(endDate); // Set the selected end date as Date object
    console.log('Applied Date Filter. Selected End Date:', selectedEndDate.value);
  }
}

async function fetchAgingReport(asOfDate) {
  try {
    console.log('Fetching aging report for asOfDate:', asOfDate);
    await agingReportStore.fetchAgingReport(asOfDate);
    console.log('Aging report fetched successfully');
  } catch (error) {
    console.error('Error fetching aging report:', error);
  }
}

// Helper functions for date calculations
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function subMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() - months, 1);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDisplayDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}
</script>

<style scoped>
.finance-dashboard {
  padding: 1rem;
}

.section-spacing {
  margin-bottom: 1.5rem; /* Adjust the value as needed */
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 1/3 and 2/3 ratio */
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Ensure that the chart components fill their grid cells */
.chart-item {
  width: 100%;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>