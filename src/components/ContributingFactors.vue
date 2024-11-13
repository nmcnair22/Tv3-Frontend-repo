<!-- src/components/ContributingFactors.vue -->
<template>
    <div class="contributing-factors">
      <h3>Contributing Factors</h3>
      <ul>
        <li v-for="(factor, index) in factors" :key="index">
          <i class="pi pi-info-circle"></i> {{ factor }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    factors: {
      type: Array,
      default: () => [],
    },
  });
  </script>
  
  <style scoped>
  .contributing-factors {
    background-color: #F7F9FC;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .contributing-factors h3 {
    margin-bottom: 1rem;
    color: #08294A;
    font-weight: 600;
    font-size: 1.4rem;
  }
  
  .contributing-factors ul {
    list-style: none;
    padding: 0;
  }
  
  .contributing-factors li {
    margin-bottom: 0.5rem;
    color: #595959;
  }
  
  .contributing-factors li i {
    margin-right: 0.5rem;
    color: #297FB7;
  }
  </style>