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
      <div v-if="tabs.length > 0" class="w-full md:w-auto flex items-center justify-center">
        <ul
          class="w-fit bg-surface-0 dark:bg-surface-950 list-none p-2 flex items-center overflow-x-auto select-none gap-2 border border-surface rounded-2xl"
        >
          <li v-for="(item, index) in tabs" :key="index">
            <a
              class="cursor-pointer px-5 py-3 flex items-center gap-2 rounded-lg border transition-all"
              :class="{
                'bg-surface-100 dark:bg-surface-900 border-surface font-medium text-surface-900 dark:text-surface-0':
                  activeTabIndex === index,
                'hover:bg-surface-50 dark:hover:bg-surface-900 border-transparent hover:border-surface-200 dark:hover:border-surface-800 text-surface-600 dark:text-surface-400':
                  activeTabIndex !== index,
              }"
              @click="onTabClick(index)"
            >
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
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
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = ref(route.meta.headerOptions?.tabs || []);
const activeTabIndex = ref(0);

// Handle tab click and navigate
const onTabClick = (index) => {
  const newTab = tabs.value[index];
  if (newTab && newTab.route) {
    activeTabIndex.value = index;
    router.push(newTab.route);
  } else {
    console.error('Tab does not have a valid route:', newTab);
  }
};

// Ensure the active tab is correctly set when the route changes
const updateActiveTab = () => {
  tabs.value = route.meta.headerOptions?.tabs || [];
  const currentTabIndex = tabs.value.findIndex((tab) => tab.route === route.path);
  if (currentTabIndex !== -1) {
    activeTabIndex.value = currentTabIndex;
  } else {
    activeTabIndex.value = 0;
  }
};

watch(route, updateActiveTab);

// Initial setup
updateActiveTab();
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

/* No additional styles needed as Tailwind classes are used */
</style>