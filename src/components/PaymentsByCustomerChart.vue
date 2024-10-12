<!-- src/components/PaymentsByCustomerChart.vue -->
<template>
  <div class="chart-container">
    <!-- Header with Title and "View All Payments" Button -->
    <div class="chart-header">
      <h3>Payments by Customer</h3>
      <Button
        label="View All Payments"
        icon="pi pi-table"
        class="view-all-button"
        @click="showModal"
      />
    </div>

    <div class="chart-wrapper">
      <Chart
        ref="chartRef"
        :type="chartType"
        :data="chartData"
        :options="chartOptions"
        class="chart"
      />
    </div>
    
    <!-- Include the Modal Component -->
    <PaymentsByCustomerModal
      :visible.sync="isModalVisible"
      :paymentsData="props.paymentsByCustomer"
    />
  </div>
</template>

<script setup>
import { Chart as ChartJS, registerables } from 'chart.js';
import Button from 'primevue/button';
import Chart from 'primevue/chart';
import { computed, ref } from 'vue';
import PaymentsByCustomerModal from './PaymentsByCustomerModal.vue';

// Register Chart.js components
ChartJS.register(...registerables);

const props = defineProps({
  paymentsByCustomer: {
    type: Array,
    default: () => [],
  },
});

const isModalVisible = ref(false);

function showModal() {
  isModalVisible.value = true;
}

const chartType = 'bar';
const chartData = computed(() => {
  if (!props.paymentsByCustomer.length) {
    return null;
  }

  // Sort payments by amount in descending order
  const sortedData = [...props.paymentsByCustomer].sort((a, b) => b.amount - a.amount);

  // Get Top 15 Payments
  const topPayments = sortedData.slice(0, 15);

  // Aggregate Remaining Payments
  const otherPaymentsTotal = sortedData.slice(15).reduce((sum, item) => sum + item.amount, 0);
  if (otherPaymentsTotal > 0) {
    topPayments.push({
      customer: 'Other Payments',
      amount: otherPaymentsTotal,
    });
  }

  // Define an array of colors for the bars using branding palette
  const colors = [
    '#297FB7', // Primary Blue (Replaced Sunrise Yellow)
    '#207FBF', // Morning Blue
    '#08294A', // Night Sky
    '#1F5F8A', // Darker Blue
    '#FF851B', // Complementary Orange
    '#3D9970', // Soft Green
    '#6A4C93', // Complementary Purple
    '#FF8080', // Tint 1 of Horizon Red
    '#A30000', // Shade 1 of Horizon Red
    '#595959', // Dark Gray
    '#39A9DB', // Bright Teal
    '#FF9F40', // Additional color
    '#9966FF', // Additional color
    '#FF6384', // Additional color
    '#36A2EB', // Additional color
  ];

  return {
    labels: topPayments.map((item) => item.customer),
    datasets: [
      {
        label: 'Payments Received',
        data: topPayments.map((item) => item.amount),
        backgroundColor: topPayments.map((_, index) => colors[index % colors.length]),
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: '#595959', // Dark Gray for x-axis ticks
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        color: '#595959', // Dark Gray for y-axis labels
        autoSkip: false,
        maxTicksLimit: 20,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
}));
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F7F9FC; /* Light background for charts */
  border: 1px solid #E0E0E0; /* Light border to match dashboard styling */
  border-radius: 8px;
  padding: 1rem;
}

/* Header Styling */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Title Styling */
.chart-header h3 {
  margin: 0;
  color: #08294A; /* Night Sky for titles */
  font-weight: 600;
  font-size: 1.40rem;
}

/* "View All Payments" Button Styling */
.view-all-button {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
  padding: 0.25rem 0.5rem; /* Reduced padding for smaller size */
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.875rem; /* Reduced font size */
  cursor: pointer;
}

/* Hover State */
.view-all-button:hover {
  background-color: #297FB7 !important;
  color: #FFFFFF !important;
}

/* Active State */
.view-all-button:active {
  background-color: #08294A!important;
}

/* Disabled State */
.view-all-button:disabled {
  background-color: #D3D3D3 !important; /* Light Gray for disabled state */
  color: #A6A6A6 !important; /* Neutral Gray text */
  cursor: not-allowed;
}

/* Icon Adjustment */
.view-all-button .pi {
  margin-right: 0.3rem;
}

/* Chart Wrapper */
.chart-wrapper {
  flex-grow: 1;
}

.chart {
  width: 100%;
  height: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .global-search {
    width: 100%;
  }

  /* Adjust header layout on smaller screens */
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-all-button {
    margin-top: 0.5rem;
    width: 100%;
  }

  .chart-header h3 {
    font-size: 1.5rem;
  }
}
</style>
