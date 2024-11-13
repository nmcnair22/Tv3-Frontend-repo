<!-- src/components/CreditScoreHistoryChart.vue -->
<template>
    <div class="chart-container">
      <h3>Credit Score History</h3>
      <div v-if="data.length">
        <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />
      </div>
      <div v-else>
        <p>No credit score history data available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import Chart from 'primevue/chart';
import { computed } from 'vue';
  
  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });
  
  const chartData = computed(() => {
    return {
      labels: props.data.map((item) => item.date),
      datasets: [
        {
          label: 'Credit Score',
          data: props.data.map((item) => item.creditScore),
          borderColor: '#297FB7',
          fill: false,
          tension: 0.1,
        },
      ],
    };
  });
  
  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: '#595959',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: '#595959',
        },
        grid: {
          color: '#E0E0E0',
        },
      },
    },
  }));
  </script>
  
  <style scoped>
  .chart-container {
    height: 100%;
    background-color: #F7F9FC;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .chart-container h3 {
    margin-bottom: 1rem;
    color: #08294A;
    font-weight: 600;
    font-size: 1.4rem;
  }
  
  .chart {
    width: 100%;
    height: 100%;
  }
  </style>