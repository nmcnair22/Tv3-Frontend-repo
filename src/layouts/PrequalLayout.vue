<!-- src/layouts/PrequalLayout.vue -->
<template>
    <div class="prequal-layout">
      <!-- Content -->
      <div class="prequal-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  </script>
  
  <style scoped>
  /* Add styles as needed */
  </style>
  