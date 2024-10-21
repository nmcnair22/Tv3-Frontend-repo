<template>
    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-4 md:px-12 lg:px-20">
      <!-- Breadcrumb -->
      <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
        <li v-for="(crumb, index) in route.meta.breadcrumb" :key="index" class="flex items-center">
          <span v-if="index > 0" class="px-2">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal" />
          </span>
          <span 
            class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer"
          >
            {{ crumb }}
          </span>
        </li>
      </ul>
  
      <!-- Page Title -->
      <div class="border-b border-surface">
        <span class="block text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">
          {{ route.meta.title }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  
  // Get the current route
  const route = useRoute();
  </script>
  