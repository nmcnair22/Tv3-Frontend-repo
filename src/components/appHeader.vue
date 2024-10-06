<template>
    <div class="bg-surface-0 dark:bg-surface-950 px-4 py-4 md:px-8 lg:px-4">
      <!-- Breadcrumb Section -->
      <ul class="list-none p-0 m-0 flex items-center font-medium mb-2">
        <li v-for="(crumb, index) in route.meta.breadcrumb" :key="index" class="flex items-center">
          <span v-if="index > 0" class="px-1">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal" />
          </span>
          <span
            class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer"
          >
            {{ crumb }}
          </span>
        </li>
      </ul>
  
      <!-- Title and Search Section -->
      <div class="flex flex-col md:flex-row md:justify-between">
        <span class="text-2xl font-medium text-surface-900 dark:text-surface-0">{{ route.meta.title }}</span>
        <div class="flex items-center mt-3 md:mt-0 gap-3">
          <IconField icon-position="left">
            <InputIcon class="pi pi-search text-surface-700 dark:text-surface-100" />
            <InputText type="text" placeholder="Search" />
          </IconField>
  
          <Button icon="pi pi-user-plus" outlined rounded />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { useRoute } from 'vue-router';
  
  // Get the current route
  const route = useRoute();
  </script>
  