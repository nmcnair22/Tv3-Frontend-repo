<template>
    <div class="grid grid-cols-12 gap-4">
      <!-- Total Accounts Receivable with AR Change Percentage -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Total AR</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">{{ totalARFormatted }}</div>
            </div>
            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/30 rounded-border w-10 h-10">
              <i class="pi pi-dollar text-blue-500 dark:text-blue-200 !text-xl" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="arChangeClass" class="font-medium">{{ arChange.toFixed(2) }}%</span>
            <span class="text-surface-500 dark:text-surface-300 ml-2">since last month</span>
          </div>
        </div>
      </div>
  
      <!-- Percentage of AR Late -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Percentage Late</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">{{ percentageLate }}%</div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/30 rounded-border w-10 h-10">
              <i class="pi pi-exclamation-circle text-orange-500 dark:text-orange-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Days Sales Outstanding (DSO) -->
      <div class="col-span-12 md:col-span-6 lg:col-span-4">
        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">DSO</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">{{ dso }}</div>
            </div>
            <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/30 rounded-border w-10 h-10">
              <i class="pi pi-clock text-purple-500 dark:text-purple-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue';
  
  const props = defineProps({
    totalAR: {
      type: Number,
      required: true,
    },
    percentageLate: {
      type: String,
      required: true,
    },
    dso: {
      type: Number,
      required: true,
    },
    arChange: {
      type: Number,
      required: true,
    },
  });
  
  // Format Total AR as currency
  const totalARFormatted = computed(() =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(props.totalAR)
  );
  
  // Dynamically set AR change class for positive/negative values
  const arChangeClass = computed(() => {
    return props.arChange >= 0 ? 'text-green-500' : 'text-red-500';
  });
  
  // Watch prop changes for debugging purposes
  watch(() => props.totalAR, (newValue) => {
    console.log(`[${new Date().toLocaleTimeString()}] Total AR updated: ${newValue}`);
  });
  </script>
  
  <style scoped>
  /* Add additional styling for the stat boxes */
  .grid {
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }
  
  .bg-surface-0 {
    background-color: #ffffff;
  }
  
  .dark .bg-surface-0 {
    background-color: #1f1f1f;
  }
  
  .text-surface-500 {
    color: #6b7280;
  }
  
  .dark .text-surface-500 {
    color: #9ca3af;
  }
  
  .text-surface-900 {
    color: #111827;
  }
  
  .dark .text-surface-900 {
    color: #f3f4f6;
  }
  
  .font-medium {
    font-weight: 500;
  }
  
  .shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .rounded-border {
    border-radius: 0.375rem;
  }
  
  .flex {
    display: flex;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .w-10, .h-10 {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .text-green-500 {
    color: #10b981;
  }
  
  .text-red-500 {
    color: #ef4444;
  }
  
  .bg-blue-100, .bg-blue-400 {
    background-color: #bfdbfe;
  }
  
  .dark .bg-blue-100 {
    background-color: #1e40af;
  }
  
  .text-blue-500 {
    color: #3b82f6;
  }
  
  .dark .text-blue-200 {
    color: #93c5fd;
  }
  </style>
  