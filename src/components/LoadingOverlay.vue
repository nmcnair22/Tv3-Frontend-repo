<!-- src/components/LoadingOverlay.vue -->

<template>
    <div class="loading-overlay">
      <ProgressSpinner />
      <p>Loading...</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import ProgressSpinner from 'primevue/progressspinner';
  </script>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .loading-overlay p {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #333;
  }
  </style>
  