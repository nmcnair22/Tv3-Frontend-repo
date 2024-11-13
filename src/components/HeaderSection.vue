<!-- src/components/HeaderSection.vue -->
<template>
    <div class="header-section">
      <!-- Loading and Error States -->
      <div v-if="isLoading" class="loading-placeholder">
        <p>Loading customer information...</p>
      </div>
      <div v-else-if="error" class="error-placeholder">
        <p>Error loading customer information: {{ error }}</p>
      </div>
      <div v-else-if="!hasCustomerData" class="loading-placeholder">
        <p>No customer data available.</p>
      </div>
      <div v-else>
        <!-- Main Header Content -->
        <div class="header-content">
          <!-- Customer Avatar or Logo -->
          <div v-if="customerAvatar" class="avatar-container">
            <img :src="customerAvatar" alt="Customer Avatar" class="avatar" />
          </div>
          <!-- Placeholder Avatar if no image is available -->
          <div v-else class="avatar-placeholder">
            <i class="pi pi-user"></i>
          </div>
  
          <!-- Customer Information -->
          <div class="customer-info">
            <h1 class="customer-name">{{ customerName }}</h1>
            <p class="customer-number">Customer Number: {{ customerNumber }}</p>
            <!-- Additional details can be added here -->
            <p v-if="customerEmail" class="customer-email">
              <i class="pi pi-envelope"></i> {{ customerEmail }}
            </p>
            <p v-if="customerPhone" class="customer-phone">
              <i class="pi pi-phone"></i> {{ customerPhone }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    customerData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  });
  
  // Computed property to check if customerData has data
  const hasCustomerData = computed(() => {
  return props.customerData && typeof props.customerData === 'object' && Object.keys(props.customerData).length > 0;
});
  
  // Safely access properties using optional chaining or default values
  const customerName = computed(() => props.customerData?.name || 'Customer Name');
  const customerNumber = computed(() => props.customerData?.customerNumber || 'N/A');
  const customerEmail = computed(() => props.customerData?.email || null);
  const customerPhone = computed(() => props.customerData?.phone || null);
  const customerAvatar = computed(() => props.customerData?.avatarUrl || null);
  </script>

  <style scoped>
  .header-section {
    background-color: #F7F9FC; /* Light background */
    border-bottom: 1px solid #E0E0E0; /* Light border for separation */
    padding: 1.5rem;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .avatar-container {
    flex-shrink: 0;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #E0E0E0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #FFFFFF;
  }
  
  .customer-info {
    flex: 1;
  }
  
  .customer-name {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #08294A; /* Night Sky color */
  }
  
  .customer-number,
  .customer-email,
  .customer-phone {
    margin: 0.25rem 0;
    color: #595959; /* Dark Gray */
    font-size: 1rem;
  }
  
  .customer-email i,
  .customer-phone i {
    margin-right: 0.5rem;
    color: #297FB7; /* Primary Blue */
  }
  
  /* Loading and Error Placeholder Styles */
  .loading-placeholder,
  .error-placeholder {
    text-align: center;
    padding: 2rem;
    font-size: 1.25rem;
    color: #595959;
  }
  </style>