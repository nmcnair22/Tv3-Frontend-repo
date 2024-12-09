<!-- src/components/Streamline/ProcessedBillsTable.vue -->

<template>
    <Card title="Processed Bills">
      <DataTable :value="processedBills" selectionMode="single" @row-select="onRowSelect">
        <Column field="fileName" header="File Name" />
        <Column field="status" header="Status" />
        <Column field="processedDate" header="Processed Date" />
        <template #emptymessage>
          <span>No processed bills available.</span>
        </template>
      </DataTable>
    </Card>
  </template>
  
  <script setup lang="ts">
  import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBillImportStore } from '../../store/billImportStore';
  
  const store = useBillImportStore();
  const router = useRouter();
  
  const processedBills = ref([]);
  
  // Fetch processed bills from the store
  const fetchProcessedBills = async () => {
    try {
      await store.fetchProcessedBills();
      processedBills.value = store.processedBills;
    } catch (error) {
      console.error('Error fetching processed bills:', error);
    }
  };
  
  // Handle row selection
  const onRowSelect = (event) => {
    const billId = event.data.id;
    router.push({ name: 'BillDetail', params: { billId } });
  };
  
  onMounted(() => {
    fetchProcessedBills();
  });
  </script>
  
  <style scoped>
  /* Add any specific styles if needed */
  </style>
  