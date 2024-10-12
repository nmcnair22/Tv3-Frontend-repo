<!-- src/components/RevenueByCategoryChart.vue -->

<template>
  <div class="chart-container">
    <h3>Revenue by Category</h3>
    <div v-if="chartData" class="chart-wrapper">
      <Chart type="pie" :data="chartData" :options="chartOptions" class="chart" />
    </div>
    <div v-else>
      <p>No revenue data available.</p>
    </div>
  </div>
</template>

<script setup>
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import Chart from 'primevue/chart';
import { computed } from 'vue';

// Register necessary Chart.js components without ChartDataLabels
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  revenueCategories: {
    type: Array,
    default: () => [],
  },
});

const totalRevenue = computed(() => {
  return props.revenueCategories.reduce((sum, item) => sum + item.amount, 0);
});

const chartData = computed(() => {
  if (!props.revenueCategories || !props.revenueCategories.length) {
    return null;
  }

  return {
    labels: props.revenueCategories.map((item) => item.category),
    datasets: [
      {
        data: props.revenueCategories.map((item) => item.amount),
        backgroundColor: [
          '#08294A', // Night Sky
          '#207FBF', // Morning Blue
          '#FFB400', // Sunrise Yellow
          '#F29000', // Shade 2 of Sunrise Yellow
          '#5D7896', // Tint 2 of Night Sky
          '#6A4C93', // Complementary Purple
          '#39A9DB', // Complementary Teal
        ],
        hoverBackgroundColor: [
          '#1B3D62', // Tint 1 of Night Sky
          '#5D7896', // Tint 2 of Night Sky
          '#FFCC66', // Shade 1 of Sunrise Yellow
          '#F29000', // Shade 2 of Sunrise Yellow
          '#08294A', // Night Sky
          '#AB47BC', // Additional color
          '#26C6DA', // Additional color
        ],
      },
    ],
  };
});

// Define chart options without datalabels plugin
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: '#595959',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const label = tooltipItem.label || '';
          const value = tooltipItem.parsed;
          const percentage = ((value / totalRevenue.value) * 100).toFixed(2);
          return `${label}: $${value} (${percentage}%)`;
        },
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

.chart-container h3 {
  margin-bottom: 1rem;
  color: #08294A;
  font-weight: 600;
  font-size: 1.40rem;
}

.chart-wrapper {
  flex-grow: 1;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-container p {
  color: #595959; /* Dark Gray for 'No data' message */
}
</style>
