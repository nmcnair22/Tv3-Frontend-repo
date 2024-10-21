import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDateStore = defineStore('dateStore', () => {
    const selectedRange = ref('monthToDate'); // Default to Month to Date
    const customDates = ref(null); // Holds custom date range, if selected

    const startDate = computed(() => {
        if (selectedRange.value === 'custom' && customDates.value?.length === 2) {
            return customDates.value[0];
        }
        return getStartDateByRange(selectedRange.value);
    });

    const endDate = computed(() => {
        if (selectedRange.value === 'custom' && customDates.value?.length === 2) {
            return customDates.value[1];
        }
        return new Date(); // Default to today for non-custom ranges
    });

    function updateSelectedRange(newRange) {
        selectedRange.value = newRange;
        if (newRange !== 'custom') {
            clearCustomDates();
        }
    }

    function updateCustomDates(dates) {
        customDates.value = dates;
    }

    function clearCustomDates() {
        customDates.value = null;
    }

    function getStartDateByRange(range) {
        const today = new Date();
        switch (range) {
            case 'monthToDate':
                return new Date(today.getFullYear(), today.getMonth(), 1);
            case 'yearToDate':
                return new Date(today.getFullYear(), 0, 1);
            case 'lastMonth':
                return new Date(today.getFullYear(), today.getMonth() - 1, 1);
            default:
                return new Date(today.getFullYear(), today.getMonth(), 1);
        }
    }

    return {
        selectedRange,
        customDates,
        startDate,
        endDate,
        updateSelectedRange,
        updateCustomDates,
    };
});
