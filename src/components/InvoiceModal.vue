<!-- src/components/InvoiceModal.vue -->
<template>
  <Dialog
    :visible="modalVisible"
    @update:visible="handleModalVisibility"
    :header="`Invoice ${invoiceData.number}`"
    :modal="true"
    :style="{ width: '70vw' }"
    :breakpoints="{ '960px': '90vw' }"
    closable
    closeOnEscape
    class="bg-white p-6 rounded-lg shadow-lg"
  >
    <template v-if="isLoading">
      <!-- Loading Spinner -->
      <div class="flex justify-center my-6">
        <ProgressSpinner />
      </div>
    </template>
    <template v-else-if="error">
      <div class="text-red-500 text-center py-4">{{ error }}</div>
    </template>
    <template v-else>
      <div class="invoice-container p-6 bg-white">
        <!-- Header Section -->
        <div class="invoice-header flex flex-col md:flex-row justify-between items-center mb-6">
          <!-- Company Info -->
          <div class="company-info mb-4 md:mb-0">
            <h2 class="text-2xl font-bold">CIS</h2>
            <p class="text-gray-600">REINVENT IT</p>
          </div>
          <!-- Invoice Info -->
          <div class="invoice-info text-center md:text-right">
            <h3 class="text-xl font-bold">Invoice</h3>
            <p><strong>Invoice Number:</strong> {{ invoiceData.number }}</p>
            <p><strong>Invoice Date:</strong> {{ formatDate(invoiceData.postingDate) }}</p>
            <p><strong>Due Date:</strong> {{ formatDate(invoiceData.dueDate) }}</p>
            <p><strong>Status:</strong> <span class="font-semibold">{{ invoiceData.status }}</span></p>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-info mb-6">
          <h4 class="text-lg font-bold mb-2">Bill To:</h4>
          <p class="text-gray-700">{{ invoiceData.customerName }}</p>
          <p class="text-gray-700">{{ invoiceData.customerAddress.line1 }}</p>
          <p v-if="invoiceData.customerAddress.line2" class="text-gray-700">{{ invoiceData.customerAddress.line2 }}</p>
          <p class="text-gray-700">
            {{ invoiceData.customerAddress.city }}, {{ invoiceData.customerAddress.state }}
            {{ invoiceData.customerAddress.postCode }}
          </p>
          <p class="text-gray-700">{{ invoiceData.customerAddress.country }}</p>
        </div>

        <!-- Invoice Line Items -->
        <div class="invoice-lines mb-6">
          <DataTable
  :value="invoiceLines"
  responsiveLayout="scroll"
  paginator
  :rows="10"
  class="min-w-full bg-white invoice-table"
>
            <Column
              field="description"
              header="Description"
              class="text-left px-4 py-2 border-b"
            ></Column>
            <Column
              field="quantity"
              header="Quantity"
              class="text-center px-4 py-2 border-b"
            ></Column>
            <Column
              field="unitPrice"
              header="Unit Price"
              class="text-right px-4 py-2 border-b"
            >
              <template #body="{ data }">
                {{ formatCurrency(data.unitPrice) }}
              </template>
            </Column>
            <Column
              field="amount"
              header="Amount"
              class="text-right px-4 py-2 border-b"
            >
              <template #body="{ data }">
                {{ formatCurrency(data.amount) }}
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Total -->
        <div class="invoice-totals text-right">
          <div class="flex justify-end mb-2">
            <div class="w-full md:w-1/2">
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{{ formatCurrency(totalAmount.value) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-4">
          <Button
            label="Close"
            @click="handleModalVisibility(false)"
            class="apply-button mr-2"
          />
          <Button
            label="Download Invoice"
            icon="pi pi-download"
            @click="downloadInvoice"
            class="apply-button"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
  
<script setup>
import axios from 'axios';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, ref, watch } from 'vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update:visible']);

// State
const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});
const invoiceData = ref({});
const invoiceLines = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Computed Total Amount
const totalAmount = computed(() => {
  return invoiceLines.value.reduce((sum, line) => sum + (line.amount || 0), 0);
});

// Fetch invoice details when the modal is opened
watch(
  () => modalVisible.value,
  (newValue) => {
    if (newValue) {
      fetchInvoiceDetails();
    }
  }
);

async function fetchInvoiceDetails() {
  isLoading.value = true;
  error.value = null;

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const response = await axios.get(`${backendUrl}/financial-dashboard/invoice-details`, {
      params: { invoiceNumber: props.invoiceNumber },
    });

    // Map invoice data
    invoiceData.value = {
      number: response.data.invoice.number,
      customerName: response.data.invoice.customerName,
      customerAddress: {
        line1: response.data.invoice.billToAddressLine1,
        line2: response.data.invoice.billToAddressLine2,
        city: response.data.invoice.billToCity,
        state: response.data.invoice.billToState,
        postCode: response.data.invoice.billToPostCode,
        country: response.data.invoice.billToCountry,
      },
      postingDate: response.data.invoice.postingDate,
      dueDate: calculateDueDate(response.data.invoice.postingDate),
      totalAmount: Number(response.data.invoice.totalAmountIncludingTax) || 0,
      status: 'Paid',
    };

    // Process invoice lines without grouping
    invoiceLines.value = response.data.invoiceLines.map((line) => ({
      description: line.description,
      quantity: Number(line.quantity) || 0,
      unitPrice: Number(line.unitPrice) || 0,
      amount: (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0),
    }));
  } catch (err) {
    console.error('Error fetching invoice details:', err);
    error.value = 'Failed to fetch invoice details.';
  } finally {
    isLoading.value = false;
  }
}

// Function to calculate due date by adding 30 days to the invoice date
function calculateDueDate(invoiceDateString) {
  const invoiceDate = new Date(invoiceDateString);
  if (isNaN(invoiceDate)) {
    return null;
  }
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30); // Add 30 days
  return dueDate.toISOString().split('T')[0]; // Return as 'YYYY-MM-DD' format
}

// Formatting functions
function formatCurrency(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'N/A';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', // Full month name
    day: 'numeric',
  });
}

function handleModalVisibility(value) {
  modalVisible.value = value;
}

function downloadInvoice() {
  // Implement your download logic here
  console.log(`Downloading invoice ${invoiceData.value.number}`);
}
</script>
  
<style scoped>
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

/* Override the paginator active page highlight */
:deep(.invoice-table .p-paginator .p-paginator-page.p-highlight) {
  background-color: #297FB7 !important; /* Desired blue color */
  border-color: #297FB7 !important;
  color: #FFFFFF !important; /* Ensure text is readable */
}

/* Override paginator buttons */
:deep(.invoice-table .p-paginator .p-paginator-page),
:deep(.invoice-table .p-paginator .p-paginator-next),
:deep(.invoice-table .p-paginator .p-paginator-prev) {
  background-color: #FFFFFF !important;
  color: #297FB7 !important;
  border: 1px solid #297FB7 !important;
}

/* Hover states for paginator buttons */
:deep(.invoice-table .p-paginator .p-paginator-page:hover),
:deep(.invoice-table .p-paginator .p-paginator-next:hover),
:deep(.invoice-table .p-paginator .p-paginator-prev:hover) {
  background-color: #297FB7 !important; /* Blue background on hover */
  color: #FFFFFF !important; /* White text/icons on hover */
}

/* Active hover state for highlighted paginator page */
:deep(.invoice-table .p-paginator .p-paginator-page.p-highlight:hover),
:deep(.invoice-table .p-paginator .p-paginator-next:hover),
:deep(.invoice-table .p-paginator .p-paginator-prev:hover) {
  background-color: #1F5F8A !important; /* Darker blue on hover */
  color: #FFFFFF !important;
}

/* Optional: Customize DataTable Pagination Alignment and Spacing */
:deep(.invoice-table .p-paginator) {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

</style>
