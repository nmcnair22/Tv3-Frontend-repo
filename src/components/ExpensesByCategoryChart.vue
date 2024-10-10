<template>
    <div>
      <h3>Expenses by Category</h3>
      <Chart type="pie" :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import Chart from 'primevue/chart';
import { computed } from 'vue';
import { useOutflowsStore } from '../store/outflowsStore';
  
  const outflowsStore = useOutflowsStore();
  
  const chartData = computed(() => {
    const data = outflowsStore.outflowsData?.expensesByCategory || [];
    const labels = data.map((item) => item.category);
    const amounts = data.map((item) => item.amount);
  
    return {
      labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  });
  
  const chartOptions = {
    responsive: true,
  };
  </script>