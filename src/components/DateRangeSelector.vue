<template>
  <div class="controls-container">
    <div class="select-container">
      <label for="dateRangeOptions">Date Range:</label>
      <Select
        id="dateRangeOptions"
        v-model="internalSelectedRange"
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
        v-model="internalSelectedDates"
        selectionMode="range"
        dateFormat="yy-mm-dd"
        placeholder="Select Custom Date Range"
        showIcon
        :disabled="isDatePickerDisabled"
        class="custom-datepicker"
      />
    </div>
    <div class="button-container">
      <label>&nbsp;</label> 
      <Button
        label="Apply"
        @click="applyDateFilter"
        icon="pi pi-check"
        class="apply-button"
        :disabled="!canApply"
      />
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import { computed, ref, watch } from 'vue';

export default {
  components: {
    Select,
    DatePicker,
    Button,
  },
  props: {
    dateRanges: {
      type: Array,
      required: true,
    },
    initialSelectedRange: {
      type: Object,
      default: null,
    },
    initialSelectedDates: {
      type: Array,
      default: null,
    },
  },
  emits: ['apply-filter', 'update:initialSelectedRange', 'update:initialSelectedDates'],
  setup(props, { emit }) {
    const internalSelectedRange = ref(props.initialSelectedRange);
    const internalSelectedDates = ref(props.initialSelectedDates);

    const isDatePickerDisabled = computed(() => {
      return !(internalSelectedRange.value && internalSelectedRange.value.value === 'custom');
    });

    const canApply = computed(() => {
      if (internalSelectedRange.value && internalSelectedRange.value.value !== 'custom') {
        return true;
      } else if (
        internalSelectedRange.value &&
        internalSelectedRange.value.value === 'custom' &&
        internalSelectedDates.value &&
        internalSelectedDates.value.length === 2
      ) {
        return true;
      }
      return false;
    });

    watch(
      () => props.initialSelectedRange,
      (newVal) => {
        internalSelectedRange.value = newVal;
      }
    );

    watch(
      () => props.initialSelectedDates,
      (newVal) => {
        internalSelectedDates.value = newVal;
      }
    );

    function onDateRangeChange() {
      if (internalSelectedRange.value && internalSelectedRange.value.value !== 'custom') {
        internalSelectedDates.value = null;
      }
    }

    function applyDateFilter() {
      emit('apply-filter');
      emit('update:initialSelectedRange', internalSelectedRange.value);
      emit('update:initialSelectedDates', internalSelectedDates.value);
    }

    return {
      internalSelectedRange,
      internalSelectedDates,
      isDatePickerDisabled,
      canApply,
      onDateRangeChange,
      applyDateFilter,
    };
  },
};
</script>

<style scoped>
  .controls-container {
    display: flex;
    align-items: center;
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
    color: #08294A !important;
    margin-bottom: 0.5rem;
  }

  .button-container label {
    visibility: hidden;
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
  }

  .apply-button:hover {
    background-color: #297FB7 !important;
    color: #FFFFFF !important;
  }

  .apply-button:active {
    background-color: #08294A !important;
  }

  .apply-button:disabled {
    background-color: #D3D3D3 !important; /* Light Gray for disabled state */
    color: #A6A6A6 !important; /* Neutral Gray text */
    cursor: not-allowed;
  }

  .apply-button .pi {
    margin-right: 0.5rem;
  }

  .custom-select .p-dropdown .custom-datepicker .p-inputtext  {
    border: 1px solid #297FB7 !important;
    border-radius: 4px !important;
    color: #08294A !important;
  }

  .custom-select .p-dropdown:focus,
  .custom-datepicker .p-inputtext:focus {
    border-color: #1F5F8A !important;
    box-shadow: 0 0 0 1px #1F5F8A !important;
  }

  .custom-select .p-dropdown .p-dropdown-trigger  {
    color: #297FB7 !important;
  }

  .custom-datepicker .p-datepicker-trigger {
    color: #297FB7 !important;
  }
</style>
