<template>
    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
        <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-6">Application</div>
        <TabMenu :model="items" />
    </div>
</template>
<script setup>
import TabMenu from 'primevue/tabmenu';

const items = ref([
    { label: 'Dashboard', icon: 'pi pi-fw pi-home' },
    { label: 'Customers', icon: 'pi pi-fw pi-users' },
    { label: 'Projects', icon: 'pi pi-fw pi-chart-bar' },
    { label: 'Messages', icon: 'pi pi-fw pi-inbox' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog' }
]);
</script>
