<!-- src/pages/prequal/PrequalDetail.vue -->
<template>
    <div>
      <h2>Request Detail - {{ request.requestId }}</h2>
      
      <!-- Customer Information and Status -->
      <div class="p-grid">
        <div class="p-col-12 p-md-6">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {{ request.customerName }}</p>
          <p><strong>Email:</strong> {{ request.contactEmail }}</p>
          <p><strong>Phone:</strong> {{ request.contactPhone }}</p>
        </div>
        <div class="p-col-12 p-md-6">
          <h3>Status</h3>
          <Badge :value="request.status" :severity="getSeverity(request.status)" />
        </div>
      </div>
      
      <!-- Service Addresses -->
      <h3>Service Addresses</h3>
      <DataTable :value="request.serviceAddresses" class="p-datatable-striped">
        <Column field="line1" header="Address Line 1"></Column>
        <Column field="city" header="City"></Column>
        <Column field="state" header="State"></Column>
        <Column field="zip" header="ZIP"></Column>
        <Column field="connections" header="Connections">
          <template #body="slotProps">
            {{ connectionsBody(slotProps.data) }}
          </template>
        </Column>
      </DataTable>
      
      <!-- Notes Feed -->
      <h3>Notes</h3>
      <NotesFeed :requestId="request.id" />
      
      <!-- Toast Notifications -->
      <Toast />
    </div>
  </template>
  
  <script setup>
  import Badge from 'primevue/badge';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import NotesFeed from '../../components/NotesFeed.vue';
import { usePrequalStore } from '../../store/prequalStore';
  
  // Initialize Toast
  const toast = useToast();
  
  // Initialize the store and router
  const prequalStore = usePrequalStore();
  const route = useRoute();
  
  // Reactive variable to hold the request details
  const request = ref({});
  
  // Fetch request details on component mount
  onMounted(async () => {
    const requestId = route.params.id;
    await prequalStore.fetchRequestDetail(requestId);
    request.value = prequalStore.currentRequest;
  
    // Handle case where request is not found
    if (!request.value.requestId) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Request not found.',
        life: 3000
      });
    }
  });
  
  // Custom body template for Connections column
  const connectionsBody = (row) => {
    return row.connections.map(conn => `${conn.type} (${conn.design})`).join(', ');
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
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  