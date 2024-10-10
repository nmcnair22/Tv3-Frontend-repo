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
    >
      <template v-if="isLoading">
        <!-- Loading Spinner -->
        <div class="flex justify-center my-6">
          <ProgressSpinner />
        </div>
      </template>
      <template v-else-if="error">
        <div class="text-red-500">{{ error }}</div>
      </template>
      <template v-else>
        <div class="invoice-container p-6 bg-white">
          <!-- Header Section -->
          <div class="invoice-header flex justify-between items-center mb-6">
            <!-- Company Info -->
            <div class="company-info">
              <h2 class="text-2xl font-bold">CIS</h2>
              <p>REINVENT IT</p>
            </div>
            <!-- Invoice Info -->
            <div class="invoice-info text-right">
              <h3 class="text-xl font-bold">Invoice</h3>
              <p><strong>Invoice Number:</strong> {{ invoiceData.number }}</p>
              <p><strong>Invoice Date:</strong> {{ formatDate(invoiceData.postingDate) }}</p>
              <p><strong>Due Date:</strong> {{ formatDate(invoiceData.dueDate) }}</p>
              <p><strong>Status:</strong> {{ invoiceData.status }}</p>
            </div>
          </div>
  
          <!-- Customer Information -->
          <div class="customer-info mb-6">
            <h4 class="text-lg font-bold">Bill To:</h4>
            <p>{{ invoiceData.customerName }}</p>
            <p>{{ invoiceData.customerAddress.line1 }}</p>
            <p v-if="invoiceData.customerAddress.line2">{{ invoiceData.customerAddress.line2 }}</p>
            <p>
              {{ invoiceData.customerAddress.city }}, {{ invoiceData.customerAddress.state }}
              {{ invoiceData.customerAddress.postCode }}
            </p>
            <p>{{ invoiceData.customerAddress.country }}</p>
          </div>
  
          <!-- Invoice Line Items -->
          <div class="invoice-lines mb-6">
            <DataTable
              :value="invoiceLines"
              responsiveLayout="scroll"
              paginator
              :rows="10"
            >
              <Column field="description" header="Description"></Column>
              <Column field="quantity" header="Quantity" class="text-center"></Column>
              <Column
                field="unitPrice"
                header="Unit Price"
                class="text-right"
              >
                <template #body="{ data }">
                  {{ formatCurrency(data.unitPrice) }}
                </template>
              </Column>
              <Column
                field="amount"
                header="Amount"
                class="text-right"
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
        </div>
      </template>
    </Dialog>
  </template>
  
  <script setup>
  import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner'; // For loading indicator
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
  
  function handleModalVisibility(value) {
    modalVisible.value = value;
  }
  
  const invoiceData = ref({});
  const invoiceLines = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  const totalAmount = ref(0);
  
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
  
      // Calculate total amount from line items
      totalAmount.value = invoiceLines.value.reduce((sum, line) => sum + (line.amount || 0), 0);
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
  </script>
  
  <style scoped>
  .invoice-container {
    /* Styles for the invoice container */
  }
  .invoice-header,
  .customer-info,
  .invoice-lines,
  .invoice-totals {
    /* Styles for each section */
  }
  .invoice-totals span {
    display: inline-block;
    min-width: 100px;
  }
  </style>