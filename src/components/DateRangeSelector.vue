<!-- src/components/DateRangeSelector.vue -->
<template>
  <div class="controls-container">
    <Select
      id="dateRangeOptions"
      v-model="localSelectedRange"
      :options="dateRanges"
      optionLabel="label"
      placeholder="Select Date Range"
      @change="onDateRangeChange"
      style="width: 200px;"
    />
    <DatePicker
      id="customDateRange"
      v-model="localSelectedDates"
      selectionMode="range"
      dateFormat="yy-mm-dd"
      placeholder="Select Custom Date Range"
      showIcon
      :disabled="localSelectedRange && localSelectedRange.value !== 'custom'"
      style="width: 300px;"
    />
    <Button
      label="Apply"
      @click="applyDateFilter"
      icon="pi pi-check"
      class="p-button-success"
    />
  </div>
</template>

<script>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import { ref, watch } from 'vue';

export default {
  components: {
    Select,
    DatePicker,
    Button,
  },
  props: {
    modelValueRange: {
      type: Object,
      default: null,
    },
    modelValueDates: {
      type: Array,
      default: null,
    },
    dateRanges: {
      type: Array,
      required: true,
    },
  },
  emits: ['apply-filter', 'update:modelValueRange', 'update:modelValueDates'],
  setup(props, { emit }) {
    const localSelectedRange = ref(props.modelValueRange);
    const localSelectedDates = ref(props.modelValueDates);

    // Watch for changes from parent component
    watch(
      () => props.modelValueRange,
      (newVal) => {
        localSelectedRange.value = newVal;
      }
    );

    watch(
      () => props.modelValueDates,
      (newVal) => {
        localSelectedDates.value = newVal;
      }
    );

    // Watch local changes and emit updates to parent
    watch(localSelectedRange, (newVal) => {
      emit('update:modelValueRange', newVal);
      if (newVal && newVal.value !== 'custom') {
        localSelectedDates.value = null;
      }
    });

    watch(localSelectedDates, (newVal) => {
      emit('update:modelValueDates', newVal);
    });

    function onDateRangeChange() {
      if (localSelectedRange.value && localSelectedRange.value.value !== 'custom') {
        localSelectedDates.value = null;
      }
    }

    function applyDateFilter() {
      emit('apply-filter');
    }

    return {
      localSelectedRange,
      localSelectedDates,
      dateRanges: props.dateRanges,
      onDateRangeChange,
      applyDateFilter,
    };
  },
};
</script>

<style scoped>
.controls-container {
  display: flex;
  align-items: flex-end; /* Align inputs properly */
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>