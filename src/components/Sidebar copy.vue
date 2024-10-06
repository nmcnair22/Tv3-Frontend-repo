<template>
    <div class="relative flex gap-0 h-screen bg-surface-0 dark:bg-surface-950 p-6">
        <div id="app-sidebar-14" class="h-full hidden lg:block lg:static absolute left-0 top-0 py-4 pl-4 lg:p-0 z-50">
            <!-- Sidebar with updated background color -->
            <div class="w-[18rem] h-full flex flex-col bg-primary-500 dark:bg-primary-500 rounded-2xl border border-surface-100 dark:border-surface-800">
                <a class="inline-flex items-center gap-3 px-6 py-4 cursor-pointer">
                    <!-- Company Logo -->
                    <img :src="logo" alt="Company Logo" class="w-[calc(100%-4rem)] h-auto" />
                </a>
                <div class="w-[calc(100%-3rem)] mx-auto h-[1px] bg-surface-200 dark:bg-surface-700 px-6" />
                <div class="p-6 flex-1">
                    <!-- Rest of the Sidebar -->
                    <ul class="flex flex-col gap-2 overflow-hidden">
                        <template v-for="(item, navIndex) of navs" :key="navIndex">
                            <li>
                                <!-- Apply the same logic for arrow color and submenu interaction across all groups -->
                                <div
                                    :class="
                                        selectedNav === item.label
                                            ? 'bg-surface-0 dark:bg-surface-950 text-surface-900 dark:text-surface-0 border-surface shadow-sm'
                                            : 'border-transparent hover:border-surface-200 dark:hover:border-surface-800 hover:bg-surface-950 dark:hover:bg-surface-950 text-surface-0 dark:text-surface-400'
                                    "
                                    class="z-30 relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border"
                                    @click="selectedNav = item.label"
                                >
                                    <i :class="item.icon" />
                                    <span class="flex-1 font-medium">{{ item.label }}</span>
                                    <i
                                        v-if="item?.subMenu"
                                        :class="selectedNav === item.label ? 'pi pi-chevron-down text-surface-900 dark:text-surface-0' : 'pi pi-chevron-down text-surface-400 dark:text-surface-400'"
                                        class="transition-colors"
                                    />
                                </div>
                                <div
                                    v-if="selectedNav === item.label && item?.subMenu"
                                    class="relative pl-1.5 flex flex-col transition-all duration-500 mt-2"
                                    :class="selectedNav === item.label && item?.subMenu ? 'opacity-100' : 'opacity-0'"
                                >
                                    <template v-for="(subItem, subIndex) of item.subMenu" :key="subIndex">
                                        <div class="cursor-pointer relative px-3.5 py-2 flex items-center transition-all" @click="selectedSubNav = subItem.label">
                                            <svg width="18" height="44" viewBox="0 0 18 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute left-4 -top-2">
                                                <path :d="getLinePath(subIndex, item.subMenu.length)" class="stroke-surface-600" stroke-width="2" />
                                                <path
                                                    d="M11.136 26.2862L11.1313 26.2863C11.1243 26.2863 11.1174 26.2849 11.1109 26.2823C11.1045 26.2796 11.0986 26.2756 11.0937 26.2707L11.0937 26.2707L11.0917 26.2687C11.0805 26.2575 11.0742 26.2422 11.0742 26.2263C11.0742 26.2105 11.0805 26.1953 11.0917 26.1841C11.0917 26.184 11.0917 26.184 11.0917 26.184L14.4286 22.8471L14.7822 22.4936L14.4286 22.14L11.1009 18.8123C11.0922 18.8014 11.0875 18.7878 11.0877 18.7737C11.088 18.7582 11.0943 18.7434 11.1052 18.7324C11.1162 18.7214 11.131 18.7151 11.1466 18.7149C11.1606 18.7146 11.1743 18.7193 11.1852 18.7281L14.9083 22.4512C14.9195 22.4625 14.9258 22.4777 14.9258 22.4936C14.9258 22.5095 14.9195 22.5247 14.9083 22.5359L11.1758 26.2685L11.1758 26.2685L11.1736 26.2707C11.1687 26.2756 11.1628 26.2796 11.1564 26.2823C11.1499 26.2849 11.143 26.2863 11.136 26.2862Z"
                                                    class="stroke-surface-600 fill-surface-600"
                                                />
                                                <path d="M1 14V17.5C1 20.2614 3.23858 22.5 6 22.5H15" class="stroke-surface-600" stroke-width="2" />
                                                <template v-if="subIndex === getSelectedIndex(navIndex)">
                                                    <path
                                                        d="M11.136 26.2862L11.1313 26.2863C11.1243 26.2863 11.1174 26.2849 11.1109 26.2823C11.1045 26.2796 11.0986 26.2756 11.0937 26.2707L11.0937 26.2707L11.0917 26.2687C11.0805 26.2575 11.0742 26.2422 11.0742 26.2263C11.0742 26.2105 11.0805 26.1953 11.0917 26.1841C11.0917 26.184 11.0917 26.184 11.0917 26.184L14.4286 22.8471L14.7822 22.4936L14.4286 22.14L11.1009 18.8123C11.0922 18.8014 11.0875 18.7878 11.0877 18.7737C11.088 18.7582 11.0943 18.7434 11.1052 18.7324C11.1162 18.7214 11.131 18.7151 11.1466 18.7149C11.1606 18.7146 11.1743 18.7193 11.1852 18.7281L14.9083 22.4512C14.9195 22.4625 14.9258 22.4777 14.9258 22.4936C14.9258 22.5095 14.9195 22.5247 14.9083 22.5359L11.1758 26.2685L11.1758 26.2685L11.1736 26.2707C11.1687 26.2756 11.1628 26.2796 11.1564 26.2823C11.1499 26.2849 11.143 26.2863 11.136 26.2862Z"
                                                        class="stroke-surface-0 fill-surface-0"
                                                    />
                                                    <path d="M1 14V17.5C1 20.2614 3.23858 22.5 6 22.5H15" class="stroke-surface-0" stroke-width="2" />
                                                </template>
                                                <path v-if="subIndex <= getSelectedIndex(navIndex)" :d="getActiveLinePath(subIndex, getSelectedIndex(navIndex))" class="stroke-surface-0" stroke-width="2" />
                                            </svg>
                                            <span
                                                class="leading-relaxed font-medium text-sm transition-all ml-8"
                                                :class="selectedSubNav === subItem.label ? 'text-surface-0' : 'text-surface-400 hover:text-surface-0'"
                                            >{{ subItem.label }}</span>
                                        </div>
                                    </template>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
                <!-- Bottom Nav Section -->
                <ul class="flex flex-col gap-2 px-6 py-3">
                    <template v-for="(item, index) of bottomNavs" :key="index">
                        <li
                            :class="
                                selectedNav === item.label
                                    ? 'bg-surface-950 text-surface-0 border-surface shadow-sm'
                                    : 'border-transparent hover:border-surface-0 hover:bg-surface-950 text-surface-0'
                            "
                            class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border"
                            @click="selectedNav = item.label"
                        >
                            <i :class="item.icon" />
                            <span class="flex-1 font-medium">{{ item.label }}</span>
                            <i v-if="item?.subMenu" class="pi pi-chevron-down text-sm leading-none" />
                        </li>
                    </template>
                </ul>
                <div class="w-[calc(100%-3rem)] mx-auto h-[1px] bg-surface-700 px-6" />
                <div class="p-6 flex items-center gap-3 cursor-pointer">
                    <Avatar image="src/assets/Dirk.png" size="large" shape="circle" class="!w-9 !h-9" />
                    <div>
                        <div class="text-sm font-semibold text-surface-0">Dirk Daring</div>
                        <span class="text-xs text-surface-200 leading-none">Valiant Knight</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from 'primevue/avatar';
import { ref } from 'vue';
import logo from '../assets/CISLogoDark.svg';

const selectedNav = ref('Dashboard');
const selectedSubNav = ref(null);
const bottomNavs = ref([
    {
        icon: 'pi pi-question-circle',
        label: 'Help'
    },
    {
        icon: 'pi pi-cog',
        label: 'Settings'
    }
]);

const navs = ref([
    {
        icon: 'pi pi-home',
        label: 'Finance',
        subMenu: [
            {
                label: 'Cash Flow',
                path: '/finance/cash-flow'
            },
            {
                label: 'Income',
                path: '/finance/income'
            },
            {
                label: 'Expenses/Spend',
                path: '/finance/expenses-spend'
            }
        ]
    },
    {
        icon: 'pi pi-credit-card',
        label: 'Streamline',
        subMenu: [
            {
                label: 'Dashboard',
                path: '/streamline/dashboard'
            },
            {
                label: 'Bill Imports',
                path: '/streamline/bill-imports'
            }
        ]
    },
    {
        icon: 'pi pi-sitemap',
        label: 'Managed Services',
        path: '/managed-services'
    },
    {
        icon: 'pi pi-truck',
        label: 'Field Services',
        path: '/field-services'
    },
    {
        icon: 'pi pi-calendar',
        label: 'Page Elements',
        subMenu: [
            {
                label: 'Form with Files',
                path: '/page-elements/form-with-files'
            },
            {
                label: 'Stat Boxes',
                path: '/stats-demo'
            }
        ]
    }
]);

// Adjusted the getSelectedIndex function to consider the correct group
const getSelectedIndex = (navIndex) => {
    const selectedGroup = navs.value[navIndex];
    return selectedGroup.subMenu?.findIndex((subItem) => subItem.label === selectedSubNav.value);
};

const getLinePath = (index, totalItems) => {
    if (index === 0) {
        return `M1 0 V40`;
    } else if (index === totalItems - 1) {
        return `M1 -4 V14`;
    } else {
        return `M1 -4 V40`;
    }
};

const getActiveLinePath = (index, selectedIndex) => {
    if (index === 0) {
        return `M1 0 V${index === selectedIndex ? '14' : '40'}`;
    } else if (index === selectedIndex) {
        return `M1 -4 V14`;
    } else {
        return `M1 -4 V40`;
    }
};
</script>
