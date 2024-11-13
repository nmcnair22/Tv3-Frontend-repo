<!-- src/components/SpendTrendChart.vue -->
<template>
    <div class="chart-container">
      <h3>Monthly Spend Trend</h3>
      <div v-if="chartData" class="chart-wrapper">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="chart" />
      </div>
      <div v-else>
        <p>No spend trend data available for the selected period.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import Chart from 'primevue/chart';
import { computed } from 'vue';
  
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
  
  const chartData = computed(() => {
    const dataEntries = Object.entries(props.data);
  
    if (!dataEntries.length) {
      return null;
    }
  
    // Sort the data by date
    dataEntries.sort(([dateA], [dateB]) => new Date(`${dateA}-01`) - new Date(`${dateB}-01`));
  
    const labels = dataEntries.map(([month]) => formatMonthLabel(month));
    const spendValues = dataEntries.map(([, amount]) => amount);
  
    return {
      labels,
      datasets: [
        {
          label: 'Spend Amount',
          data: spendValues,
          backgroundColor: generateGradient(spendValues.length),
          borderColor: '#297FB7',
          borderWidth: 1,
        },
      ],
    };
  });
  
  // Helper function to format month labels
  function formatMonthLabel(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }
  
  // Helper function to generate gradient colors
  function generateGradient(count) {
    const startColor = '#297FB7'; // Primary Blue
    const endColor = '#82B1D9'; // Lighter Blue
  
    const colors = [];
    for (let i = 0; i < count; i++) {
      const ratio = i / (count - 1);
      colors.push(interpolateColor(startColor, endColor, ratio));
    }
    return colors;
  }
  
  function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
  
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));
  
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }
  
  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.parsed.y;
  
            // Format value as currency
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value);
  
            return formattedValue;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#595959',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#595959',
          beginAtZero: true,
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