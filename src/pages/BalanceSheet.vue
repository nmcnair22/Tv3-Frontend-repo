<!-- BalanceSheet.vue -->

<template>
    <div>
      <h1>Balance Sheet Report</h1>
  
      <!-- Date Picker Control -->
      <div class="controls-container">
        <DatePicker
          v-model="selectedDate"
          dateFormat="yy-mm-dd"
          placeholder="Select Date"
          showIcon
          style="width: 200px;"
        />
        <Button
          label="Run Report"
          @click="fetchBalanceSheetStatements"
          icon="pi pi-refresh"
          class="p-button-primary"
          :disabled="isLoading"
        />
      </div>
  
      <!-- Loading Indicator -->
      <div v-if="isLoading">
        <p>Loading Balance Sheet...</p>
      </div>
  
      <!-- Error Message -->
      <div v-if="errorMessage">
        <p class="error">{{ errorMessage }}</p>
      </div>
  
      <!-- Balance Sheet Report Table -->
      <div v-if="!isLoading && balanceSheetStatements && balanceSheetStatements.length">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in balanceSheetStatements"
              :key="item.id || index"
            >
              <tr v-if="item.lineType.toLowerCase() === 'spacer'">
                <td colspan="2" class="spacer-line"></td>
              </tr>
              <tr v-else>
                <td
                  :class="getLineClass(item)"
                  :style="{ paddingLeft: item.indentation * 20 + 'px' }"
                >
                  {{ item.display }}
                </td>
                <td :class="getLineClass(item)" style="text-align: right;">
                  {{ formatCurrency(item.balance) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <p v-else-if="!isLoading && !errorMessage">No data available for the selected date.</p>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import { onMounted, ref } from 'vue';
  
  const balanceSheetStatements = ref([]);
  const selectedDate = ref(null);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  onMounted(() => {
    // Set default date to today
    selectedDate.value = new Date();
    fetchBalanceSheetStatements();
  });
  
  async function fetchBalanceSheetStatements() {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      console.log('Fetching balance sheet statements from backend');
  
      // Prepare query parameters
      const params = {};
      let date;
  
      if (selectedDate.value) {
        date = formatDate(selectedDate.value);
        params.date = date;
      }
  
      console.log('Request params:', params);
  
      // Manually construct the full URL with query parameters
      const queryString = new URLSearchParams(params).toString();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const url = `${backendUrl}/balance-sheet${queryString ? '?' + queryString : ''}`;
  
      console.log('Full request URL:', url);
  
      const response = await axios.get(url);
  
      console.log('Balance sheet statements response:', response.data);
  
      // Ensure response.data.value is an array
      if (response.data && Array.isArray(response.data.value)) {
        balanceSheetStatements.value = response.data.value;
      } else if (Array.isArray(response.data)) {
        // If the data is directly an array
        balanceSheetStatements.value = response.data;
      } else {
        console.error('Unexpected data structure:', response.data);
        balanceSheetStatements.value = [];
        errorMessage.value = 'Unexpected data format received from the server.';
      }
  
      console.log(
        'Updated balanceSheetStatements:',
        balanceSheetStatements.value,
      );
    } catch (error) {
      console.error('Error fetching balance sheet statements:', error);
      errorMessage.value = 'Unable to load Balance Sheet data. Please try again later.';
    } finally {
      isLoading.value = false;
    }
  }
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  // Function to format currency values
  function formatCurrency(value) {
    if (typeof value !== 'number') {
      return '$0.00';
    }
  
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
    const lineType = item.lineType.toLowerCase();
  
    if (lineType === 'header') {
      classes.push('header-line');
    } else if (lineType === 'total') {
      classes.push('total-line');
    } else if (lineType === 'detail') {
      classes.push('detail-line');
    }
  
    if (item.balance < 0) {
      classes.push('negative-amount');
    }
  
    return classes.join(' ');
  }
  </script>
  
  <style scoped>
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
  
  .error {
    color: red;
    font-weight: bold;
  }
  </style>
  