<template>
  <div class="finance-dashboard">
    <h1>Finance Dashboard</h1>

    <!-- Date Range Selector -->
    <div class="controls-container">
      <Dropdown
        v-model="selectedRange"
        :options="dateRanges"
        optionLabel="label"
        placeholder="Select Date Range"
        @change="onDateRangeChange"
        style="width: 200px;"
      />
      <DatePicker
        v-model="selectedDates"
        selectionMode="range"
        dateFormat="yy-mm-dd"
        placeholder="Select Custom Date Range"
        showIcon
        :disabled="selectedRange && selectedRange.value !== 'custom'"
        style="width: 300px;"
      />
      <Button
        label="Apply"
        @click="applyDateFilter"
        icon="pi pi-check"
        class="p-button-success"
      />
    </div>

    <!-- Loading and Error Messages -->
    <div v-if="isLoading">
      <ProgressSpinner />
    </div>
    <div v-if="error">
      <p class="error">{{ error }}</p>
    </div>

    <!-- Inflows Section -->
    <div v-if="!isLoading && inflowsData">
      <h2>Inflows</h2>
      <div class="receivables-overview">
        <div class="card">
          <h3>Starting Receivables</h3>
          <p>{{ formatCurrency(inflowsData.startingReceivables) }}</p>
        </div>
        <div class="card">
          <h3>Ending Receivables</h3>
          <p>{{ formatCurrency(inflowsData.endingReceivables) }}</p>
        </div>
        <div class="card">
          <h3>Net Change</h3>
          <p>{{ formatCurrency(inflowsData.netChangeReceivables) }}</p>
        </div>
        <div class="card">
          <h3>Total New Invoices</h3>
          <p>{{ formatCurrency(inflowsData.totalNewInvoices) }}</p>
        </div>
        <div class="card">
          <h3>Total Payments Received</h3>
          <p>{{ formatCurrency(inflowsData.totalPaymentsReceived) }}</p>
        </div>
      </div>

      <!-- Revenue Categories Chart and Payments by Customer Chart -->
      <div class="charts-container">
        <div class="chart pie-chart">
          <h3>Revenue by Category</h3>
          <Chart type="pie" :data="revenueCategoriesChartData" />
        </div>
        <div class="chart bar-chart">
          <h3>Payments by Customer</h3>
          <Chart type="bar" :data="paymentsByCustomerChartData" :options="barChartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Chart from 'primevue/chart';
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, onMounted, ref } from 'vue';
import { useFinancialDashboardStore } from '../store/financialDashboardStore';

const dashboardStore = useFinancialDashboardStore();

const isLoading = computed(() => dashboardStore.isLoading);
const inflowsData = computed(() => dashboardStore.inflowsData);
const error = computed(() => dashboardStore.error);

const selectedRange = ref(null);
const selectedDates = ref(null);

const dateRanges = [
  { label: 'Month to Date', value: 'monthToDate' },
  { label: 'Year to Date', value: 'yearToDate' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
];

onMounted(async () => {
  selectedRange.value = dateRanges[0];
  await applyDateFilter();
});

async function applyDateFilter() {
  let startDate, endDate;
  const today = new Date();

  if (selectedRange.value.value !== 'custom') {
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
    await dashboardStore.fetchInflowsData(startDate, endDate);
  }
}

function onDateRangeChange() {
  if (selectedRange.value.value !== 'custom') {
    selectedDates.value = null;
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return '$0.00';
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(value);
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
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
}

// Chart Data
const revenueCategoriesChartData = computed(() => {
  if (!inflowsData.value || !inflowsData.value.revenueCategories) {
    return {};
  }
  return {
    labels: inflowsData.value.revenueCategories.map((item) => item.category),
    datasets: [
      {
        data: inflowsData.value.revenueCategories.map((item) => item.amount),
        backgroundColor: [
          '#42A5F5',
          '#66BB6A',
          '#FFA726',
          '#FFCA28',
          '#26C6DA',
          '#AB47BC',
          '#EC407A',
        ],
        hoverBackgroundColor: [
          '#64B5F6',
          '#81C784',
          '#FFB74D',
          '#FFD54F',
          '#4DD0E1',
          '#BA68C8',
          '#F06292',
        ],
      },
    ],
  };
});

const paymentsByCustomerChartData = computed(() => {
  if (!inflowsData.value || !inflowsData.value.paymentsByCustomer) {
    return {};
  }
  return {
    labels: inflowsData.value.paymentsByCustomer.map((item) => item.customer),
    datasets: [
      {
        label: 'Payments Received',
        data: inflowsData.value.paymentsByCustomer.map((item) => item.amount),
        backgroundColor: [
          '#42A5F5', '#66BB6A', '#FFA726', '#FFCA28', '#26C6DA', '#AB47BC', '#EC407A'
        ],
      },
    ],
  };
});

const barChartOptions = {
  indexAxis: 'y',
  responsive: true,
  scales: {
    x: {
      ticks: {
        callback: function (value) {
          return formatCurrency(value);
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<style scoped>
.finance-dashboard {
  padding: 1rem;
}

.controls-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.receivables-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.receivables-overview .card {
  flex: 1 1 calc(20% - 1rem);
  background-color: #f7f9fc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.receivables-overview .card h3 {
  margin-bottom: 0.5rem;
}

.error {
  color: red;
  font-weight: bold;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart {
  background-color: #f7f9fc;
  padding: 1rem;
  border-radius: 8px;
}

.pie-chart {
  max-width: 100%;
}

@media (max-width: 768px) {
  .receivables-overview .card {
    flex: 1 1 calc(50% - 1rem);
  }
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .receivables-overview .card {
    flex: 1 1 100%;
  }
}
</style>