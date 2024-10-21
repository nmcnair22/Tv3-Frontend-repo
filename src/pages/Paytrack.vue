<!-- src/pages/Paytrack.vue -->
<template>
  <div class="paytrack-page">
    <!-- Render child routes for Paytrack (Overview, Customers, Invoices, etc.) -->
    <router-view />
  </div>
</template>

<script setup>
// No additional logic is needed at the moment for the shell component.
</script>

<style scoped>
.paytrack-page {
  /* Add any specific styles for Paytrack page */
  padding: 1rem;
}
</style>
