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
    >
      <template v-if="payments.length > 0">
        <DataTable
          :value="payments"
          paginator
          :rows="10"
          tableStyle="min-width: 30rem"
          :sortField="'date'"
          :sortOrder="-1"
        >
          <Column field="invoiceNumber" header="Invoice Number" sortable>
            <template #body="{ data }">
              <Button
                label=""
                class="p-button-link"
                @click="openInvoiceModal(data.invoiceNumber)"
              >
                {{ data.invoiceNumber }}
              </Button>
            </template>
          </Column>
          <Column field="formattedDate" header="Payment Date" sortable></Column>
          <Column field="amount" header="Amount" sortable>
            <template #body="{ data }">
              {{ formatCurrency(data.amount) }}
            </template>
          </Column>
        </DataTable>
      </template>
      <template v-else>
        <div>No payments found for this customer in the last 6 months.</div>
      </template>
  
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
import Button from 'primevue/button'; // Import Button component
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Drawer from 'primevue/drawer'; // Ensure you've imported Drawer
import { computed, ref, watch } from 'vue';
import InvoiceModal from './InvoiceModal.vue'; // Import the InvoiceModal component
  
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
      const response = await axios.get(`${backendUrl}/financial-dashboard/customer-payments`, {
        params: { customerNumber: props.customerNumber },
      });
  
      console.log('Fetched customer payments:', response.data);
  
      payments.value = response.data.map((payment) => ({
        invoiceNumber: payment.invoiceNumber,
        date: payment.date, // Raw date for sorting
        formattedDate: formatDate(payment.date), // Formatted date for display
        amount: payment.amount,
      }));
    } catch (err) {
      console.error('Error fetching customer payments:', err);
      error.value = 'Failed to fetch payment history.';
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
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  </script>
  
  <style scoped>
  /* Add any custom styles if needed */
  </style>