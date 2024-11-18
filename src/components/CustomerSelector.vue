<!-- src/components/CustomerSelector.vue -->
<template>
  <div class="customer-selector">
    <Select
      v-model="selectedCustomerNumber"
      :options="customerOptions"
      optionLabel="displayName"
      optionValue="customerNumber"
      placeholder="Select a Customer"
      :disabled="isLoading"
      :filter="true"
      class="custom-select w-full md:w-56"
    >
      <!-- Option Template -->
      <template #option="slotProps">
        <div class="flex items-center">
          <i class="pi pi-user mr-2"></i>
          <div>{{ slotProps.option.displayName }}</div>
        </div>
      </template>

      <!-- Selected Value Template -->
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center">
          <i class="pi pi-user mr-2"></i>
          <!-- Find the selected customer based on slotProps.value -->
          <div>{{ getCustomerDisplayName(slotProps.value) }}</div>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>
    </Select>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import Select from 'primevue/select';
import { computed, onMounted, ref, watch } from 'vue';
import { useCustomerStore } from '../store/customerStore';

const customerStore = useCustomerStore();
const { customers, selectedCustomer, isLoading } = storeToRefs(customerStore);

const selectedCustomerNumber = ref(null);

const customerOptions = computed(() => customers.value || []);

onMounted(() => {
  customerStore.fetchCustomers();
});

// Watch when selectedCustomerNumber changes to update selectedCustomer in the store
watch(
  () => selectedCustomerNumber.value,
  (newCustomerNumber) => {
    if (newCustomerNumber) {
      const selectedCustomerData = customers.value.find(
        (customer) => customer.customerNumber === newCustomerNumber
      );
      customerStore.selectCustomer(selectedCustomerData);
    } else {
      customerStore.selectCustomer(null);
    }
  }
);

// Watch when selectedCustomer in the store changes to update selectedCustomerNumber
watch(
  () => selectedCustomer.value,
  (newSelectedCustomer) => {
    if (newSelectedCustomer) {
      selectedCustomerNumber.value = newSelectedCustomer.customerNumber;
    } else {
      selectedCustomerNumber.value = null;
    }
  },
  { immediate: true }
);

// Function to get displayName from customerNumber
function getCustomerDisplayName(customerNumber) {
  const customer = customers.value.find(
    (customer) => customer.customerNumber === customerNumber
  );
  return customer ? customer.displayName : '';
}
</script>
  
  <style scoped>
  .customer-selector {
    margin-bottom: 1rem;
  }
  
  /* Apply styles similar to your date range selector */
  .custom-select .p-select-label {
    color: #08294A !important;
  }
  
  .custom-select .p-select-item {
    color: #08294A !important;
  }
  
  .custom-select .p-select-trigger {
    color: #297FB7 !important;
  }
  
  .custom-select .p-select.p-component .p-inputtext {
    border: 1px solid #297FB7 !important;
    border-radius: 4px !important;
    color: #08294A !important;
  }
  
  .custom-select .p-select.p-component .p-inputtext:focus {
    border-color: #1F5F8A !important;
    box-shadow: 0 0 0 1px #1F5F8A !important;
  }
  </style>
  