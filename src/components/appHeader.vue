<!-- src/components/appHeader.vue -->
<template>
  <div class="app-header-container bg-surface-0 dark:bg-surface-950 px-4 py-2 md:px-8 lg:px-4">
    <!-- Breadcrumb Section -->
    <ul class="breadcrumbs list-none p-0 m-0 flex items-center font-medium mb-1">
      <li v-for="(crumb, index) in route.meta.breadcrumb" :key="index" class="flex items-center">
        <span v-if="index > 0" class="px-1">
          <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
        </span>
        <span
          class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer"
        >
          {{ crumb }}
        </span>
      </li>
    </ul>

    <!-- Title and Optional Components Section -->
    <div class="flex flex-col md:flex-row md:justify-start items-start md:items-center">
      <!-- Title -->
      <span class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2 md:mb-0 md:mr-6">
        {{ route.meta.title }}
      </span>

      <!-- Optional Components Slot -->
      <div v-if="route.meta.headerType === 'with-tabs'" class="w-full md:w-auto">
        <TabMenu :model="route.meta.headerOptions.tabs" class="custom-tabmenu" />
      </div>

      <div v-if="route.meta.headerType === 'with-badge'" class="mt-2 md:mt-0">
        <Badge :value="route.meta.headerOptions.badgeCount" severity="warning" />
      </div>

      <!-- Add more conditional components as needed -->
    </div>
  </div>
</template>

<script setup>
import Badge from 'primevue/badge';
import TabMenu from 'primevue/tabmenu';
import { useRoute } from 'vue-router';

const route = useRoute();

// Example tabs data if needed
// const tabs = ref([
//   { label: 'Dashboard', icon: 'pi pi-fw pi-home' },
//   { label: 'Customers', icon: 'pi pi-fw pi-users' },
//   { label: 'Projects', icon: 'pi pi-fw pi-chart-bar' },
//   { label: 'Messages', icon: 'pi pi-fw pi-inbox' },
//   { label: 'Settings', icon: 'pi pi-fw pi-cog' }
// ]);
</script>

<style scoped>
.app-header-container {
  border-bottom: 1px solid #E0E0E0; /* Light border for separation */
}

.breadcrumbs li span {
  font-size: 0.85rem;
}

.breadcrumbs li:first-child span {
  font-weight: 600;
}

.flex {
  display: flex;
}

.items-start {
  align-items: flex-start;
}

.items-center {
  align-items: center;
}

.text-xl {
  font-size: 1.25rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.w-full {
  width: 100%;
}

.md\:w-auto {
  width: auto;
}

.md\:mr-6 {
  margin-right: 1.5rem;
}

@media (min-width: 768px) {
  .breadcrumbs {
    margin-bottom: 0;
  }

  .text-xl {
    font-size: 1.5rem;
  }

  .mb-2 {
    margin-bottom: 0;
  }

  .mt-2 {
    margin-top: 0;
  }
}

/* Custom Styling for TabMenu */
:deep(.custom-tabmenu) {
  --tabmenu-active-color: #FFFFFF; /* Active tab text color */
  --tabmenu-inactive-color: #297FB7; /* Inactive tab text color */
  --tabmenu-active-bg: #297FB7; /* Active tab background */
  --tabmenu-inactive-bg: #FFFFFF; /* Inactive tab background */
  --tabmenu-border-color: #297FB7; /* Tab border color */
}

:deep(.custom-tabmenu .p-tabmenu-nav) {
  background-color: #FFFFFF; /* TabMenu background */
  border-bottom: 2px solid #297FB7; /* Bottom border */
}

:deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem) {
  color: #297FB7; /* Inactive tab text color */
  background-color: #FFFFFF; /* Inactive tab background */
  border: 1px solid #297FB7; /* Inactive tab border */
  border-bottom: none; /* Remove bottom border to connect with TabMenu nav */
  border-radius: 4px 4px 0 0; /* Rounded top corners */
  padding: 0.5rem 1rem; /* Padding for tabs */
  margin-right: 0.25rem; /* Space between tabs */
  transition: background-color 0.3s, color 0.3s;
}

:deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight) {
  color: #FFFFFF; /* Active tab text color */
  background-color: #297FB7; /* Active tab background */
  border-color: #297FB7; /* Active tab border */
}

:deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem:hover) {
  background-color: #1F5F8A; /* Hover background for tabs */
  color: #FFFFFF; /* Hover text color */
}

:deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight:hover) {
  background-color: #1F5F8A; /* Active tab hover background */
}

/* Optional: Responsive Adjustments */
@media (max-width: 768px) {
  :deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem) {
    padding: 0.5rem;
    font-size: 0.875rem; /* Reduced font size on smaller screens */
  }
}
</style>
