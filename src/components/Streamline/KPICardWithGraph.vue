<!-- src/components/Streamline/KPICardWithGraph.vue -->

<template>
    <Card :title="title">
      <div class="kpi-content">
        <span class="kpi-value">{{ value }}{{ unit }}</span>
        <div v-if="hasGraphData">
          <Chart type="line" :data="graphData" :options="chartOptions" />
        </div>
        <p v-else>No data available.</p>
      </div>
    </Card>
  </template>
  
  <script setup lang="ts">
  import Card from 'primevue/card';
import Chart from 'primevue/chart'; // Correct import without braces
import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: false,
      default: '',
    },
    graphData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  
  const hasGraphData = computed(() => {
    return Object.keys(props.graphData).length > 0;
  });
  </script>
  
  <style scoped>
  .kpi-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .kpi-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  </style>
  