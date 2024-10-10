<template>
    <div>
      <h3>Expenses by Vendor</h3>
      <Chart type="bar" :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import Chart from 'primevue/chart';
import { computed } from 'vue';
import { useOutflowsStore } from '../store/outflowsStore';
  
  const outflowsStore = useOutflowsStore();
  
  const chartData = computed(() => {
    const data = outflowsStore.outflowsData?.expensesByVendor || [];
    const labels = data.map((item) => item.vendor);
    const amounts = data.map((item) => item.amount);
  
    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: amounts,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  });
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  </script>