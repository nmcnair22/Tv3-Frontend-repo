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
    <!-- New Stat Card for Total Credits -->
    <div class="stat-card">
      <h3>Total Credits</h3>
      <p>{{ formatCurrency(inflowsData.totalCredits) }}</p>
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

/* Updated Stat Card Styling */
.stat-card {
  background-color: #FFFFFF; /* White background for a clean look */
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 calc(16.66% - 1rem);
  min-width: 150px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  border-top: 4px solid #297FB7; /* Primary blue accent on top */
  transition: transform 0.2s, box-shadow 0.2s; /* Smooth hover effects */
}

/* Hover Effect for Stat Cards */
.stat-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

/* Title Styling */
.stat-card h3 {
  margin-bottom: 0.5rem;
  color: #08294A; /* Night Sky for titles */
  font-size: 1.1rem; /* Slightly larger font for emphasis */
  font-weight: 600;
}

/* Value Styling */
.stat-card p {
  font-size: 1.4rem; /* Increased font size for prominence */
  font-weight: bold;
  color: #297FB7; /* Primary blue for values */
  margin: 0; /* Remove default margin */
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stat-card {
    flex: 1 1 calc(33.333% - 1rem); /* Adjust card width on medium screens */
  }
}

@media (max-width: 992px) {
  .stat-card {
    flex: 1 1 calc(33.333% - 1rem); /* Adjust card width on large tablets */
  }
}

@media (max-width: 768px) {
  .stat-card {
    flex: 1 1 calc(50% - 1rem); /* Two cards per row on small tablets */
  }

  .stat-card p {
    font-size: 1.2rem; /* Slightly smaller font on smaller screens */
  }
}

@media (max-width: 576px) {
  .stat-card {
    flex: 1 1 100%; /* Single card per row on mobile devices */
  }

  .stat-card h3 {
    font-size: 1rem; /* Reduce font size for titles */
  }

  .stat-card p {
    font-size: 1rem; /* Reduce font size for values */
  }
}
</style>
