<template>
  <div class="paytrack-overview">
    <!-- Stat Boxes Section -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Total AR with Percentage Change -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <StatBox 
          :value="totalAR" 
          title="Total Accounts Receivable"
          format="currency"
          :percentageChange="arChange"
          periodLabel="since last month"
          icon="pi-wallet"
          iconBgColor="bg-blue-100 dark:bg-blue-400/30"
          iconColor="text-blue-500 dark:text-blue-200"
        />
      </div>
      <!-- Percentage Late with Total Late Amount and Breakdown -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <StatBox 
          :value="percentageLate" 
          title="Percentage Late" 
          format="percentage"
          :subtitle="formattedTotalLateAmount"
          :bottomContent="breakdownContent"
          icon="pi-percentage"
          iconBgColor="bg-orange-100 dark:bg-orange-400/30"
          iconColor="text-orange-500 dark:text-orange-200"
        />
      </div>
      <!-- DSO StatBox -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <StatBox
          :value="averageDSO ? averageDSO.toFixed(2) : '-'"
          title="Current DSO"
          format="number"
          :percentageChange="dsoChange"
          periodLabel="since last period"
          icon="pi-calendar"
          iconBgColor="bg-cyan-100 dark:bg-cyan-400/30"
          iconColor="text-cyan-500 dark:text-cyan-200"
        />
      </div>
      <!-- Placeholder for another metric or stat box -->
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <!-- You can add another StatBox here if needed -->
      </div>
    </div>

   <!-- Top Customers with Highest Late Amounts -->
   <div class="mt-8">
      <h3 class="text-xl font-bold mb-4">Top Customers with Highest Late Amounts</h3>

      <div class="flex flex-wrap -mx-2">
        <div
          v-for="(customers, periodLabel) in topLateCustomers"
          :key="periodLabel"
          class="w-full md:w-1/3 px-2 mb-6"
        >
          <h4 class="text-lg font-semibold mb-2">{{ periodLabel }}</h4>
          <DataTable :value="customers" class="min-w-full bg-white">
            <Column field="customerName" header="Customer Name" sortable></Column>
            <Column field="amount" header="Amount" sortable>
              <template #body="{ data }">
                {{ formatCurrency(data.amount) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

<!-- DSO and Aging Summary Row -->
<div class="mt-8 flex flex-wrap -mx-2">
      <!-- Top 5 Customers with Highest DSO -->
      <div class="w-full md:w-2/5 px-2 mb-6">
        <h3 class="text-xl font-bold mb-4">Top 5 Customers with Highest DSO</h3>
        <DataTable :value="perCustomerDSO" class="min-w-full bg-white">
          <Column field="customerName" header="Customer Name" sortable></Column>
          <Column field="averageDSO" header="Average DSO (Days)" sortable>
            <template #body="{ data }">
              {{ data.averageDSO.toFixed(2) }}
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Accounts Receivable Aging Summary Chart -->
      <div class="w-full md:w-3/5 px-2 mb-6">
        <h3 class="text-xl font-bold mb-4">Accounts Receivable Aging Summary</h3>
        <div class="flex justify-center">
          <Chart 
            type="pie" 
            :data="agingSummaryChartData" 
            :options="chartOptions" 
            style="width: 500px; height: 400px;"
          />
        </div>
      </div>
    </div>
    <!-- Charts -->
    <div class="chart-section mt-8">
      <h3>AR Breakdown by Category</h3>
      <Chart type="bar" :data="arBreakdownData" :options="chartOptions" />
    </div>

    <div class="chart-section mt-8">
      <h3>Historical Trends</h3>
      <Chart type="line" :data="historicalTrendsData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, onMounted, ref } from 'vue';
import StatBox from '../components/StatBox.vue';
import { useAgingReportStore } from '../store/agingReportStore';
import { useBalanceSheetStore } from '../store/balanceSheetStore';

// Initialize stores
const agingStore = useAgingReportStore();
const balanceSheetStore = useBalanceSheetStore();

// Backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Reactive variables
const totalAR = ref(0);
const previousMonthAR = ref(0);
const percentageLate = ref(0);
const arChange = ref(0); // Change in AR percentage
const arBreakdownData = ref(null);
const historicalTrendsData = ref(null);
const agingSummaryChartData = ref(null); // Added variable
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
// Set selectedDate to the correct date (today's date in your case)
const selectedDate = ref(new Date()); // Update to the actual current date

// Variables for total late amount and late breakdown
const totalLateAmount = ref(0);
const lateBreakdown = ref({ period1: 0, period2: 0, period3: 0 });

// Reactive variable for top late customers
const topLateCustomers = ref({});

// DSO Variables
const perCustomerDSO = ref([]);
const averageDSO = ref(0);
const previousDSO = ref(0);
const dsoChange = computed(() => {
  if (previousDSO.value === 0) {
    // Handle the case where previous DSO is zero
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

  // Fetch DSO data
  await fetchDSOData();

  // Fetch per-customer DSO data
  await fetchPerCustomerDSOData();

  // Fetch top late customers data
  await fetchTopLateCustomers();
});

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

// Function to fetch aging report
async function fetchAgingReport() {
  const formattedDate = formatDate(selectedDate.value); // Use selectedDate for consistency
  try {
    await agingStore.fetchAgingReport(formattedDate);
  } catch (error) {
    console.error('Error fetching aging report:', error);
  }
}

// Fetch balance sheet data for today and one month ago
async function fetchBalanceSheetData() {
  try {
    const formattedDate = formatDate(selectedDate.value); // Format selectedDate
    const previousMonthDate = formatDate(getPreviousMonthDate(selectedDate.value)); // Get the previous month's date

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

// -------------------------------------------
// DSO Calculation Updates
// -------------------------------------------

/**
 * Fetches DSO metrics for the current and previous periods using the new backend endpoint.
 * Updates the average DSO and calculates the change.
 */
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
    const responseCurrent = await axios.get(`${backendUrl}/financial-dashboard/dso`, {
      params: {
        startDate: formattedStartDateCurrent,
        endDate: formattedEndDateCurrent,
      },
    });

    // Validate response data
    if (responseCurrent.data && typeof responseCurrent.data.dso === 'number') {
      averageDSO.value = responseCurrent.data.dso;
      console.log(`[${new Date().toLocaleTimeString()}] Fetched Current DSO:`, averageDSO.value);
    } else {
      console.warn('Invalid DSO data received for current period.');
      averageDSO.value = 0;
    }

    // Fetch DSO for previous period
    const responsePrevious = await axios.get(`${backendUrl}/financial-dashboard/dso`, {
      params: {
        startDate: formattedStartDatePrevious,
        endDate: formattedEndDatePrevious,
      },
    });

    // Validate response data
    if (responsePrevious.data && typeof responsePrevious.data.dso === 'number') {
      previousDSO.value = responsePrevious.data.dso;
      console.log(`[${new Date().toLocaleTimeString()}] Fetched Previous DSO:`, previousDSO.value);
    } else {
      console.warn('Invalid DSO data received for previous period.');
      previousDSO.value = 0;
    }

    // DSO Change is automatically computed via the computed property
  } catch (error) {
    console.error('Error fetching DSO data:', error);
    averageDSO.value = 0;
    previousDSO.value = 0;
  }
}

// Fetch per-customer DSO data
async function fetchPerCustomerDSOData() {
  try {
    // Define date ranges using selectedDate as the end date
    const endDateCurrent = new Date(selectedDate.value);
    const startDateCurrent = new Date(endDateCurrent);
    startDateCurrent.setDate(endDateCurrent.getDate() - 30); // Last 30 days

    const formattedStartDateCurrent = formatDate(startDateCurrent);
    const formattedEndDateCurrent = formatDate(endDateCurrent);

    const response = await axios.get(`${backendUrl}/financial-dashboard/dso-per-customer`, {
      params: {
        startDate: formattedStartDateCurrent,
        endDate: formattedEndDateCurrent,
      },
    });

    if (Array.isArray(response.data)) {
      perCustomerDSO.value = response.data.slice(0, 5); // Get top 5 customers
      console.log(`[${new Date().toLocaleTimeString()}] Fetched per-customer DSO data:`, perCustomerDSO.value);
    } else {
      console.warn('Invalid data received for per-customer DSO.');
      perCustomerDSO.value = [];
    }
  } catch (error) {
    console.error('Error fetching per-customer DSO data:', error);
    perCustomerDSO.value = [];
  }
}

// -------------------------------------------
// End of DSO Updates
// -------------------------------------------

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
.paytrack-overview {
  padding: 1rem;
}

.chart-section {
  margin-bottom: 2rem;
}
</style>