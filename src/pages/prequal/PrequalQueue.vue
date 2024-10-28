<!-- src/pages/prequal/PrequalQueue.vue -->
<template>
    <div>
      <h2>Prequalification Requests Queue</h2>
      <DataTable
        :value="requests"
        paginator
        rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        class="p-datatable-striped"
      >
        <Column field="requestId" header="Request ID"></Column>
        <Column field="customerName" header="Customer Name"></Column>
        <Column field="numLocations" header="Number of Locations"></Column>
        
        <!-- Service Types Column with Scoped Slot -->
        <Column field="serviceTypes" header="Service Types">
          <template #body="slotProps">
            {{ formatServiceTypes(slotProps.data) }}
          </template>
        </Column>
        
        <!-- Target Dates Column with Scoped Slot -->
        <Column field="targetDates" header="Target Dates">
          <template #body="slotProps">
            {{ formatTargetDates(slotProps.data) }}
          </template>
        </Column>
        
        <!-- Status Column with Scoped Slot and Badge -->
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Badge :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
          </template>
        </Column>
        
        <!-- Actions Column with Scoped Slot and Button -->
        <Column header="Actions" sortable>
          <template #body="slotProps">
            <Button
              label="View"
              icon="pi pi-eye"
              class="p-button-text"
              @click="viewDetail(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePrequalStore } from '../../store/prequalStore';
  
  // Initialize Pinia store and Vue Router
  const prequalStore = usePrequalStore();
  const router = useRouter();
  
  // Reactive variable to hold requests data
  const requests = ref([]);
  
  // Fetch requests when component is mounted
  onMounted(async () => {
    await prequalStore.fetchRequests();
    requests.value = prequalStore.requests;
  });
  
  // Function to format Service Types
  const formatServiceTypes = (row) => {
    return row.serviceAddresses
      .map(addr => addr.connections.map(conn => conn.type).join(', '))
      .join('; ');
  };
  
  // Function to format Target Dates
  const formatTargetDates = (row) => {
    return row.serviceAddresses.map(addr => addr.targetDate).join('; ');
  };
  
  // Function to determine badge severity based on status
  const getSeverity = (status) => {
    switch(status) {
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      case 'On Hold':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  // Function to navigate to detailed view
  const viewDetail = (id) => {
    router.push(`/prequal/detail/${id}`);
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  .p-datatable-striped .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
  </style>
  