<template>
    <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
        <div class="bg-surface-0 dark:bg-surface-900 shadow rounded-border p-6 max-w-[50rem] mx-auto">
            <div class="flex items-center justify-between mb-6">
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">Quarter Goals</span>
                <div class="ml-auto">
                    <Button icon="pi pi-ellipsis-v" text plain rounded @click="$refs.menu.toggle($event)" />
                    <Menu ref="menu" :popup="true" :model="items" />
                </div>
            </div>
            <div class="border-surface border rounded-border p-4 mb-6">
                <span class="text-surface-900 dark:text-surface-0 font-medium text-3xl">85% <span class="text-surface-600 dark:text-surface-200">(2125/2500)</span></span>
                <ul class="mt-4 list-none p-0 mx-0 flex">
                    <li class="h-4 flex-1 bg-indigo-500 rounded-l" />
                    <li class="h-4 flex-1 bg-blue-500" />
                    <li class="h-4 flex-1 bg-orange-500" />
                    <li class="h-4 flex-1 bg-purple-500" />
                    <li class="h-4 flex-1 bg-yellow-500" />
                    <li class="h-4 flex-1 bg-cyan-500" />
                    <li class="h-4 flex-1 bg-surface-500 dark:bg-surface-300 rounded-r" />
                </ul>
            </div>
            <ul class="mt-6 list-none p-0 mx-0">
                <li class="flex items-center pb-4">
                    <span class="w-4 h-4 rounded-border bg-indigo-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">Watch</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">152</span>
                </li>
                <li class="flex items-center py-4">
                    <span class="w-4 h-4 rounded-border bg-blue-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">Blue Band</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">63</span>
                </li>
                <li class="flex items-center py-4">
                    <span class="w-4 h-4 rounded-border bg-orange-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">Controller</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">23</span>
                </li>
                <li class="flex items-center py-4">
                    <span class="w-4 h-4 rounded-border bg-purple-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">Lime Band</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">42</span>
                </li>
                <li class="flex items-center py-4">
                    <span class="w-4 h-4 rounded-border bg-yellow-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">Phone Case</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">134</span>
                </li>
                <li class="flex items-center py-4">
                    <span class="w-4 h-4 rounded-border bg-cyan-500 mr-4 flex-shrink-0" />
                    <span class="text-xl font-medium text-90">T-Shirt</span>
                    <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">89</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
const items = ref([
    {
        label: 'Options',
        items: [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Search', icon: 'pi pi-fw pi-search' }
        ]
    }
]);
</script>
