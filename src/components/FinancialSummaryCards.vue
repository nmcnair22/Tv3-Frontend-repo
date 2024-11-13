<!-- src/components/FinancialSummaryCards.vue -->
<template>
    <div class="financial-summary-cards">
      <!-- Display a loading placeholder if data is not yet available -->
      <div v-if="!hasCustomerData" class="loading-placeholder">
        <p>Loading financial summary...</p>
      </div>
      <!-- Display StatBoxes when data is available -->
      <div v-else>
        <StatBox
          title="Credit Score"
          :value="creditScore"
          format="number"
          :subtitle="creditTier"
          icon="pi-chart-line"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
        />
        <StatBox
          title="Spend Tier"
          :value="spendTier"
          format="string"
          icon="pi-money-bill"
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
        />
        <StatBox
          title="Average Monthly Spend"
          :value="averageMonthlySpend"
          format="currency"
          icon="pi-shopping-cart"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-500"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
import StatBox from './StatBox.vue';
  
  const props = defineProps({
    customerData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });
  
  // Computed property to check if customerData has data
  const hasCustomerData = computed(() => Object.keys(props.customerData).length > 0);
  
  // Computed properties to safely access customerData properties
  const creditScore = computed(() => props.customerData.creditScore ?? '-');
  const creditTier = computed(() => props.customerData.creditTier ?? '-');
  const spendTier = computed(() => props.customerData.spendTier ?? '-');
  const averageMonthlySpend = computed(() => props.customerData.averageMonthlySpend ?? 0);
  </script>
  
  <style scoped>
  .financial-summary-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .loading-placeholder {
    width: 100%;
    text-align: center;
    padding: 2rem;
    font-size: 1.25rem;
    color: #595959;
  }
  </style>