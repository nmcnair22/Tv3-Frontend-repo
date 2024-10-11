<!-- src/components/AgingReport.vue -->
<template>
  <div class="aging-report">
    <h2 class="section-title">
      Aging Report{{ formattedAsOfDate ? ': ' + formattedAsOfDate : '' }}
    </h2>

    <!-- Loading Indicator -->
    <Loading v-if="isLoading" />

    <!-- Error Message -->
    <ErrorMessage v-if="error" :message="error" />

    <!-- Aging Report DataTable -->
    <div v-if="!isLoading && processedData && processedData.length">
      <!-- Global Search -->
      <div class="table-header">
        <InputText
          v-model="filters['global'].value"
          placeholder="Global Search"
          class="global-search"
        />
      </div>

      <DataTable
        :value="processedData"
        v-model:filters="filters"
        paginator
        :rows="10"
        :loading="isLoading"
        :globalFilterFields="globalFilterFields"
        :sortOrder="-1"
        :sortField="'rank'"
        scrollable
        scrollHeight="flex"
        resizableColumns
        columnResizeMode="expand"
        :tableStyle="{ minWidth: '70rem' }"
        filterDisplay="menu"
        class="aging-table"
      >
        <!-- Customer Name Column -->
        <Column
          field="name"
          header="Customer Name"
          sortable
          filter
          style="min-width: 15rem"
        >
          <template #body="{ data }">
            {{ data.name || 'Unknown Customer' }}
          </template>
        </Column>

        <!-- Balance Due Column -->
        <Column
          field="balanceDue"
          header="Balance Due"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: right"
        >
          <template #body="{ data }">
            {{ formatCurrency(data.balanceDue) }}
          </template>
        </Column>

        <!-- Current Amount Column -->
        <Column
          field="currentAmount"
          header="Current"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: right"
        >
          <template #body="{ data }">
            {{ formatCurrency(data.currentAmount) }}
          </template>
        </Column>

        <!-- Late 1 - 30 Column -->
        <Column
          field="period1Amount"
          header="Late 1 - 30"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: right"
        >
          <template #body="{ data }">
            {{ formatCurrency(data.period1Amount) }}
          </template>
        </Column>

        <!-- Late 31 - 60 Column -->
        <Column
          field="period2Amount"
          header="Late 31 - 60"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: right"
        >
          <template #body="{ data }">
            {{ formatCurrency(data.period2Amount) }}
          </template>
        </Column>

        <!-- Late 90+ Column -->
        <Column
          field="period3Amount"
          header="Late 90+"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: right"
        >
          <template #body="{ data }">
            {{ formatCurrency(data.period3Amount) }}
          </template>
        </Column>

        <!-- Late Pay Rank Column -->
        <Column
          field="rank"
          header="Late Pay Rank"
          dataType="numeric"
          sortable
          filter
          style="min-width: 10rem; text-align: center"
        >
          <template #body="{ data }">
            {{ formatInteger(data.rank) }}
          </template>
        </Column>

        <!-- Payment History Column -->
        <Column
          header="Payment History"
          style="min-width: 8rem; text-align: center"
        >
          <template #body="{ data }">
            <Button
              icon="pi pi-clock"
              label="View"
              class="view-history-button"
              @click="openPaymentHistoryModal(data.customerNumber, data.name)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Payment History Modal -->
    <PaymentHistoryModal
      :visible="isPaymentModalVisible"
      @update:visible="handleModalVisibility"
      :customerNumber="selectedCustomerNumber"
      :customerName="selectedCustomerName"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ErrorMessage from './ErrorMessage.vue';
import Loading from './Loading.vue';
import PaymentHistoryModal from './PaymentHistoryModal.vue';

// Import PrimeVue components
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';

// Import FilterMatchMode
import { FilterMatchMode } from '@primevue/core/api';

// Reactive variables and methods for the Payment History Modal
const isPaymentModalVisible = ref(false);
const selectedCustomerNumber = ref('');
const selectedCustomerName = ref('');

function openPaymentHistoryModal(customerNumber, customerName) {
  console.log(
    'Opening modal for customerNumber:',
    customerNumber,
    'customerName:',
    customerName
  );
  selectedCustomerNumber.value = customerNumber;
  selectedCustomerName.value = customerName;
  isPaymentModalVisible.value = true;
}

function handleModalVisibility(value) {
  isPaymentModalVisible.value = value;
}

// Props and computed properties
const props = defineProps({
  asOfDate: {
    type: String,
    required: true,
  },
  reportData: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

// Initialize filters for global search
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Computed properties
const formattedAsOfDate = computed(() => {
  const [year, month, day] = props.asOfDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

// Functions to format data
function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatInteger(value) {
  return Number(value).toFixed(0);
}

// Global filter fields
const globalFilterFields = [
  'name',
  'customerNumber',
  'balanceDue',
  'currentAmount',
  'period1Amount',
  'period2Amount',
  'period3Amount',
  'rank',
];

// Processed data with Late Pay Rank
const processedData = computed(() => {
  return props.reportData
    .filter((item) => item.name !== 'Total' && item.balanceDue > 0)
    .map((item) => ({
      ...item,
      rank: calculateRank(item),
      customerNumber: item.customerNumber, // Ensure customerNumber is included
    }));
});

function calculateRank(item) {
  const late1 = item.period1Amount || 0;
  const late2 = item.period2Amount || 0;
  const late3 = item.period3Amount || 0;
  return late1 * 1 + late2 * 2 + late3 * 3;
}
</script>

<style scoped>
.aging-report {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #08294A; /* Night Sky */
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #E0E0E0;
  padding-bottom: 0.5rem;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
}

.global-search {
  width: 300px;
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
  color: #08294A;
}

.aging-table {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
}

/* Override the default highlight color for sorted column headers */
::v-deep .aging-table .p-datatable-thead > tr > th.p-datatable-column-sorted {
  background-color: #297FB7 !important; /* Desired blue color */
  color: #FFFFFF !important; /* Ensure text is readable */
}

/* Ensure the sort icon is visible */
::v-deep .aging-table .p-datatable-thead > tr > th.p-datatable-column-sorted .p-sortable-column-icon {
  color: #FFFFFF !important; /* Ensure sort icon is visible */
}

/* Override the paginator active page highlight */
::v-deep .aging-table .p-paginator .p-paginator-page.p-highlight {
  background-color: #297FB7 !important; /* Desired blue color */
  border-color: #297FB7 !important;
  color: #FFFFFF !important; /* Ensure text is readable */
}

/* Override paginator buttons */
::v-deep .aging-table .p-paginator .p-paginator-page,
::v-deep .aging-table .p-paginator .p-paginator-next,
::v-deep .aging-table .p-paginator .p-paginator-prev {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
}

::v-deep .aging-table .p-paginator .p-paginator-page:hover,
::v-deep .aging-table .p-paginator .p-paginator-next:hover,
::v-deep .aging-table .p-paginator .p-paginator-prev:hover {
  background-color: #297FB7 !important; /* Blue background on hover */
  color: #FFFFFF !important; /* White text/icons on hover */
}

::v-deep .aging-table .p-paginator .p-paginator-page.p-highlight:hover,
::v-deep .aging-table .p-paginator .p-paginator-next:hover,
::v-deep .aging-table .p-paginator .p-paginator-prev:hover {
  background-color: #1F5F8A !important; /* Darker blue on hover */
  color: #FFFFFF !important;
}

/* Update the button styles to use the new blue color */
.view-history-button {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.view-history-button:hover {
  background-color: #297FB7 !important;
  color: #FFFFFF !important;
}

.view-history-button:active {
  background-color: #08294A!important;
}

.view-history-button:disabled {
  background-color: #D3D3D3; /* Light Gray for disabled state */
  color: #A6A6A6; /* Neutral Gray text */
  cursor: not-allowed;
}

.view-history-button .pi {
  margin-right: 0.3rem;
}

@media (max-width: 768px) {
  .global-search {
    width: 100%;
  }
}
</style>
