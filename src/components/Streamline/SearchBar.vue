<!-- src/components/Streamline/SearchBar.vue -->
<template>
    <div class="search-bar mb-4">
      <InputText v-model="searchQuery" placeholder="Search..." @input="onSearch" style="width: 100%;" />
    </div>
  </template>
  
  <script setup>
  import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useBillImportStore } from '../../store/billImportStore';
  
  const searchQuery = ref('');
  const billImportStore = useBillImportStore();
  
  const onSearch = () => {
    billImportStore.filterBills(searchQuery.value);
  };
  </script>
  
  <style scoped>
  /* Add styles for the search bar */
  </style>
  