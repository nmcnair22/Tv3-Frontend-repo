<!-- src/components/RecentTransactions.vue -->
<template>
    <div class="recent-transactions">
      <div class="transactions-section">
        <h3>Recent Payments</h3>
        <DataTable :value="paymentHistory.payments" :rows="5" paginator responsiveLayout="scroll">
          <Column field="paymentDate" header="Payment Date" />
          <Column field="paymentAmount" header="Amount" />
          <Column field="description" header="Description" />
        </DataTable>
      </div>
      <div class="transactions-section">
        <h3>Unpaid Invoices</h3>
        <DataTable :value="paymentHistory.unpaidInvoices" :rows="5" paginator responsiveLayout="scroll">
          <Column field="invoiceNumber" header="Invoice Number" />
          <Column field="invoiceDate" header="Invoice Date" />
          <Column field="totalAmount" header="Amount" />
          <Column field="dueDate" header="Due Date" />
          <Column field="status" header="Status" />
        </DataTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
  
  const props = defineProps({
    paymentHistory: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .recent-transactions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .transactions-section {
    background-color: #F7F9FC;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .transactions-section h3 {
    margin-bottom: 1rem;
    color: #08294A;
    font-weight: 600;
    font-size: 1.4rem;
  }
  </style>