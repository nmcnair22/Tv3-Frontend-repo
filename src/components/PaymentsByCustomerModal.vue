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
      class="payments-modal-table"
    >
      <template #header>
        <div class="flex justify-between items-center mb-3">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            class="clear-filters-button"
            @click="clearFilters"
          />
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
            class="global-search-input"
          />
        </div>
      </template>
      <template #empty> No payments found. </template>
      <template #loading> Loading payments data. Please wait. </template>
      <Column
        field="customer"
        header="Customer Name"
        sortable
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          {{ data.customer }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @input="filterCallback()"
            placeholder="Search by Customer Name"
            class="column-filter-input"
          />
        </template>
      </Column>
      <Column
        field="formattedAmount"
        header="Payment Amount (USD)"
        sortable
        style="min-width: 10rem; text-align: right;"
      >
        <template #body="{ data }">
          {{ data.formattedAmount }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @input="filterCallback()"
            placeholder="Search by Amount"
            class="column-filter-input"
          />
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
  formattedAmount: { value: null },
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
    formattedAmount: { value: null },
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
/* Existing Styles (Preserved) */

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

/* New Styling Overrides */

/* Scoped styling for the DataTable within the modal */
:deep(.payments-modal-table .p-datatable-thead > tr > th.p-datatable-column-sorted) {
  background-color: #297FB7 !important; /* Desired blue color */
  color: #FFFFFF !important; /* Ensure text is readable */
}

:deep(.payments-modal-table .p-datatable-thead > tr > th.p-datatable-column-sorted .p-sortable-column-icon) {
  color: #FFFFFF !important; /* Ensure sort icon is visible */
}

/* Override the paginator active page highlight */
:deep(.payments-modal-table .p-paginator .p-paginator-page.p-highlight) {
  background-color: #297FB7 !important; /* Desired blue color */
  border-color: #297FB7 !important;
  color: #FFFFFF !important; /* Ensure text is readable */
}

/* Override paginator buttons */
:deep(.payments-modal-table .p-paginator .p-paginator-page),
:deep(.payments-modal-table .p-paginator .p-paginator-next),
:deep(.payments-modal-table .p-paginator .p-paginator-prev) {
  background-color: #FFFFFF !important; /* White background */
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
}

/* Hover states for paginator buttons */
:deep(.payments-modal-table .p-paginator .p-paginator-page:hover),
:deep(.payments-modal-table .p-paginator .p-paginator-next:hover),
:deep(.payments-modal-table .p-paginator .p-paginator-prev:hover) {
  background-color: #297FB7 !important; 
  color: #FFFFFF !important; 
}

/* Active hover state for highlighted paginator page */
:deep(.payments-modal-table .p-paginator .p-paginator-page.p-highlight:hover),
:deep(.payments-modal-table .p-paginator .p-paginator-next:hover),
:deep(.payments-modal-table .p-paginator .p-paginator-prev:hover) {
  background-color: #1F5F8A !important; 
  color: #FFFFFF !important;
}

/* "Clear" Button Styling */
.clear-filters-button {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.875rem; /* Reduced font size */
  cursor: pointer;
}

.clear-filters-button:hover {
  background-color: #297FB7 !important;
  color: #FFFFFF !important;
}

.clear-filters-button:active {
  background-color: #08294A!important;
}

.clear-filters-button:disabled {
  background-color: #D3D3D3 !important; /* Light Gray for disabled state */
  color: #A6A6A6 !important; /* Neutral Gray text */
  cursor: not-allowed;
}

/* Adjust the paginator next/prev buttons */
:deep(.payments-modal-table .p-paginator .p-paginator-prev),
:deep(.payments-modal-table .p-paginator .p-paginator-next) {
  background-color: #FFFFFF !important; /* White background */
  color: #297FB7 !important; /* Blue text/icons */
  border: 1px solid #297FB7 !important;
}

/* Hover states for paginator buttons */
:deep(.payments-modal-table .p-paginator .p-paginator-prev:hover),
:deep(.payments-modal-table .p-paginator .p-paginator-next:hover) {
  background-color: #297FB7 !important; /* Blue background on hover */
  color: #FFFFFF !important; /* White text/icons on hover */
}

/* Input Text Styling */
.global-search-input,
.column-filter-input {
  width: 25%;
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
  color: #08294A;
}

:deep(.payments-modal-table .p-inputtext) {
  border-radius: 0.25rem !important;
  padding: 0.25rem !important;
  font-size: 0.875rem !important; /* Reduced font size */
}

/* Responsive Design */
@media (max-width: 768px) {
  .global-search-input,
  .column-filter-input {
    width: 100%;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .clear-filters-button {
    margin-top: 0.5rem;
    width: 100%;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
