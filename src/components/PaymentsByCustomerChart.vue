<!-- src/components/PaymentsByCustomerChart.vue -->
<template>
  <div class="chart-container">
    <h3>Payments by Customer</h3>
    <Chart
      ref="chartRef"
      :type="chartType"
      :data="chartData"
      :options="chartOptions"
      class="chart"
    />
    <Button
      label="View All Payments"
      icon="pi pi-table"
      class="p-button-text view-all-button"
      @click="showModal"
    />

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

const chartType = 'bar'; // Use 'bar' type
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

  // Define an array of colors for the bars
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56',
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
  indexAxis: 'y', // Set index axis to 'y' for horizontal bar chart
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: '#6B7280', // Text color for x-axis ticks
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        color: '#6B7280', // Text color for y-axis labels
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
}

.chart-container h3 {
  margin-bottom: 1rem;
}

.chart {
  flex-grow: 1; /* Allow the chart to fill the available space */
}

.view-all-button {
  margin-top: 1rem;
  align-self: flex-end; /* Position the button at the bottom right */
}
</style>