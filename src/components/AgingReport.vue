<!-- src/components/AgingReport.vue -->
<template>
  <div class="aging-report">
    <h2>Aging Report{{ formattedAsOfDate ? ': ' + formattedAsOfDate : '' }}</h2>
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
          class="w-1/4 p-inputtext-sm"
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
        tableStyle="min-width: 70rem"
        filterDisplay="menu"
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
          style="min-width: 10rem; text-align: center"
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
          style="min-width: 10rem; text-align: center"
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
          style="min-width: 10rem; text-align: center"
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
          style="min-width: 10rem; text-align: center"
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
          style="min-width: 10rem; text-align: center"
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
              class="p-button-text p-button-info"
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
  console.log('Opening modal for customerNumber:', customerNumber, 'customerName:', customerName);
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

.table-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
}
</style>