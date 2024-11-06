<!-- src/components/PaymentHistoryModal.vue -->
<template>
  <Drawer
    v-model:visible="modalVisible"
    position="full"
    :header="`Payment History for ${customerName}`"
    :dismissable="true"
    closable
    closeOnEscape
    class="bg-white p-6 shadow-lg flex flex-col"
  >
    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>
    <div v-else class="flex flex-col flex-1">
      <template v-if="error">
        <div class="text-center text-red-500 py-4">
          {{ error }}
        </div>
      </template>
      <template v-else>
        <!-- Credit Score Section -->
        <div v-if="creditScoreData" class="credit-score-section my-4">
          <h2 class="text-xl font-bold">Credit Score</h2>
          <div class="flex items-center mt-2">
            <div :class="['credit-score-badge', getCreditScoreClass(creditScore)]">
              {{ creditScore }}
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">
                Based on your payment history and outstanding balance.
              </p>
            </div>
          </div>
        </div>
  
        <!-- Factors Influencing Credit Score -->
        <div
          v-if="creditScoreData && creditScoreData.factors && isValidFactors(creditScoreData.factors)"
          class="factors-section my-4"
        >
          <h3 class="text-lg font-semibold">Factors Influencing Your Score</h3>
          <div class="grid grid-cols-3 gap-4 mt-2">
            <div class="stat-box">
              <p class="stat-value">
                {{ formatCurrency(creditScoreData.factors?.totalPurchaseAmount) }}
              </p>
              <p class="stat-label">Total Purchases</p>
            </div>
            <div class="stat-box">
              <p class="stat-value">
                {{ formatPercentage(creditScoreData.factors?.PTF) }}
              </p>
              <p class="stat-label">Payment Timeliness</p>
            </div>
            <div class="stat-box">
              <p class="stat-value">
                {{ formatCurrency(creditScoreData.factors?.outstandingBalance) }}
              </p>
              <p class="stat-label">Outstanding Balance</p>
            </div>
          </div>
        </div>
  
        <!-- Flex container for chart and table -->
        <div class="flex flex-col flex-1"> 
          <!-- Credit Score Trend Chart -->
          <div class="credit-score-trend my-4 flex-shrink-0"> 
            <h3 class="text-lg font-semibold">Credit Score Trend</h3>
            <div v-if="hasValidChartData">
              <canvas id="creditScoreChart"></canvas>
            </div>
            <div v-else class="text-center text-gray-500">
              No credit score data available to display.
            </div>
          </div>
  
          <!-- Payment Table - Flex-grow to take remaining space -->
          <div class="payment-table flex-grow overflow-auto">
            <DataTable
              :value="combinedData"
              paginator
              :rows="10"
              class="min-w-full bg-white"
              :loading="isLoading"
              :sortField="'sortDate'"
              :sortOrder="-1"
              :rowClass="rowClass"
            >
          <!-- Invoice Number Column -->
              <Column
                field="invoiceNumber"
                header="Invoice Number"
                sortable
                class="text-left px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  <Button
                    v-if="data && data.invoiceNumber"
                    label=""
                    class="apply-button p-button-link"
                    @click="openInvoiceModal(data.invoiceNumber)"
                  >
                    {{ data.invoiceNumber }}
                  </Button>
                  <span v-else>-</span>
                </template>
              </Column>
  
              <!-- Total Amount Column -->
              <Column
                field="amount"
                header="Total Amount"
                sortable
                class="text-right px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.amount ? formatCurrency(data.amount) : '-' }}
                </template>
              </Column>
  
              <!-- Amount Paid Column -->
              <Column
                field="amountPaid"
                header="Amount Paid"
                sortable
                class="text-right px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.amountPaid !== null ? formatCurrency(data.amountPaid) : '-' }}
                </template>
              </Column>
  
              <!-- Balance Column -->
              <Column
                field="amountRemaining"
                header="Balance"
                sortable
                class="text-right px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.amountRemaining !== null ? formatCurrency(data.amountRemaining) : '-' }}
                </template>
              </Column>
  
              <!-- Due Date Column -->
              <Column
                field="dueDate"
                header="Due Date"
                sortable
                class="text-left px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.dueDate ? formatDate(data.dueDate) : '-' }}
                </template>
              </Column>
  
              <!-- Payment Date Column -->
              <Column
                field="paymentDate"
                header="Payment Date"
                sortable
                class="text-left px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.paymentDate ? formatDate(data.paymentDate) : '-' }}
                </template>
              </Column>
  
              <!-- Type Column -->
              <Column
                field="type"
                header="Type"
                sortable
                class="text-left px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  {{ data && data.type ? data.type : '-' }}
                </template>
              </Column>
  
              <!-- Status Column -->
              <Column
                field="status"
                header="Status"
                sortable
                class="text-left px-4 py-2 border-b"
              >
                <template #body="{ data }">
                  <span :class="['status-label', getStatusClass(data)]">
                    {{ data && data.status ? data.status : '-' }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </template>
    </div>
  
    <!-- Invoice Modal -->
    <InvoiceModal
      :visible="isInvoiceModalVisible"
      @update:visible="(value) => (isInvoiceModalVisible = value)"
      :invoiceNumber="selectedInvoiceNumber"
    />
  </Drawer>
  </template>
  
<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { usePaymentHistoryStore } from '../store/paymentHistoryStore';
import InvoiceModal from './InvoiceModal.vue';

// PrimeVue Components
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Drawer from 'primevue/drawer';

// Import and register Chart.js components
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  customerNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update:visible']);

// State for the Invoice Modal
const isInvoiceModalVisible = ref(false);
const selectedInvoiceNumber = ref('');

// Store
const paymentHistoryStore = usePaymentHistoryStore();

// Computed properties
const payments = computed(() => paymentHistoryStore.payments || []);
const unpaidInvoices = computed(() => paymentHistoryStore.unpaidInvoices || []);
const partiallyPaidInvoices = computed(() => paymentHistoryStore.partiallyPaidInvoices || []);
const isLoading = computed(() => paymentHistoryStore.isLoading);
const error = computed(() => paymentHistoryStore.error);
const creditScoreData = computed(() => paymentHistoryStore.creditScoreData);
const creditScoreHistory = computed(() => paymentHistoryStore.creditScoreHistory);
const creditScore = computed(() => {
  const score = creditScoreData.value?.creditScore;
  return score != null && !isNaN(score) ? score : 'N/A';
});

// Check if there is valid chart data
const hasValidChartData = computed(() => {
  return (
    creditScoreHistory.value &&
    creditScoreHistory.value.some((item) => item.creditScore != null && !isNaN(item.creditScore))
  );
});

// Combined data
const combinedData = computed(() => {
  try {
    const paymentRecords = payments.value.flatMap((payment) =>
      (payment.relatedInvoices || []).map((invoice) => {
        const dueDateStr = invoice.dueDate || null;
        const paymentDateStr = payment.paymentDate || null;

        const dueDate = dueDateStr ? new Date(dueDateStr) : null;
        const paymentDate = paymentDateStr ? new Date(paymentDateStr) : null;

        // Determine payment status
        let status = 'Paid';
        if (dueDate && paymentDate) {
          if (paymentDate <= dueDate) {
            status = 'Paid: On-time';
          } else {
            status = 'Paid: Late';
          }
        }

        return {
          invoiceNumber: invoice.invoiceNumber,
          amount: Math.abs(invoice.amount),
          amountPaid: Math.abs(invoice.amount),
          amountRemaining: 0,
          dueDate: dueDateStr,
          paymentDate: paymentDateStr,
          sortDate: dueDateStr || paymentDateStr,
          type: 'Payment',
          status: status,
        };
      })
    );

    const unpaidInvoiceRecords = unpaidInvoices.value.map((invoice) => ({
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.totalAmount,
      amountPaid: invoice.amountPaid || 0,
      amountRemaining: invoice.amountRemaining || invoice.totalAmount,
      dueDate: invoice.dueDate,
      paymentDate: null,
      sortDate: invoice.dueDate,
      type: 'Invoice',
      status: 'Unpaid',
    }));

    const partiallyPaidInvoiceRecords = partiallyPaidInvoices.value.map((invoice) => ({
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      amountRemaining: invoice.amountRemaining,
      dueDate: invoice.dueDate,
      paymentDate: null,
      sortDate: invoice.dueDate,
      type: 'Invoice',
      status: 'Partially Paid',
    }));

    // Combine all records
    const result = [...unpaidInvoiceRecords, ...partiallyPaidInvoiceRecords, ...paymentRecords];

    // Sort by 'sortDate' descending
    result.sort((a, b) => {
      const dateA = new Date(a.sortDate || 0);
      const dateB = new Date(b.sortDate || 0);
      return dateB - dateA;
    });

    console.log('Combined Data:', result);
    return result;
  } catch (error) {
    console.error('Error in combinedData computation:', error);
    return [];
  }
});

// Dialog visibility
const modalVisible = ref(props.visible);

watch(
  () => props.visible,
  (newValue) => {
    modalVisible.value = newValue;
  }
);

watch(
  () => modalVisible.value,
  (newValue) => {
    emit('update:visible', newValue);
  }
);

// Initialize the credit score chart
let creditScoreChart = null;

// Function to initialize or update the chart
function updateCreditScoreChart() {
  if (hasValidChartData.value) {
    // Destroy previous chart instance if exists
    if (creditScoreChart) {
      creditScoreChart.destroy();
    }

    // Filter out invalid data points
    const validData = creditScoreHistory.value.filter(
      (item) => item.creditScore != null && !isNaN(item.creditScore)
    );

    const ctx = document.getElementById('creditScoreChart').getContext('2d');

    // Find min and max credit scores for dynamic scaling
    const creditScores = validData.map((item) => item.creditScore);
    const minScore = Math.min(...creditScores);
    const maxScore = Math.max(...creditScores);

    // Add some padding to min and max for better visualization
    const yMin = Math.floor(minScore / 50) * 50 - 50; // Round down to nearest 50 and subtract 50
    const yMax = Math.ceil(maxScore / 50) * 50 + 50;  // Round up to nearest 50 and add 50

    const canvas = document.getElementById('creditScoreChart');
canvas.width = 400; // Adjust width
canvas.height = 50; // Adjust height

creditScoreChart = new Chart(canvas.getContext('2d'), {
  type: 'line',
  data: {
    labels: validData.map((item) => item.date),
    datasets: [
      {
        label: 'Credit Score',
        data: validData.map((item) => item.creditScore),
        borderColor: '#3182ce',
        backgroundColor: 'rgba(49, 130, 206, 0.2)',
        fill: true,
        tension: 0.4, // For smooth curves
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Date' },
      },
      y: {
        display: true,
        title: { display: true, text: 'Credit Score' },
        min: yMin >= 0 ? yMin : 0,
        max: yMax,
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  },
});
  }
}

// Watch for visibility changes to fetch data
watch(
  () => modalVisible.value,
  (newValue) => {
    if (newValue) {
      // Fetch payment history
      paymentHistoryStore.fetchPaymentHistory(props.customerNumber).then(() => {
        console.log('Payments:', payments.value);
        console.log('Unpaid Invoices:', unpaidInvoices.value);
        console.log('Partially Paid Invoices:', partiallyPaidInvoices.value);
        console.log('Combined Data:', combinedData.value);
      });

      // Fetch credit score
      paymentHistoryStore.fetchCreditScore(props.customerNumber);

      // Fetch credit score history
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      paymentHistoryStore
        .fetchCreditScoreHistory(
          props.customerNumber,
          startDate.toISOString().split('T')[0],
          endDate
        )
        .then(() => {
          // Update the chart after fetching data and DOM is updated
          nextTick(() => {
            updateCreditScoreChart();
          });
        });
    }
  },
  { immediate: true }
);

// Methods
function formatCurrency(value) {
  if (value == null || isNaN(value)) {
    return 'N/A';
  }
  const amount = Number(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatPercentage(value) {
  if (value == null || isNaN(value)) {
    return 'N/A';
  }
  return `${value.toFixed(2)}%`;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isValidFactors(factors) {
  return (
    factors &&
    typeof factors.totalPurchaseAmount === 'number' &&
    typeof factors.PTF === 'number' &&
    typeof factors.outstandingBalance === 'number'
  );
}

function getStatusClass(data) {
  if (!data || !data.status) return '';
  if (data.status === 'Unpaid') return 'status-unpaid';
  if (data.status === 'Partially Paid') return 'status-partially-paid';
  if (data.status === 'Paid: On-time') return 'status-paid-on-time';
  if (data.status === 'Paid: Late') return 'status-paid-late';
  if (data.status === 'Paid') return 'status-paid';
  return 'status-default';
}

function getCreditScoreClass(score) {
  if (score >= 750) return 'credit-score-excellent';
  if (score >= 700) return 'credit-score-good';
  if (score >= 650) return 'credit-score-fair';
  if (score >= 600) return 'credit-score-poor';
  return 'credit-score-bad';
}

function openInvoiceModal(invoiceNumber) {
  selectedInvoiceNumber.value = invoiceNumber;
  isInvoiceModalVisible.value = true;
}

function rowClass(data) {
  return '';
}
</script>


<style scoped>


.apply-button {
  color: #297fb7 !important;
}

.apply-button:hover {
  color: #ffffff !important;
}

/* Status Labels */
.status-label {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  display: inline-block;
}

/* Set text color within each status class */
.status-unpaid {
  background-color: #f56565; /* Red */
  color: #fff;
}

.status-partially-paid {
  background-color: #d69e2e; /* Yellow */
  color: #fff;
}

.status-paid-on-time {
  background-color: #48bb78; /* Green */
  color: #fff;
}

.status-paid-late {
  background-color: #ed8936; /* Orange */
  color: #fff;
}

.status-paid {
  background-color: #48bb78; /* Green */
  color: #fff;
}

.status-default {
  color: #000; /* Default text color */
}

/* Credit Score Styles */
.credit-score-badge {
  font-size: 2rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #fff;
}

.credit-score-excellent {
  background-color: #38a169; /* Green */
}

.credit-score-good {
  background-color: #48bb78; /* Light Green */
}

.credit-score-fair {
  background-color: #ed8936; /* Orange */
}

.credit-score-poor {
  background-color: #e53e3e; /* Red */
}

.credit-score-bad {
  background-color: #9b2c2c; /* Dark Red */
}

/* Stat Boxes */
.stat-box {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.875rem;
  color: #4a5568;
}

/* Credit Score Trend */
.credit-score-trend {
  /* Removed height: auto; */
  flex-shrink: 0; /* Prevent shrinking */
  /* Optionally set a fixed height */
  height: 300px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#creditScoreChart {
  width: 100%;
  height: 100%; /* Ensures it fills the container */
}

.payment-table {
  /* max-height: 300px; */ /* Removed max-height */
  flex-grow: 1; /* Allow the table to grow */
  overflow-y: auto; /* Ensure the table can scroll if needed */
}

@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr; /* Stack columns vertically on small screens */
  }

  .stat-box {
    margin-bottom: 1rem; /* Add space between stacked boxes */
  }
}

.credit-score-badge {
  font-size: 2rem; /* Adjust as needed */
  /* Add responsive font size */
}

@media (max-width: 768px) {
  .credit-score-badge {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}
</style>
