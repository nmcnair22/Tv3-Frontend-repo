<!-- src/components/appHeader.vue -->
<template>
  <div class="app-header-container bg-surface-0 dark:bg-surface-950 px-4 py-2 md:px-8 lg:px-4">
    <!-- Breadcrumb Section -->
    <ul class="breadcrumbs list-none p-0 m-0 flex items-center font-medium mb-1">
      <li v-for="(crumb, index) in route.meta.breadcrumb" :key="index" class="flex items-center">
        <span v-if="index > 0" class="px-1">
          <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
        </span>
        <span class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">
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

      <!-- Optional Components Slot: Tab Menu -->
      <div v-if="tabs.length > 0" class="w-full md:w-auto">
        <TabMenu
          :model="tabs"
          class="custom-tabmenu"
          :activeItem="activeTab"
          @tab-change="onTabChange"
        />
      </div>

      <div v-else>
        <!-- Fallback rendering when no tabs are available -->
        <p class="text-red-500">No tabs available for this route</p>
      </div>

      <!-- Badge Rendering -->
      <div v-if="route.meta.headerType === 'with-badge'" class="mt-2 md:mt-0">
        <Badge :value="route.meta.headerOptions.badgeCount" severity="warning" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Badge from 'primevue/badge';
import TabMenu from 'primevue/tabmenu';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Retrieve the tabs from the route metadata
const tabs = ref(route.meta.headerOptions?.tabs || []);
const activeTab = ref(tabs.value[0] || null);

// Debugging: Log route.meta and tabs
console.log('Route meta:', route.meta);
console.log('Tabs initialized:', tabs.value);

// Handle tab change and navigate
const onTabChange = (event) => {
  // Debugging: Log the event and check its properties
  console.log('Tab change event:', event);

  const newTab = tabs.value[event.index];  // Use event.index to access the correct tab

  // Debugging: Log the newTab based on the event index
  console.log('New tab:', newTab);

  if (newTab && newTab.route) {
    activeTab.value = newTab;
    console.log('Navigating to:', newTab.route);
    router.push(newTab.route);
  } else {
    console.error('Tab does not have a valid route:', newTab);
  }
};

// Ensure the active tab is correctly set when the route changes
watch(route, () => {
  console.log('Route changed:', route.path);

  // Re-fetch tabs when route changes
  tabs.value = route.meta.headerOptions?.tabs || [];
  console.log('Updated tabs:', tabs.value);

  // Update active tab based on the current route
  const currentTab = tabs.value.find(tab => tab.route === route.path);
  activeTab.value = currentTab || tabs.value[0];
  console.log('Active tab set to:', activeTab.value);
});

// Mounted hook for additional debugging
onMounted(() => {
  console.log('AppHeader component mounted');
});
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
  padding-right: 3rem;
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

/* Optional: Responsive Adjustments */
@media (max-width: 768px) {
  :deep(.custom-tabmenu .p-tabmenu-nav .p-tabmenuitem) {
    padding: 0.5rem;
    font-size: 0.875rem; /* Reduced font size on smaller screens */
  }
}
</style>
