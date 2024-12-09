<!-- src/components/Streamline/RevenueByCategoryChart.vue -->

<template>
    <Card title="Revenue by Category">
      <div v-if="hasData">
        <Chart type="bar" :data="data" :options="chartOptions" />
      </div>
      <p v-else>No revenue data available.</p>
    </Card>
  </template>
  
  <script setup lang="ts">
  import Card from 'primevue/card';
import Chart from 'primevue/chart';
import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  
  const hasData = computed(() => {
    return Object.keys(props.data).length > 0;
  });
  </script>
  
  <style scoped>
  /* Add any specific styles if needed */
  </style>
  