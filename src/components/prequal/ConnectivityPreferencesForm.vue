<!-- ConnectivityPreferencesForm.vue -->
<template>
  <div class="connectivity-preferences-form bg-gray-50 dark:bg-gray-800 p-6 md:p-12 lg:p-20">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-4">Connectivity Preferences</h3>

    <!-- Speed Limitations -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">Speed Limitations (Mbps)</label>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <label for="minSpeed" class="block text-gray-700 dark:text-gray-200 mb-1">Min Speed</label>
          <InputNumber
            id="minSpeed"
            v-model.number="form.minSpeed"
            :min="0"
            :showButtons="true"
            :step="1"
            placeholder="Min Speed"
            class="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <label for="maxSpeed" class="block text-gray-700 dark:text-gray-200 mb-1">Max Speed</label>
          <InputNumber
            id="maxSpeed"
            v-model.number="form.maxSpeed"
            :min="0"
            :showButtons="true"
            :step="1"
            placeholder="Max Speed"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Price Requirements -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">Price Requirements ($)</label>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <label for="minPrice" class="block text-gray-700 dark:text-gray-200 mb-1">Min Price</label>
          <InputNumber
            id="minPrice"
            v-model.number="form.minPrice"
            mode="currency"
            currency="USD"
            locale="en-US"
            placeholder="Min Price"
            class="w-full"
          />
        </div>
        <div class="col-span-12 md:col-span-6">
          <label for="maxPrice" class="block text-gray-700 dark:text-gray-200 mb-1">Max Price</label>
          <InputNumber
            id="maxPrice"
            v-model.number="form.maxPrice"
            mode="currency"
            currency="USD"
            locale="en-US"
            placeholder="Max Price"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Technology Preferences -->
    <div class="mb-6">
      <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">Preferred Technology Types</label>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <div class="flex flex-wrap">
            <div
              v-for="option in technologyOptions"
              :key="option.value"
              class="flex items-center mr-4 mb-2"
            >
              <Checkbox
                :inputId="option.value"
                :value="option.value"
                v-model="form.technologyTypes"
              />
              <label :for="option.value" class="ml-2 text-gray-700 dark:text-gray-200">
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// Import PrimeVue components
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue', 'validation']);

const form = reactive({ ...props.modelValue });

const technologyOptions = [
  { label: 'Fiber', value: 'fiber' },
  { label: 'Cable', value: 'cable' },
  { label: 'DSL', value: 'dsl' },
  { label: 'Wireless', value: 'wireless' },
];

if (!form.technologyTypes) {
  form.technologyTypes = [];
}

watch(
  form,
  (newVal) => {
    emits('update:modelValue', newVal);
    validateForm();
  },
  { deep: true }
);

function validateForm() {
  const isValid = form.technologyTypes && form.technologyTypes.length > 0;
  emits('validation', isValid);
}
</script>

<style scoped>
/* Add any custom styles here if necessary */
</style>
