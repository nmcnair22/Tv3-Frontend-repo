<!-- src/components/PaymentsByCustomerModal.vue -->
<template>
  <Dialog
    v-model:visible="visible"
    @hide="onHide"
    header="Payments by Customer"
    :modal="true"
    :style="{ width: '70vw', padding: '1.5rem' }"
    :breakpoints="{ '960px': '95vw' }"
  >
    <div class="card">
      <!-- Table Configuration -->
      <DataTable
        v-model:filters="filters"
        :value="paymentsData"
        stripedRows
        paginator
        showGridlines
        :rows="10"
        dataKey="customer"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['customer', 'amount']"
      >
        <!-- Table Header with Search -->
        <template #header>
          <div class="flex justify-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>

        <!-- Customer Column -->
        <Column field="customer" header="Customer Name" sortable style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.customer }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Search by customer"
            />
          </template>
        </Column>

        <!-- Payment Amount Column -->
        <Column
          header="Payment Amount (USD)"
          field="amount"
          sortable
          filterField="amount"
          dataType="numeric"
          style="min-width: 10rem; text-align: right;"
        >
          <template #body="{ data }">
            <!-- Use getCustomerKey function -->
            <div v-if="data" :key="data.customer">
              <span class="payment-amount" @click="togglePopover($event, data)">
                {{ formatCurrency(data.amount) }}
              </span>

              <!-- Popover Component -->
              <Popover
                :ref="el => { popoverRefs[getCustomerKey(data.customer)] = el }"
                :dismissable="true"
                appendTo="body"
              >
                <div class="popover-content">
                  <h4>Payments for {{ data.customer }}</h4>
                  <!-- Inner DataTable -->
                  <DataTable
                    :value="data.payments"
                    :paginator="true"
                    :rows="5"
                    class="payments-table"
                  >
                  <Column field="postingDate" header="Date" :body="formatDate" />
                  <Column field="amount" header="Amount">
                    <template #body="{ data }">
                      {{ formatCurrency(data.amount) }}
                    </template>
                  </Column>
                  <Column field="documentNo" header="Document No" />
                  <!-- Add more columns as needed -->
                </DataTable>
                </div>
              </Popover>
            </div>
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              mode="currency"
              currency="USD"
              locale="en-US"
              placeholder="Filter by amount"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
</template>

<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Popover from 'primevue/popover';
import { onMounted, reactive, ref, watch } from 'vue';

// Define props and ref variables
const props = defineProps({
  visible: Boolean,
  paymentsData: Array, // This should be paymentsByCustomer from inflowsData
});
const emit = defineEmits(['update:visible']);
const visible = ref(props.visible);
const loading = ref(false);

// Initialize filters
const filters = ref();
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    customer: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    amount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
};

// Clear filters method
const clearFilter = () => {
  initFilters();
};

// Format currency for the amount column
const formatCurrency = (value) => {
  let amount;

  if (typeof value === 'object' && value !== null && value.amount !== undefined) {
    // If value is an object with 'amount' property
    amount = value.amount;
  } else {
    // Assume value is a numerical amount
    amount = value;
  }

  // Convert amount to a number
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return '';

  return numericAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// Format date
const formatDate = (data) => {
  if (!data || !data.postingDate) return '';
  const date = new Date(data.postingDate);
  return date.toLocaleDateString('en-US');
};

// Popover references
const popoverRefs = reactive({});

// Function to compute customerKey
const getCustomerKey = (customerName) => {
  return customerName.replace(/\s+/g, '_');
};

// Toggle Popover
const togglePopover = (event, data) => {
  const customerKey = getCustomerKey(data.customer);
  const popoverRef = popoverRefs[customerKey];

  if (popoverRef) {
    popoverRef.toggle(event);
  } else {
    console.error(`Popover ref not found for customer: ${customerKey}`);
  }
};

// Watch for modal visibility changes
watch(
  () => props.visible,
  (newVal) => {
    visible.value = newVal;
  }
);

const onHide = () => {
  emit('update:visible', false);
};

// On component mount, initialize filters
onMounted(() => {
  initFilters();
});
</script>

<style scoped>
.payment-amount {
  color: #297FB7;
  cursor: pointer;
  text-decoration: underline;
}
.popover-content {
  padding: 1rem;
  width: 400px;
}
.payments-table {
  margin-top: 0.5rem;
}
</style>