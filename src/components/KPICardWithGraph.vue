<!-- src/components/KPICardWithGraph.vue -->
<template>
    <div class="kpi-card">
      <div class="kpi-info">
        <img v-if="icon" :src="icon" alt="icon" class="icon" />
        <div>
          <span class="kpi-title">{{ title }}</span>
          <div class="kpi-value" :class="changeColor">{{ valueDisplay }}</div>
          <div v-if="change" class="kpi-change">{{ formatChange(change) }}</div>
        </div>
      </div>
  
      <!-- Optional Graph Section -->
      <svg v-if="showGraph" class="graph" viewBox="0 0 270 74" fill="none">
        <!-- Example Path for Graph, You can generate this dynamically based on data -->
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="270" height="74">
          <rect width="270" height="74" class="fill-primary" />
        </mask>
        <g mask="url(#mask0)">
          <path d="M270 74.5H270.5V74V6.949V5.953L269.701 6.549L264.301 10.577L264.176 10.67L264.126 10.818L258.776 26.642L253.933 30.255L248.822 22.22L248.348 21.475L247.953 22.265L242.829 32.504L238.031 28.668L232.677 11.619L232.513 11.096L232.006 11.308L226.284 13.711L221.422 13.5L221.323 13.496L221.231 13.529L216.089 15.379L210.906 11.374L210.89 11.362L210.873 11.351L205.473 7.825L205.25 7.679L205.004 7.784L199.794 10.005L194.586 7.924L194.358 7.833L194.147 7.957L188.747 11.122L188.633 11.189L188.567 11.304L183.49 20.096L178.551 15.226L178.164 14.845L177.816 15.262L172.654 21.451L167.596 19.295L167.239 19.143L167.003 19.451L161.845 26.186L156.806 23.904L151.44 20.972L151.349 20.922L151.246 20.913L145.846 20.409L145.464 20.373L145.331 20.734L140.286 34.444L135.426 26.544L135.012 25.872L134.581 26.533L129.477 34.353L124.506 30.511L124.082 30.183L123.785 30.628L118.385 38.685L113.21 50.865L108.33 46.574L107.787 46.096L107.532 46.773L102.348 60.518L97.501 57.483L92.243 52.789L86.882 33.435L85.913 33.455L80.647 56.255L75.818 54.197L70.44 51.259L70.233 51.146L70.014 51.233L64.853 53.296L59.782 50.054L54.444 39.741L54.148 39.169L53.667 39.598L48.462 44.244L43.317 43.01L42.887 42.907L42.732 43.321L37.54 57.224L32.653 54.36L32.197 54.093L31.955 54.563L27.054 64.097L22.063 51.797L22.018 51.686L21.927 51.607L16.527 46.931L16.459 46.872L16.375 46.841L10.975 44.826L10.667 44.711L10.44 44.948L5.045 50.553L-0.349 55.799L-0.5 55.947V56.158V74V74.5H0H270Z"
            class="stroke-primary fill-primary/10"
          />
        </g>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    title: String,
    value: Number,
    icon: String,  // Optional image/icon
    change: Number,  // Optional change percentage
    showGraph: Boolean,  // Optional flag to show graph
  });
  
  // Formatting helpers for currency and change
  const valueDisplay = computed(() => formatCurrency(props.value));
  const changeColor = computed(() => props.change > 0 ? 'text-green-500' : 'text-red-500');
  
  function formatCurrency(value) {
    const absValue = Math.abs(value);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return value < 0 ? `(${formatter.format(absValue)})` : formatter.format(absValue);
  }
  
  function formatChange(change) {
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  }
  </script>
  
  <style scoped>
  .kpi-card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  
  .kpi-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .kpi-title {
    font-size: 1.1rem;
    color: #555;
  }
  
  .kpi-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .kpi-change {
    font-size: 1rem;
    color: #777;
  }
  
  .graph {
    margin-top: 1rem;
    fill: none;
  }
  </style>
  