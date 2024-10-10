<!-- src/components/PaymentsByCustomerModal.vue -->
<template>
    <Dialog
      v-model:visible="visible"
      @hide="onHide"
      header="All Payments by Customer"
      :modal="true"
      :style="{ width: '50vw', padding: '1.5rem' }"
      :breakpoints="{ '960px': '90vw' }"
    >
      <DataTable
        v-model:filters="filters"
        :value="formattedPaymentsData"
        paginator
        :rows="10"
        :scrollable="true"
        scrollHeight="400px"
        stripedRows
        filterDisplay="menu"
        :globalFilterFields="['customer', 'formattedAmount']"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 30rem; width: 100%;"
      >
        <template #header>
          <div class="flex justify-between items-center mb-3">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilters" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" class="w-1/4 p-inputtext-sm" />
          </div>
        </template>
        <template #empty> No payments found. </template>
        <template #loading> Loading payments data. Please wait. </template>
        <Column field="customer" header="Customer Name" sortable style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.customer }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by Customer Name" />
          </template>
        </Column>
        <Column field="formattedAmount" header="Payment Amount (USD)" sortable style="min-width: 10rem; text-align: right;">
          <template #body="{ data }">
            {{ data.formattedAmount }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by Amount" />
          </template>
        </Column>
      </DataTable>
    </Dialog>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { computed, ref, watch } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    paymentsData: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['update:visible']);
  
  const visible = ref(props.visible);
  const filters = ref({
    global: { value: null },
    customer: { value: null },
    formattedAmount: { value: null }
  }); // Initialize filters for global search and individual columns
  
  watch(
    () => props.visible,
    (newVal) => {
      visible.value = newVal;
    }
  );
  
  function onHide() {
    emit('update:visible', false);
  }
  
  function closeModal() {
    visible.value = false;
    emit('update:visible', false);
  }
  
  function clearFilters() {
    filters.value = {
      global: { value: null },
      customer: { value: null },
      formattedAmount: { value: null }
    };
  }
  
  // Computed property to format payment amounts before rendering
  const formattedPaymentsData = computed(() =>
    props.paymentsData.map((payment) => ({
      ...payment,
      formattedAmount: formatCurrency(payment.amount),
    }))
  );
  
  // Format currency values
  function formatCurrency(value) {
    if (value === null || value === undefined) return '-';
    const amount = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  </script>
  
  <style scoped>
  /* Compact and cleaner design for the modal */
  .p-dialog {
    padding: 0.75rem;
  }
  .p-datatable {
    font-size: 0.85rem;
  }
  .p-datatable-thead > tr > th {
    padding: 0.5rem;
  }
  .p-datatable-tbody > tr > td {
    padding: 0.5rem;
  }
  .p-inputtext {
    border-radius: 0.25rem;
    padding: 0.25rem;
  }
  </style>
