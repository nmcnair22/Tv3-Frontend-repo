<template>
    <div class="error">
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    font-weight: bold;
    text-align: center;
    margin: 2rem 0;
  }
  </style>