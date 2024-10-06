<template>
  <div class="dashboard-container">
    <h1>Finance Dashboard</h1>

    <!-- Date Range Selector -->
    <div class="date-selector">
      <Select
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

    <!-- Show Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
      <ProgressSpinner />
    </div>

    <!-- Key Metrics Section (Only show when data is loaded) -->
    <div v-if="!isLoading && incomeStatements.length && cashFlowStatements.length && balanceSheet.length" class="metrics-grid">
      <Card title="Total Revenue" :value="totalRevenue" />
      <Card title="Total Expenses" :value="totalExpenses" />
      <Card title="Net Profit" :value="netProfit" />
      <Card title="Cash Flow" :value="cashFlow" />
    </div>

    <!-- Detailed Reports Section -->
    <div v-if="!isLoading && incomeStatements.length && cashFlowStatements.length && balanceSheet.length" class="statements-section">
      <h2>Income Statements</h2>
      <div v-if="incomeStatements.length">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in incomeStatements" :key="item.id || index">
              <tr v-if="item.lineType === 'spacer'">
                <td colspan="2" class="spacer-line"></td>
              </tr>
              <tr v-else>
                <td :class="getLineClass(item)" :style="{ paddingLeft: item.indentation * 20 + 'px' }">{{ item.display }}</td>
                <td :class="getLineClass(item)" style="text-align: right;">{{ formatCurrency(item.netChange) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <h2>Balance Sheet</h2>
      <div v-if="balanceSheet.length">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in balanceSheet" :key="item.id || index">
              <tr v-if="item.lineType === 'spacer'">
                <td colspan="2" class="spacer-line"></td>
              </tr>
              <tr v-else>
                <td :class="getLineClass(item)" :style="{ paddingLeft: item.indentation * 20 + 'px' }">{{ item.display }}</td>
                <td :class="getLineClass(item)" style="text-align: right;">{{ formatCurrency(item.balance) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <h2>Cash Flow Statement</h2>
      <div v-if="cashFlowStatements.length">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in cashFlowStatements" :key="item.id || index">
              <tr v-if="item.lineType === 'spacer'">
                <td colspan="2" class="spacer-line"></td>
              </tr>
              <tr v-else>
                <td :class="getLineClass(item)" :style="{ paddingLeft: item.indentation * 20 + 'px' }">{{ item.display }}</td>
                <td :class="getLineClass(item)" style="text-align: right;">{{ formatCurrency(item.netChange) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { endOfMonth, startOfMonth, startOfYear, subMonths } from 'date-fns';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';
import { computed, onMounted, ref } from 'vue';
import Card from '../components/Card.vue';
import { useFinancialDashboardStore } from '../store/financialDashboardStore';

// Initialize the financial dashboard store
const dashboardStore = useFinancialDashboardStore();
const selectedRange = ref(null);
const selectedDates = ref(null);

// Available date ranges
const dateRanges = [
  { label: 'Month to Date', value: 'monthToDate' },
  { label: 'Year to Date', value: 'yearToDate' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' }
];

// Set default date range and trigger API call on mount
onMounted(async () => {
  selectedRange.value = dateRanges[0];
  await applyDateFilter();
});

// Function to apply date filter and trigger API call
async function applyDateFilter() {
  try {
    console.log('Applying date filter...');
    let startDate, endDate;
    const today = new Date();

    // Calculate date range based on selection
    if (selectedRange.value.value !== 'custom') {
      if (selectedRange.value.value === 'monthToDate') {
        startDate = startOfMonth(today);
        endDate = today;
      } else if (selectedRange.value.value === 'yearToDate') {
        startDate = startOfYear(today);
        endDate = today;
      } else if (selectedRange.value.value === 'lastMonth') {
        const lastMonthDate = subMonths(today, 1);
        startDate = startOfMonth(lastMonthDate);
        endDate = endOfMonth(lastMonthDate);
      }
    } else if (selectedDates.value && selectedDates.value.length === 2) {
      [startDate, endDate] = selectedDates.value;
    }

    if (startDate && endDate) {
      console.log('Fetching data for date range:', formatDate(startDate), 'to', formatDate(endDate));
      await dashboardStore.fetchFinancialDashboardData(formatDate(startDate), formatDate(endDate));
    }
  } catch (error) {
    console.error('Error applying date filter:', error);
  }
}

// Handle date range changes
function onDateRangeChange() {
  if (selectedRange.value.value !== 'custom') {
    selectedDates.value = null;
  }
}

// Format date to string
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Access isLoading from the store (remove the local isLoading)
const isLoading = computed(() => dashboardStore.isLoading);

// Computed properties for income, cash flow, and balance sheet data
const incomeStatements = computed(() => dashboardStore.incomeStatements || []);
const cashFlowStatements = computed(() => dashboardStore.cashFlowStatements || []);
const balanceSheet = computed(() => dashboardStore.balanceSheet || []);

// Computed properties for key metrics
const totalRevenue = computed(() => incomeStatements.value.reduce((acc, item) => acc + (item.netChange || 0), 0));
const totalExpenses = computed(() => cashFlowStatements.value.reduce((acc, item) => acc + (item.netChange || 0), 0));
const netProfit = computed(() => totalRevenue.value - totalExpenses.value);
const cashFlow = computed(() => cashFlowStatements.value.reduce((acc, item) => acc + (item.netChange || 0), 0));

// Formatting and helper functions
function getLineClass(item) {
  const classes = [];
  if (item.lineType === 'header') {
    classes.push('header-line');
  } else if (item.lineType === 'total') {
    classes.push('total-line');
  } else if (item.lineType === 'detail') {
    classes.push('detail-line');
  }
  if (item.netChange < 0 || item.balance < 0) {
    classes.push('negative-amount');
  }
  return classes.join(' ');
}

function formatCurrency(value) {
  const absValue = Math.abs(value);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return value < 0 ? `(${formatter.format(absValue)})` : formatter.format(absValue);
}
</script>

<style scoped>
/* Styles for table, grid, and loading spinner */
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

th {
  text-align: left;
  border-bottom: 2px solid #000;
  padding: 8px;
  font-size: 16px;
}

td {
  padding: 8px;
  font-size: 14px;
}

.header-line {
  font-weight: bold;
  font-size: 16px;
}

.total-line {
  font-weight: bold;
  border-top: 1px solid #000;
  font-size: 15px;
}

.spacer-line {
  height: 15px;
}

.negative-amount {
  color: red;
}

.loading-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>
