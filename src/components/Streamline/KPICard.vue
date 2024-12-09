<!-- src/components/Streamline/KPICard.vue -->
<template>
    <div class="kpi-card flex items-center bg-white shadow rounded p-4">
      <div :class="`kpi-icon bg-${color}-100 text-${color}-600 p-3 rounded-full mr-4`">
        <i :class="`pi ${icon} text-2xl`"></i>
      </div>
      <div class="kpi-content">
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-xl font-semibold">{{ value }}{{ unit }}</p>
      </div>
    </div>
  </template>

  <script setup>
  import { defineProps } from 'vue';

  defineProps({
    title: String,
    value: [Number, String],
    unit: { type: String, default: '' },
    icon: { type: String, default: 'pi pi-info-circle' },
    color: { type: String, default: 'blue' },
  });
  </script>

  <style scoped>
  /* Add necessary styles */
  </style>