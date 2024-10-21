<!-- src/components/StatBox.vue -->
<template>
  <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-border">
    <div class="flex justify-between mb-4">
      <div>
        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">{{ title }}</span>
        <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl flex items-baseline">
          {{ formattedValue }}
          <!-- Subtitle next to the main value inside parentheses -->
          <span v-if="subtitle" class="text-surface-500 dark:text-surface-300 text-sm ml-1">
            ({{ subtitle }})
          </span>
        </div>
      </div>
      <div :class="iconContainerClass">
        <!-- Icon -->
        <i :class="iconClass"></i>
      </div>
    </div>
    <!-- Percentage change and period label -->
    <div v-if="isPercentageChangeAvailable" class="flex items-center">
      <span :class="percentageChangeClass" class="font-medium">{{ formattedPercentage }}</span>
      <span class="text-surface-500 dark:text-surface-300 ml-2">{{ periodLabelComputed }}</span>
    </div>
    <!-- Bottom content -->
    <div v-if="bottomContent" class="mt-2">
      <div v-if="Array.isArray(bottomContent)" class="text-surface-500 dark:text-surface-300 text-sm flex flex-wrap items-center">
        <template v-for="(item, index) in bottomContent" :key="index">
          <span>{{ item }}</span>
          <!-- Add separator except after the last item -->
          <span v-if="index < bottomContent.length - 1" class="mx-2">|</span>
        </template>
      </div>
      <div v-else class="text-surface-500 dark:text-surface-300 text-sm">{{ bottomContent }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

interface Props {
  title: string;
  value: number | string;
  format: 'currency' | 'number' | 'percentage';
  percentageChange?: number;
  periodLabel?: string; // Optional prop for the period label
  subtitle?: string;     // Optional prop for displaying additional info next to the main value
  bottomContent?: string | string[]; // Content at the bottom
  icon?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const props = defineProps<Props>();

// Format the main value
const formattedValue = computed(() => formatValue(props.value, props.format));

// Format the percentage change
const formattedPercentage = computed(() => {
  if (props.percentageChange !== undefined && props.percentageChange !== null) {
    const sign = props.percentageChange >= 0 ? '+' : '-';
    return `${sign}${Math.abs(props.percentageChange).toFixed(2)}%`;
  }
  return null;
});

// Use the provided period label or default to 'since last period'
const periodLabelComputed = computed(() => props.periodLabel || 'since last period');

// Determine if percentage change should be displayed
const isPercentageChangeAvailable = computed(() => props.percentageChange !== undefined);

// Determine the class based on positive or negative percentage change
const percentageChangeClass = computed(() => {
  if (props.percentageChange === undefined) return '';
  return props.percentageChange >= 0 ? 'text-green-500' : 'text-red-500';
});

// Computed class for the icon container
const iconContainerClass = computed(() => {
  return `flex items-center justify-center ${props.iconBgColor} rounded-border w-10 h-10`;
});

// Computed class for the icon
const iconClass = computed(() => {
  return `pi ${props.icon} ${props.iconColor} !text-xl`;
});

// Function to format the value based on the format prop
function formatValue(value: number | string, format: 'currency' | 'number' | 'percentage'): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '-';

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericValue);
    case 'percentage':
      return `${numericValue.toFixed(2)}%`;
    case 'number':
    default:
      return numericValue.toFixed(2);
  }
}

</script>

<style scoped>
.stat-box {
  padding: 1rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.stat-box h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.stat-box p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #555;
}

.flex {
  display: flex;
}

.mb-4 {
  margin-bottom: 1rem;
}

.bg-surface-0 {
  background-color: #f9f9f9;
}

.text-surface-500 {
  color: #6b7280;
}

.text-surface-900 {
  color: #111827;
}

.font-medium {
  font-weight: 500;
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

.ml-2 {
  margin-left: 0.5rem;
}
</style>
