<!-- src/components/DateRangeSelector.vue -->
<template>
  <div class="controls-container">
    <div class="select-container">
      <label for="dateRangeOptions">Date Range:</label>
      <Select
        id="dateRangeOptions"
        v-model="localSelectedRange"
        :options="dateRanges"
        optionLabel="label"
        placeholder="Select Date Range"
        @change="onDateRangeChange"
        class="custom-select"
      />
    </div>
    <div class="datepicker-container">
      <label for="customDateRange">Custom Dates:</label>
      <DatePicker
        id="customDateRange"
        v-model="localSelectedDates"
        selectionMode="range"
        dateFormat="yy-mm-dd"
        placeholder="Select Custom Date Range"
        showIcon
        :disabled="localSelectedRange && localSelectedRange.value !== 'custom'"
        class="custom-datepicker"
      />
    </div>
    <!-- Wrap the Button in a div for consistent structure -->
    <div class="button-container">
      <label>&nbsp;</label> <!-- Empty label for alignment -->
      <Button
        label="Apply"
        @click="applyDateFilter"
        icon="pi pi-check"
        class="apply-button"
      />
    </div>
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
  align-items: center; /* Changed from flex-end to center */
  gap: 1rem;
  margin-bottom: 1rem;
}

.select-container,
.datepicker-container,
.button-container {
  display: flex;
  flex-direction: column;
}

.select-container label,
.datepicker-container label,
.button-container label {
  font-weight: 600;
  color: #08294A; /* Night Sky */
  margin-bottom: 0.5rem;
}

/* Adjust the label in the button container to reserve space */
.button-container label {
  visibility: hidden; /* Hide the label but keep the space */
}

.custom-select .p-dropdown {
  width: 200px;
}

.custom-datepicker .p-inputwrapper {
  width: 300px;
}

.apply-button {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* Removed align-self: flex-start */
}

.apply-button:hover {
  background-color: #297FB7 !important;
  color: #FFFFFF !important;
}

.apply-button:active {
  background-color: #08294A!important;
}

.apply-button:disabled {
  background-color: #D3D3D3; /* Light Gray for disabled state */
  color: #A6A6A6; /* Neutral Gray text */
  cursor: not-allowed;
}

.apply-button .pi {
  margin-right: 0.5rem;
}
</style>
