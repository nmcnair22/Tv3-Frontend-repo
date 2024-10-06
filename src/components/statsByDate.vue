<template>
    <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
        <div class="flex flex-col md:flex-row gap-4 md:items-center bg-primary text-primary-contrast rounded-xl p-4">
            <div class="flex flex-col items-center md:w-32">
                <!-- Triggering previousDate on the up button -->
                <Button icon="pi pi-chevron-up" @click="previousDate()" />
                <div class="flex flex-col items-center">
                    <span class="block mb-1 text-3xl font-semibold">{{ date.getDate() }}</span>
                    <span class="mt-0">{{ monthNames[date.getMonth()] }}</span>
                </div>
                <!-- Triggering nextDate on the down button -->
                <Button icon="pi pi-chevron-down" @click="nextDate()" />
            </div>
            <div class="flex-1 gap-4 flex flex-col sm:flex-row">
                <div class="flex-1 flex justify-center items-center bg-primary-emphasis shadow-sm p-4 rounded-md border border-primary-contrast/10">
                    <div class="text-center">
                        <i class="pi pi-eye text-4xl mb-2" />
                        <div class="text-sm font-semibold mb-2">VIEWS</div>
                        <span class="font-semibold">{{ date.getDay() * 1000 + 1000 }}</span>
                    </div>
                </div>
                <div class="flex-1 flex justify-center items-center bg-primary-emphasis shadow-sm p-4 rounded-md border border-primary-contrast/10">
                    <div class="text-center">
                        <i class="pi pi-users text-4xl mb-2" />
                        <div class="text-sm font-semibold mb-2">FOLLOWS</div>
                        <span class="font-semibold">{{ date.getDay() * 10 + 10 }}</span>
                    </div>
                </div>
                <div class="flex-1 flex justify-center items-center bg-primary-emphasis shadow-sm p-4 rounded-md border border-primary-contrast/10">
                    <div class="text-center">
                        <i class="pi pi-heart text-4xl mb-2" />
                        <div class="text-sm font-semibold mb-2">LIKES</div>
                        <span class="font-semibold">{{ date.getDay() * 100 + 100 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref } from 'vue'; // Ensure ref is imported

const date = ref(new Date());  // Define date as reactive
const monthNames = ref(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);  // Reactive array for month names

// Function to move to the previous date
const previousDate = () => {
    date.value.setDate(date.value.getDate() - 1);
    date.value = new Date(date.value);  // Update reactive date
};

// Function to move to the next date
const nextDate = () => {
    date.value.setDate(date.value.getDate() + 1);
    date.value = new Date(date.value);  // Update reactive date
};
</script>
