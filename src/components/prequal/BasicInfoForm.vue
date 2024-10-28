<!-- BasicInfoForm.vue -->
<template>
  <div class="bg-gray-50 dark:bg-gray-800 p-6 md:p-12 lg:p-20">
    <h3 class="text-gray-900 dark:text-white font-medium text-xl mb-4">Basic Information</h3>
    <div class="grid grid-cols-12 gap-4">
      <!-- Street Address -->
      <div class="col-span-12 md:col-span-6">
        <label for="street" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Street Address</label>
        <InputText id="street" v-model="form.street" class="w-full" required />
      </div>
      <!-- City -->
      <div class="col-span-12 md:col-span-6">
        <label for="city" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">City</label>
        <InputText id="city" v-model="form.city" class="w-full" required />
      </div>
      <!-- State -->
      <div class="col-span-12 md:col-span-6">
        <label for="state" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">State</label>
        <InputText id="state" v-model="form.state" class="w-full" required />
      </div>
      <!-- Zip Code -->
      <div class="col-span-12 md:col-span-6">
        <label for="zip" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Zip Code</label>
        <InputText id="zip" v-model="form.zip" class="w-full" required />
      </div>
      <!-- Contact Person -->
      <div class="col-span-12 md:col-span-6">
        <label for="contactPerson" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Contact Person</label>
        <InputText id="contactPerson" v-model="form.contactPerson" class="w-full" required />
      </div>
      <!-- Phone Number -->
      <div class="col-span-12 md:col-span-6">
        <label for="phoneNumber" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
        <InputMask id="phoneNumber" mask="(999) 999-9999" v-model="form.phoneNumber" class="w-full" required />
      </div>
      <!-- Building Type -->
      <div class="col-span-12 md:col-span-6">
        <label for="buildingType" class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Building Type</label>
        <Select
          id="buildingType"
          v-model="form.buildingType"
          :options="buildingTypes"
          optionLabel="label"
          placeholder="Select a building type"
          class="w-full"
          required
        />
      </div>
      <!-- Ownership Status -->
      <div class="col-span-12 md:col-span-6">
        <label class="block font-medium text-gray-700 dark:text-gray-200 mb-1">Ownership Status</label>
        <div class="flex items-center">
          <div class="flex items-center mr-4">
            <RadioButton
              inputId="ownershipOwn"
              name="ownershipStatus"
              value="own"
              v-model="form.ownershipStatus"
            />
            <label for="ownershipOwn" class="ml-2 text-gray-700 dark:text-gray-200">Own</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              inputId="ownershipRent"
              name="ownershipStatus"
              value="rent"
              v-model="form.ownershipStatus"
            />
            <label for="ownershipRent" class="ml-2 text-gray-700 dark:text-gray-200">Rent</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// Import PrimeVue components
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select'; // Using 'Select' as per your version

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue', 'validation']);

const form = reactive({ ...props.modelValue });

const buildingTypes = [
  { label: 'Commercial', value: 'commercial' },
  { label: 'Residential', value: 'residential' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Mixed Use', value: 'mixed' },
];

watch(
  form,
  (newVal) => {
    emits('update:modelValue', newVal);
    validateForm();
  },
  { deep: true }
);

function validateForm() {
  const isValid =
    form.street &&
    form.city &&
    form.state &&
    form.zip &&
    form.contactPerson &&
    form.phoneNumber &&
    form.buildingType &&
    form.ownershipStatus;
  emits('validation', isValid);
}
</script>

<style scoped>
/* Add any custom styles here if necessary */
</style>
