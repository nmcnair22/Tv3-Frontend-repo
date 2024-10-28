<!-- src/components/prequal/PrequalRequestForm.vue -->
<template>
    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
      <Card class="shadow-lg">
        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-6">Submit a Prequalification Request</h2>
        <form @submit.prevent="submitRequest">
          <div class="grid grid-cols-12 gap-6">
            <!-- Customer Information Section -->
            <div class="col-span-12 lg:col-span-6">
              <h3 class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-4">Customer Information</h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label for="customerName" class="block text-surface-900 dark:text-surface-0 font-medium mb-1">Customer Name</label>
                  <InputText id="customerName" v-model="form.customerName" type="text" class="w-full" required />
                </div>
                <div>
                  <label for="contactEmail" class="block text-surface-900 dark:text-surface-0 font-medium mb-1">Contact Email</label>
                  <InputText id="contactEmail" v-model="form.contactEmail" type="email" class="w-full" required />
                </div>
                <div>
                  <label for="contactPhone" class="block text-surface-900 dark:text-surface-0 font-medium mb-1">Contact Phone</label>
                  <InputText id="contactPhone" v-model="form.contactPhone" type="tel" class="w-full" required />
                </div>
              </div>
            </div>
  
            <!-- Service Addresses Section -->
            <div class="col-span-12 lg:col-span-6">
              <h3 class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-4">Service Addresses</h3>
              <div v-for="(address, index) in form.serviceAddresses" :key="index" class="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <label class="font-medium text-surface-900 dark:text-surface-0 mb-2 block">Address {{ index + 1 }}</label>
                  </div>
                  <div class="col-span-12 md:col-span-6">
                    <InputText v-model="address.line1" placeholder="Address Line 1" class="w-full mb-2" required />
                  </div>
                  <div class="col-span-12 md:col-span-6">
                    <InputText v-model="address.line2" placeholder="Address Line 2" class="w-full mb-2" />
                  </div>
                  <div class="col-span-12 md:col-span-4">
                    <InputText v-model="address.city" placeholder="City" class="w-full mb-2" required />
                  </div>
                  <div class="col-span-12 md:col-span-4">
                    <InputText v-model="address.state" placeholder="State" class="w-full mb-2" required />
                  </div>
                  <div class="col-span-12 md:col-span-4">
                    <InputText v-model="address.zip" placeholder="ZIP Code" class="w-full mb-2" required />
                  </div>
                  <div class="col-span-12">
                    <Checkbox v-model="address.failover" binary="true" label="Failover (Redundancy)" class="mr-4" />
                    <Checkbox v-model="address.carrierDiversity" binary="true" label="Carrier Diversity" />
                  </div>
                  <div class="col-span-12">
                    <Button label="Remove Address" type="button" icon="pi pi-trash" class="p-button-danger" @click="removeAddress(index)" />
                  </div>
                </div>
              </div>
              <Button label="Add Address" type="button" icon="pi pi-plus" class="p-button-primary" @click="addAddress" />
            </div>
  
            <!-- Optional Data Elements -->
            <div class="col-span-12">
              <Checkbox v-model="form.hasCurrentConnectivity" binary="true" label="Has Current Connectivity" />
            </div>
  
            <!-- Submit Button -->
            <div class="col-span-12">
              <Button label="Submit Request" type="submit" class="p-button-success w-full mt-4" />
            </div>
          </div>
        </form>
      </Card>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePrequalStore } from '../../store/prequalStore'; // Correct import path as per your update
  
  const router = useRouter();
  const prequalStore = usePrequalStore();
  
  const form = ref({
    customerName: '',
    contactEmail: '',
    contactPhone: '',
    serviceAddresses: [
      {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        failover: false,
        carrierDiversity: false,
        // Add more fields as needed
      },
    ],
    hasCurrentConnectivity: false,
    // Add more optional fields as needed
  });
  
  const addAddress = () => {
    form.value.serviceAddresses.push({
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      failover: false,
      carrierDiversity: false,
      // Add more fields as needed
    });
  };
  
  const removeAddress = (index) => {
    form.value.serviceAddresses.splice(index, 1);
  };
  
  const submitRequest = async () => {
    try {
      await prequalStore.submitPrequalRequest(form.value);
      router.push('/prequal/queue'); // Redirect to Queue after submission
    } catch (error) {
      console.error('Error submitting request:', error);
      // Handle error (e.g., show notification)
    }
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  .bg-surface-0 {
    background-color: #f0f4f8;
  }
  
  .dark\:bg-surface-950 {
    background-color: #1a1a1a;
  }
  
  .text-surface-900 {
    color: #1a1a1a;
  }
  
  .dark\:text-surface-0 {
    color: #ffffff;
  }
  
  .border-gray-300 {
    border-color: #d1d5db;
  }
  
  .dark\:border-gray-700 {
    border-color: #374151;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .p-button-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
  
  .p-button-danger {
    background-color: #ef4444;
    border-color: #ef4444;
  }
  
  .p-button-success {
    background-color: #10b981;
    border-color: #10b981;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .mt-6 {
    margin-top: 1.5rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .p-mt-2 {
    margin-top: 0.5rem;
  }
  </style>
  