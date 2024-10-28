<template>
  <!-- Same as your old working version -->
  <!-- ... -->
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useAgingReportStore } from '../store/agingReportStore';
import { useBalanceSheetStore } from '../store/balanceSheetStore';
import { useDSOStore } from '../store/dsoStore'; // Import the DSO store

// Initialize stores
const agingStore = useAgingReportStore();
const balanceSheetStore = useBalanceSheetStore();
const dsoStore = useDSOStore(); // Initialize DSO store

// Backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Reactive variables
const totalAR = ref(0);
const previousMonthAR = ref(0);
const percentageLate = ref(0);
const arChange = ref(0); // Change in AR percentage
const arBreakdownData = ref(null);
const historicalTrendsData = ref(null);
const agingSummaryChartData = ref(null);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Set selectedDate to the current date
const selectedDate = ref(new Date());

// Variables for total late amount and late breakdown
const totalLateAmount = ref(0);
const lateBreakdown = ref({ period1: 0, period2: 0, period3: 0 });

// Reactive variable for top late customers
const topLateCustomers = ref({});

// DSO Variables using the DSO Store
const averageDSO = computed(() => dsoStore.averageDSO);
const previousDSO = computed(() => dsoStore.previousDSO);
const perCustomerDSO = computed(() => dsoStore.perCustomerDSO);
const dsoChange = computed(() => {
  if (previousDSO.value === 0) {
    return averageDSO.value === 0 ? 0 : 100;
  }
  return ((averageDSO.value - previousDSO.value) / previousDSO.value) * 100;
});

// Computed properties for formatted values
const formattedTotalLateAmount = computed(() => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalLateAmount.value);
});

// Update the labels to match the actual aging periods
const breakdownContent = computed(() => {
  return [
    `30+: ${lateBreakdown.value.period1.toFixed(2)}%`,
    `60+: ${lateBreakdown.value.period2.toFixed(2)}%`,
    `90+: ${lateBreakdown.value.period3.toFixed(2)}%`,
  ];
});

// Add formatCurrency function
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

// Lifecycle hook: Fetch data when the component is mounted
onMounted(async () => {
  console.log(`[${new Date().toLocaleTimeString()}] Component Mounted`);

  // Fetch aging report using selectedDate
  await fetchAgingReport();
  console.log(`[${new Date().toLocaleTimeString()}] Aging Report fetched:`, agingStore.agingReport);

  // Fetch balance sheet data and update totalAR
  await fetchBalanceSheetData();

  // Process additional aging data
  processAgingData();

  // Fetch DSO data using the DSO store
  await fetchDSOData();

  // Fetch per-customer DSO data using the DSO store
  await fetchPerCustomerDSOData();

  // Fetch top late customers data
  await fetchTopLateCustomers();
});

// Function to fetch aging report
async function fetchAgingReport() {
  const formattedDate = formatDate(selectedDate.value);
  try {
    await agingStore.fetchAgingReport(formattedDate);
  } catch (error) {
    console.error('Error fetching aging report:', error);
  }
}

// Fetch balance sheet data for today and one month ago
async function fetchBalanceSheetData() {
  try {
    const formattedDate = formatDate(selectedDate.value);
    const previousMonthDate = formatDate(getPreviousMonthDate(selectedDate.value));

    // Fetch balance sheet for current date
    console.log(`[${new Date().toLocaleTimeString()}] Fetching balance sheet for date: ${formattedDate}`);
    await balanceSheetStore.fetchBalanceSheet(formattedDate);

    // Update totalAR with the current balance sheet data
    const arLine = balanceSheetStore.balanceSheet.find((item) => item.display === 'Total Accounts Receivable');
    if (arLine) {
      totalAR.value = arLine.balance;
      console.log(`[${new Date().toLocaleTimeString()}] Fetched Total AR:`, totalAR.value);
    }

    // Fetch balance sheet for the previous month
    console.log(`[${new Date().toLocaleTimeString()}] Fetching balance sheet for previous month: ${previousMonthDate}`);
    await balanceSheetStore.fetchBalanceSheet(previousMonthDate);

    // Update previousMonthAR with the previous month's balance sheet data
    const prevMonthARLine = balanceSheetStore.balanceSheet.find((item) => item.display === 'Total Accounts Receivable');
    if (prevMonthARLine) {
      previousMonthAR.value = prevMonthARLine.balance;
    }

    // Calculate AR change
    calculateARChange();
  } catch (error) {
    console.error('Error fetching balance sheet data:', error);
  }
}

// Calculate AR change between current month and previous month
function calculateARChange() {
  if (previousMonthAR.value && totalAR.value) {
    arChange.value = ((totalAR.value - previousMonthAR.value) / previousMonthAR.value) * 100;
    console.log(`[${new Date().toLocaleTimeString()}] AR Change calculated:`, arChange.value);
  } else {
    arChange.value = 0;
  }
}

// Utility functions to format date and get previous month's date
function formatDate(date) {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

function getPreviousMonthDate(date) {
  const prevMonth = new Date(date);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
}

// Process aging data for other metrics like percentageLate
function processAgingData() {
  percentageLate.value = calculatePercentageLate();
  arBreakdownData.value = generateARBreakdownChartData();
  historicalTrendsData.value = generateHistoricalTrendsData();

  // Calculate late amount breakdown
  lateBreakdown.value = calculateLateBreakdown();

  // Generate Aging Summary Chart Data
  agingSummaryChartData.value = generateAgingSummaryChartData();
}

// Calculate percentage late and total late amount
function calculatePercentageLate() {
  const totalLate = agingStore.agingReport
    .filter((item) => item.customerId !== '00000000-0000-0000-0000-000000000000') // Exclude "Total" entry
    .reduce(
      (sum, item) =>
        sum + item.period1Amount + item.period2Amount + item.period3Amount,
      0
    );
  totalLateAmount.value = totalLate;
  return totalAR.value === 0 ? 0 : (totalLate / totalAR.value) * 100;
}

// Calculate the breakdown of late amounts by period
function calculateLateBreakdown() {
  const totalLate = totalLateAmount.value;

  if (totalLate === 0) {
    return { period1: 0, period2: 0, period3: 0 };
  }

  const filteredAgingReport = agingStore.agingReport.filter(
    (item) => item.customerId !== '00000000-0000-0000-0000-000000000000'
  );

  const sumPeriod1 = filteredAgingReport.reduce(
    (sum, item) => sum + item.period1Amount,
    0
  );
  const sumPeriod2 = filteredAgingReport.reduce(
    (sum, item) => sum + item.period2Amount,
    0
  );
  const sumPeriod3 = filteredAgingReport.reduce(
    (sum, item) => sum + item.period3Amount,
    0
  );

  return {
    period1: (sumPeriod1 / totalLate) * 100,
    period2: (sumPeriod2 / totalLate) * 100,
    period3: (sumPeriod3 / totalLate) * 100,
  };
}

// Function to generate Aging Summary Chart Data
function generateAgingSummaryChartData() {
  const agingTotals = {
    current: 0,
    period1: 0,
    period2: 0,
    period3: 0,
  };

  const filteredAgingReport = agingStore.agingReport.filter(
    (item) => item.customerId !== '00000000-0000-0000-0000-000000000000'
  );

  filteredAgingReport.forEach((item) => {
    agingTotals.current += item.currentAmount || 0;
    agingTotals.period1 += item.period1Amount || 0;
    agingTotals.period2 += item.period2Amount || 0;
    agingTotals.period3 += item.period3Amount || 0;
  });

  return {
    labels: ['Current', '30+ Days', '60+ Days', '90+ Days'],
    datasets: [
      {
        data: [
          agingTotals.current,
          agingTotals.period1,
          agingTotals.period2,
          agingTotals.period3,
        ],
        backgroundColor: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'],
      },
    ],
  };
}

// Fetch DSO data using the DSO store
async function fetchDSOData() {
  try {
    // Define date ranges using selectedDate as the end date
    const endDateCurrent = new Date(selectedDate.value);
    const startDateCurrent = new Date(endDateCurrent);
    startDateCurrent.setDate(endDateCurrent.getDate() - 30); // Last 30 days

    const endDatePrevious = new Date(startDateCurrent);
    endDatePrevious.setDate(startDateCurrent.getDate() - 1); // Day before current period starts
    const startDatePrevious = new Date(endDatePrevious);
    startDatePrevious.setDate(endDatePrevious.getDate() - 30); // Previous 30 days

    const formattedStartDateCurrent = formatDate(startDateCurrent);
    const formattedEndDateCurrent = formatDate(endDateCurrent);

    const formattedStartDatePrevious = formatDate(startDatePrevious);
    const formattedEndDatePrevious = formatDate(endDatePrevious);

    // Fetch DSO for current period
    await dsoStore.fetchCurrentDSO(formattedStartDateCurrent, formattedEndDateCurrent);

    // Fetch DSO for previous period
    await dsoStore.fetchPreviousDSO(formattedStartDatePrevious, formattedEndDatePrevious);
  } catch (error) {
    console.error('Error fetching DSO data:', error);
  }
}

// Fetch per-customer DSO data using the DSO store
async function fetchPerCustomerDSOData() {
  try {
    const endDateCurrent = new Date(selectedDate.value);
    const startDateCurrent = new Date(endDateCurrent);
    startDateCurrent.setDate(endDateCurrent.getDate() - 30); // Last 30 days

    const formattedStartDateCurrent = formatDate(startDateCurrent);
    const formattedEndDateCurrent = formatDate(endDateCurrent);

    await dsoStore.fetchPerCustomerDSO(formattedStartDateCurrent, formattedEndDateCurrent);
  } catch (error) {
    console.error('Error fetching per-customer DSO data:', error);
  }
}

/**
 * Generates data for the AR Breakdown chart.
 * @returns Chart data object.
 */
function generateARBreakdownChartData() {
  return {
    labels: agingStore.agingReport.map((item) => item.name),
    datasets: [
      {
        label: 'AR Amount',
        data: agingStore.agingReport.map((item) => item.balanceDue),
        backgroundColor: '#42A5F5',
      },
    ],
  };
}

/**
 * Generates data for the Historical Trends chart.
 * @returns Chart data object.
 */
function generateHistoricalTrendsData() {
  return {
    labels: ['January', 'February', 'March', 'April'], // Replace with dynamic data as needed
    datasets: [
      {
        label: 'Historical AR',
        data: [30000, 25000, 27000, 32000], // Example data
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };
}

// Fetch top late customers data
async function fetchTopLateCustomers() {
  try {
    const formattedDate = formatDate(selectedDate.value);
    const response = await axios.get(`${backendUrl}/financial-dashboard/top-late-customers`, {
      params: {
        asOfDate: formattedDate,
      },
    });

    if (response.data) {
      topLateCustomers.value = response.data;
      console.log(`[${new Date().toLocaleTimeString()}] Fetched top late customers:`, topLateCustomers.value);
    } else {
      console.warn('Invalid data received for top late customers.');
      topLateCustomers.value = {};
    }
  } catch (error) {
    console.error('Error fetching top late customers:', error);
    topLateCustomers.value = {};
  }
}
</script>

<style scoped>
/* Same as your old working version */
</style>
