<!-- src/components/SpendByCategoryChart.vue -->
<template>
    <div class="chart-container">
      <h3>Spend by Category</h3>
      <div v-if="chartData" class="chart-wrapper">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="chart" />
      </div>
      <div v-else>
        <p>No spend data available for the selected period.</p>
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
  
  const totalSpend = computed(() => {
    return props.data.reduce((sum, item) => sum + item.totalAmount, 0);
  });
  
  const chartData = computed(() => {
    if (!props.data.length) {
      return null;
    }
  
    // Limit the number of categories displayed (e.g., top 10)
    const sortedData = [...props.data].sort((a, b) => b.totalAmount - a.totalAmount);
    const topCategories = sortedData.slice(0, 10);
  
    // Aggregate remaining categories into "Other"
    const otherTotal = sortedData.slice(10).reduce((sum, item) => sum + item.totalAmount, 0);
  
    const labels = topCategories.map((item) => item.category);
    const dataValues = topCategories.map((item) => item.totalAmount);
  
    if (otherTotal > 0) {
      labels.push('Other');
      dataValues.push(otherTotal);
    }
  
    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: generateColors(labels.length),
          hoverBackgroundColor: generateColors(labels.length, 0.8),
        },
      ],
    };
  });
  
  // Helper function to generate colors
  function generateColors(count, opacity = 1) {
    const baseColors = [
      '#297FB7', // Primary Blue
      '#FFB400', // Sunrise Yellow
      '#207FBF', // Morning Blue
      '#FF851B', // Complementary Orange
      '#3D9970', // Soft Green
      '#6A4C93', // Complementary Purple
      '#39A9DB', // Bright Teal
      '#FF9F40', // Additional color
      '#9966FF', // Additional color
      '#FF6384', // Additional color
    ];
    return baseColors.slice(0, count).map((color) => hexToRGBA(color, opacity));
  }
  
  function hexToRGBA(hex, opacity) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
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
            const percentage = ((value / totalSpend.value) * 100).toFixed(2);
  
            // Format value as currency
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value);
  
            return `${label}: ${formattedValue} (${percentage}%)`;
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
  
  .chart-wrapper {
    flex-grow: 1;
  }
  
  .chart {
    width: 100%;
    height: 100%;
  }
  
  .chart-container p {
    color: #595959;
  }
  </style>