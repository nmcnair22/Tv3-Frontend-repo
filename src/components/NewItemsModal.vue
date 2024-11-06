<!-- src/components/NewItemsModal.vue -->
<template>
    <Dialog
      v-model:visible="localVisible"
      :header="modalTitle"
      :modal="true"
      :style="{ width: '70vw' }"
      :breakpoints="{ '960px': '95vw' }"
      @hide="closeModal"
    >
      <DataTable :value="items" :paginator="true" :rows="10" stripedRows>
        <!-- Define columns based on type -->
        <Column field="documentNumber" header="Document Number" />
        <Column field="customerName" header="Customer Name" />
        <Column field="amount" header="Amount">
          <template #body="{ data }">
            {{ formatCurrency(getAmount(data)) }}
          </template>
        </Column>
        <Column field="postingDate" header="Date">
          <template #body="{ data }">
            {{ formatDate(data.postingDate) }}
          </template>
        </Column>
        <!-- Add more columns as needed -->
      </DataTable>
    </Dialog>
  </template>
  
  <script setup>
  import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import { computed, ref, watch } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    type: String, // 'invoices', 'payments', 'credits', 'adjustments'
    items: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['update:visible', 'close']);
  
  // Create a local visible ref
  const localVisible = ref(props.visible);
  
  // Watch for changes in the prop and update localVisible
  watch(
    () => props.visible,
    (newVal) => {
      localVisible.value = newVal;
    }
  );
  
  // Watch for changes in localVisible and emit to parent
  watch(localVisible, (newVal) => {
    emit('update:visible', newVal);
  });
  
  const modalTitle = computed(() => {
    switch (props.type) {
      case 'invoices':
        return 'New Invoices';
      case 'payments':
        return 'New Payments';
      case 'credits':
        return 'New Credits';
      case 'adjustments':
        return 'New Adjustments';
      default:
        return 'Details';
    }
  });
  
  function closeModal() {
    localVisible.value = false;
    emit('update:visible', false);
    emit('close');
  }
  
  function formatCurrency(value) {
    if (typeof value !== 'number') {
      return '$0.00';
    }
  
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  
    return formatter.format(value);
  }
  
  function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US');
  }
  
  function getAmount(data) {
    if (props.type === 'invoices') {
      return parseFloat(data.totalAmountIncludingTax);
    } else if (props.type === 'payments' || props.type === 'credits' || props.type === 'adjustments') {
      return parseFloat(data.creditAmount) || parseFloat(data.debitAmount);
    }
    return 0;
  }
  </script>