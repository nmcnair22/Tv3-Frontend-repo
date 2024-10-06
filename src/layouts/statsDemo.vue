<template>
    <div class="stats-demo">
      <!-- Stat Boxes Section -->
      <Panel header="Stat Boxes">
        <p class="mb-4">
          This section demonstrates various statistical data boxes displaying orders, revenue, customers, and comments.
        </p>
        <StatBoxes />
      </Panel>
  
      <!-- Stats By Date Section -->
      <Panel header="Stats By Date" class="mt-8">
        <p class="mb-4">
          This section displays statistical data filtered or sorted by a specific date or date range.
        </p>
        <StatsByDate />
      </Panel>
  
      <!-- Stats With Graph Section -->
      <Panel header="Stats With Graph" class="mt-8">
        <p class="mb-4">
          This section displays statistical data along with visual graphs to help track trends and patterns.
        </p>
        <StatsWithGraph />
      </Panel>
    </div>
  </template>
  
  <script setup>
  // Importing components
  import Panel from 'primevue/panel';
import StatBoxes from '../components/statBoxes.vue';
import StatsByDate from '../components/statsByDate.vue';
import StatsWithGraph from '../components/statsWithGraph.vue';
  </script>
  
  <style scoped>
  /* Add some padding or margin to make the layout look nice */
  .stats-demo {
    padding: 0rem;
  }
  
  /* Optional: Make sure each section has a margin between them */
  .mt-8 {
    margin-top: 0rem;
  }
  </style>
  