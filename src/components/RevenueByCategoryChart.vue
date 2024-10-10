<!-- src/components/RevenueByCategoryChart.vue -->

<template>
  <div class="chart pie-chart">
    <h3>Revenue by Category</h3>
    <div v-if="chartData">
      <Chart type="pie" :data="chartData" />
    </div>
    <div v-else>
      <p>No revenue data available.</p>
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import { computed } from 'vue';

const props = defineProps({
  revenueCategories: {
    type: Array,
    default: () => [],
  },
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
          '#42A5F5',
          '#66BB6A',
          '#FFA726',
          '#FFCA28',
          '#26C6DA',
          '#AB47BC',
          '#EC407A',
        ],
        hoverBackgroundColor: [
          '#64B5F6',
          '#81C784',
          '#FFB74D',
          '#FFD54F',
          '#4DD0E1',
          '#BA68C8',
          '#F06292',
        ],
      },
    ],
  };
});
</script>

<style scoped>
.pie-chart {
  max-width: 100%;
}
.chart {
  background-color: #f7f9fc;
  padding: 1rem;
  border-radius: 8px;
}
</style>