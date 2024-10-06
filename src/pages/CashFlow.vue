<template>
  <div>
    <h1>Cash Flow Report</h1>

    <!-- Date Range Controls -->
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
        label="Run Report"
        @click="fetchCashFlowStatements"
        icon="pi pi-refresh"
        class="p-button-primary"
      />
    </div>

    <!-- Cash Flow Report Table -->
    <div v-if="cashFlowStatements && cashFlowStatements.length">
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
              <td
                :class="getLineClass(item)"
                :style="{ paddingLeft: item.indentation * 20 + 'px' }"
              >
                {{ item.display }}
              </td>
              <td
                :class="getLineClass(item)"
                style="text-align: right;"
              >
                {{ formatCurrency(item.netChange) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <p v-else>No data available for the selected date range.</p>
  </div>
</template>

<script setup>
import axios from 'axios';
import {
  endOfMonth,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';
import { onMounted, ref } from 'vue';

const cashFlowStatements = ref([]);
const selectedDates = ref(null);
const selectedRange = ref(null);

const dateRanges = [
  { label: 'Month to Date', value: 'monthToDate' },
  { label: 'Year to Date', value: 'yearToDate' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
];

onMounted(() => {
  // Set default date range to 'Month to Date'
  selectedRange.value = dateRanges[0]; // Month to Date
  fetchCashFlowStatements();
});

async function fetchCashFlowStatements() {
  try {
    console.log('Fetching cash flow statements from backend');

    // Prepare query parameters
    const params = {};
    let startDate, endDate;

    if (selectedRange.value && selectedRange.value.value !== 'custom') {
      const today = new Date();
      switch (selectedRange.value.value) {
        case 'monthToDate':
          startDate = startOfMonth(today);
          endDate = today;
          break;
        case 'yearToDate':
          startDate = startOfYear(today);
          endDate = today;
          break;
        case 'lastMonth':
          const lastMonthDate = subMonths(today, 1);
          startDate = startOfMonth(lastMonthDate);
          endDate = endOfMonth(lastMonthDate);
          break;
      }
    } else if (selectedDates.value && selectedDates.value.length === 2) {
      [startDate, endDate] = selectedDates.value;
    }

    if (startDate && endDate) {
      params.startDate = formatDate(startDate);
      params.endDate = formatDate(endDate);
    }

    console.log('Request params:', params);

    // Manually construct the full URL with query parameters
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:3000/cash-flow${queryString ? '?' + queryString : ''}`;

    console.log('Full request URL:', url);

    const response = await axios.get(url);

    console.log('Cash flow statements response:', response.data);

    // Ensure response.data.value is an array
    if (response.data && Array.isArray(response.data.value)) {
      cashFlowStatements.value = response.data.value;
    } else if (Array.isArray(response.data)) {
      // If the data is directly an array
      cashFlowStatements.value = response.data;
    } else {
      console.error('Unexpected data structure:', response.data);
      cashFlowStatements.value = [];
    }

    console.log('Updated cashFlowStatements:', cashFlowStatements.value);
  } catch (error) {
    console.error('Error fetching cash flow statements:', error);
  }
}

function onDateRangeChange() {
  if (selectedRange.value && selectedRange.value.value !== 'custom') {
    selectedDates.value = null; // Reset custom date range if a predefined range is selected
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

// Function to format currency values
function formatCurrency(value) {
  const absValue = Math.abs(value);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const formattedValue = formatter.format(absValue);

  if (value < 0) {
    return `(${formattedValue})`; // Enclose negative amounts in parentheses
  } else {
    return formattedValue;
  }
}

// Function to determine CSS classes based on line type
function getLineClass(item) {
  let classes = [];
  if (item.lineType === 'header') {
    classes.push('header-line');
  } else if (item.lineType === 'total') {
    classes.push('total-line');
  } else if (item.lineType === 'detail') {
    classes.push('detail-line');
  }

  if (item.netChange < 0) {
    classes.push('negative-amount');
  }

  return classes.join(' ');
}
</script>

<style scoped>
/* Copy styles from Income.vue or adjust as needed */
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

.detail-line {
  /* Normal styling for detail lines */
}

.spacer-line {
  height: 15px;
}

.negative-amount {
  color: red;
}

.controls-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.controls-container > * {
  /* Allow components to shrink if necessary */
  flex-shrink: 0;
}
</style>