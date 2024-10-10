<template>
    <div class="loading">
      <ProgressSpinner />
    </div>
  </template>
  
  <script>
  import ProgressSpinner from 'primevue/progressspinner';
  
  export default {
    components: {
      ProgressSpinner,
    },
  };
  </script>
  
  <style scoped>
  .loading {
    text-align: center;
    margin: 2rem 0;
  }
  </style>