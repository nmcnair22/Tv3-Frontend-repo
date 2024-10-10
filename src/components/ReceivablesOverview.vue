<!-- src/components/ReceivablesOverview.vue -->

<template>
  <div class="receivables-overview">
    <div class="stat-card">
      <h3>Starting Receivables</h3>
      <p>{{ formatCurrency(inflowsData.startingReceivables) }}</p>
    </div>
    <div class="stat-card">
      <h3>Ending Receivables</h3>
      <p>{{ formatCurrency(inflowsData.endingReceivables) }}</p>
    </div>
    <div class="stat-card">
      <h3>Net Change in Receivables</h3>
      <p>{{ formatCurrency(inflowsData.netChangeReceivables) }}</p>
    </div>
    <div class="stat-card">
      <h3>Total New Invoices</h3>
      <p>{{ formatCurrency(inflowsData.totalNewInvoices) }}</p>
    </div>
    <div class="stat-card">
      <h3>Total Payments Received</h3>
      <p>{{ formatCurrency(inflowsData.totalPaymentsReceived) }}</p>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  inflowsData: {
    type: Object,
    default: () => ({}),
  },
});

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return '$0.00';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(value);
}
</script>

<style scoped>
.receivables-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-card {
  background-color: #f7f9fc;
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 calc(20% - 1rem);
  min-width: 150px;
  text-align: center;
}

.stat-card h3 {
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>