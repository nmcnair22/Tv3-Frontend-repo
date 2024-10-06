<!-- src/components/IncomeStatementTable.vue -->

<template>
    <div class="income-statement-table">
      <h3>Income Statement</h3>
      <table class="table-auto w-full mt-4">
        <thead>
          <tr>
            <th class="px-4 py-2">Category</th>
            <th class="px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td class="border px-4 py-2">{{ item.category }}</td>
            <td class="border px-4 py-2">{{ formatCurrency(item.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Define the props expected by this component
  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  });
  
  // Helper function to format numbers as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };
  </script>
  
  <style scoped>
  .income-statement-table {
    background-color: var(--p-surface-0);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: var(--p-shadow-md);
  }
  
  .table-auto th,
  .table-auto td {
    text-align: left;
  }
  </style>
  