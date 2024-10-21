<!-- src/components/PaymentHistoryModal.vue -->
<template>
  <Drawer
    :visible="modalVisible"
    @update:visible="handleModalVisibility"
    position="bottom"
    :header="`Payment History for ${customerName}`"
    :dismissable="true"
    :style="{ height: 'auto' }"
    :breakpoints="{ '960px': '90vw' }"
    closable
    closeOnEscape
    class="bg-white p-6 rounded-lg shadow-lg"
  >
    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>
    <div v-else>
      <template v-if="error">
        <div class="text-center text-red-500 py-4">
          {{ error }}
        </div>
      </template>
      <template v-else-if="payments.length > 0">
        <!-- Wrap DataTable in a div with 'payment-table' class -->
        <div class="payment-table">
          <DataTable
            :value="payments"
            paginator
            :rows="10"
            class="min-w-full bg-white"
            :loading="isLoading"
            :sortField="'paymentDate'"
            :sortOrder="-1"
          >
            <Column
              field="invoiceNumber"
              header="Invoice Number"
              sortable
              class="text-left px-4 py-2 border-b"
            >
              <template #body="{ data }">
                <Button
                  label=""
                  class="apply-button p-button-link"
                  @click="openInvoiceModal(data.invoiceNumber)"
                >
                  {{ data.invoiceNumber }}
                </Button>
              </template>
            </Column>
            <Column
              field="amount"
              header="Payment Amount"
              sortable
              class="text-right px-4 py-2 border-b"
            >
              <template #body="{ data }">
                {{ formatCurrency(data.amount) }}
              </template>
            </Column>
            <Column
              field="paymentDate"
              header="Payment Date"
              sortable
              class="text-left px-4 py-2 border-b"
            >
              <template #body="{ data }">
                {{ formatDate(data.paymentDate) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
      <template v-else>
        <div class="text-center text-gray-500 py-4">
          No payments found for this customer in the selected date range.
        </div>
      </template>
    </div>

    <!-- Invoice Modal -->
    <InvoiceModal
      :visible="isInvoiceModalVisible"
      @update:visible="(value) => (isInvoiceModalVisible = value)"
      :invoiceNumber="selectedInvoiceNumber"
    />
  </Drawer>
</template>

<script setup>
import axios from 'axios';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Drawer from 'primevue/drawer';
import { computed, ref, watch } from 'vue';
import InvoiceModal from './InvoiceModal.vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  customerNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update:visible']);

// State
const payments = ref([]);
const isLoading = ref(false);
const error = ref(null);

// State for the Invoice Modal
const isInvoiceModalVisible = ref(false);
const selectedInvoiceNumber = ref('');

// Computed property for dialog visibility
const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  },
});

// Event handler for dialog visibility update
function handleModalVisibility(value) {
  modalVisible.value = value;
}

// Function to open the Invoice Modal
function openInvoiceModal(invoiceNumber) {
  selectedInvoiceNumber.value = invoiceNumber;
  isInvoiceModalVisible.value = true;
}

// Watch for visibility changes to fetch payments
watch(
  () => modalVisible.value,
  (newValue) => {
    if (newValue) {
      fetchPayments();
    }
  },
);

// Fetch payments when modal is opened
async function fetchPayments() {
  payments.value = []; // Clear previous payments
  isLoading.value = true;
  error.value = null;

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const response = await axios.get(`${backendUrl}/financial-dashboard/customer-payment-history`, {
      params: {
        customerNumber: props.customerNumber,
        // Optionally pass date range
        // startDate: '2023-01-01',
        // endDate: '2023-07-31',
      },
    });

    console.log('Fetched customer payment history:', response.data);

    // Flatten the data into individual invoice payment records
    payments.value = response.data.flatMap((payment) =>
      payment.relatedInvoices.map((invoice) => ({
        invoiceNumber: invoice.invoiceNumber,
        amount: Math.abs(invoice.amount), // Amount paid towards the invoice
        paymentDate: payment.paymentDate,
      }))
    );
  } catch (err) {
    console.error('Error fetching customer payment history:', err);
    error.value = 'Failed to fetch payment history. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}
// Formatting functions
function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<style scoped>
.apply-button {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
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

/* Override the paginator active page highlight */
:deep(.payment-table .p-paginator .p-paginator-page.p-highlight) {
  background-color: #297FB7 !important; /* Desired blue color */
  border-color: #297FB7 !important;
  color: #FFFFFF !important; /* Ensure text is readable */
}

/* Override paginator buttons */
:deep(.payment-table .p-paginator .p-paginator-page),
:deep(.payment-table .p-paginator .p-paginator-next),
:deep(.payment-table .p-paginator .p-paginator-prev) {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
}

/* Hover states for paginator buttons */
:deep(.payment-table .p-paginator .p-paginator-page:hover),
:deep(.payment-table .p-paginator .p-paginator-next:hover),
:deep(.payment-table .p-paginator .p-paginator-prev:hover) {
  background-color: #297FB7 !important; /* Blue background on hover */
  color: #FFFFFF !important; /* White text/icons on hover */
}

/* Active hover state for highlighted paginator page */
:deep(.payment-table .p-paginator .p-paginator-page.p-highlight:hover),
:deep(.payment-table .p-paginator .p-paginator-next:hover),
:deep(.payment-table .p-paginator .p-paginator-prev:hover) {
  background-color: #1F5F8A !important; /* Darker blue on hover */
  color: #FFFFFF !important;
}

/* Optional: Customize DataTable Pagination Alignment and Spacing */
:deep(.payment-table .p-paginator) {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
</style>