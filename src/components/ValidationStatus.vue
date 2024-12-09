<!-- src/components/ValidationStatus.vue -->
<template>
    <div :class="['validation-status', status.toLowerCase()]">
      <i :class="statusIcon" class="status-icon"></i>
      <span>Validation Status: {{ status }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps } from 'vue';
  
  const props = defineProps<{ status: string }>();
  
  const statusIcon = computed(() => {
    return props.status.toLowerCase() === 'pass' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle';
  });
  </script>
  
  <style scoped>
  .validation-status {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    color: white;
    margin-bottom: 1rem;
  }
  
  .validation-status.pass {
    background-color: #28a745;
  }
  
  .validation-status.failed {
    background-color: #dc3545;
  }
  
  .status-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }
  </style>
  