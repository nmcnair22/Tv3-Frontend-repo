<!-- src/components/FinancialSummaryCards.vue -->
<template>
    <div class="financial-summary-cards">
      <StatBox
        title="Credit Score"
        :value="creditScore"
        format="number"
        :subtitle="creditTier"
        icon="pi pi-chart-line"
        iconBgColor="bg-blue-100"
        iconColor="text-blue-500"
      />
      <StatBox
        title="Spend Tier"
        :value="spendTier"
        format="string"
        icon="pi pi-star-fill"
        iconBgColor="bg-green-100"
        iconColor="text-green-500"
      />
      <StatBox
        title="Average Monthly Spend"
        :value="averageMonthlySpend"
        format="currency"
        icon="pi pi-wallet"
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-500"
      />
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
  
  const hasCustomerData = computed(() => Object.keys(props.customerData).length > 0);
  
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
    justify-content: space-between; /* Ensure the cards span the full row */
  }
  </style>