<!-- src/components/Card.vue -->

<template>
    <div class="card">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-value">{{ formatCurrency(value) }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Define the props expected by this component
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  });
  
  // Helper function to format numbers as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };
  </script>
  
  <style scoped>
  .card {
    background-color: var(--p-surface-0);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--p-shadow-sm);
    text-align: center;
  }
  
  .card-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .card-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  </style>
  