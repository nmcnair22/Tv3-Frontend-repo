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
      <div v-else class="header-content">
        <!-- Customer Avatar -->
        <div v-if="customerAvatar" class="avatar-container">
          <img :src="customerAvatar" alt="Customer Avatar" class="avatar" />
        </div>
        <div v-else class="avatar-placeholder">
          <i class="pi pi-user"></i>
        </div>
  
        <!-- Customer Information -->
        <div class="customer-info">
          <h1 class="customer-name">{{ customerName }}</h1>
          <p class="customer-number">Customer Number: {{ customerNumber }}</p>
          <!-- Additional metrics -->
          <div class="customer-metrics">
            <div class="metric">
              <span class="metric-label">Credit Score:</span>
              <span class="metric-value">{{ customerData.creditScore }} ({{ creditScoreLabel }})</span>
            </div>
            <!-- Credit Score Bar -->
            <div class="credit-score-bar">
              <div
                class="progress"
                :style="{
                  width: creditScoreBarWidth,
                  background: creditScoreBarGradient,
                }"
              ></div>
            </div>
            <!-- Spend Tier -->
            <div class="metric">
              <span class="metric-label">Spend Tier:</span>
              <span class="metric-badge" :class="spendTierClass">{{ customerData.spendTier }}</span>
            </div>
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
  
  const hasCustomerData = computed(
    () => props.customerData && Object.keys(props.customerData).length > 0
  );
  
  // Updated to use 'displayName' instead of 'name'
  const customerName = computed(
    () => props.customerData.displayName || 'Customer Name'
  );
  const customerNumber = computed(
    () => props.customerData.customerNumber || 'N/A'
  );
  const customerAvatar = computed(() => props.customerData.avatarUrl || null);
  
  // Compute Credit Score Label
  const creditScoreLabel = computed(() => {
    const score = Number(props.customerData.creditScore);
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    if (score > 0) return 'Poor';
    return 'Unknown';
  });
  
  // Calculate Credit Score Bar Width
  const creditScoreBarWidth = computed(() => {
    const score = Number(props.customerData.creditScore);
    const percentage = ((score - 300) / 550) * 100; // Assuming score ranges from 300 to 850
    return `${Math.max(0, Math.min(percentage, 100))}%`;
  });
  
  // Add Gradient to Credit Score Bar
  const creditScoreBarGradient = computed(() => {
    const score = Number(props.customerData.creditScore);
    if (score >= 800)
      return 'linear-gradient(to right, #00c853, #b2ff59)'; // Green gradient
    if (score >= 740)
      return 'linear-gradient(to right, #64dd17, #aeea00)'; // Lime gradient
    if (score >= 670)
      return 'linear-gradient(to right, #ffeb3b, #ffc107)'; // Yellow gradient
    if (score >= 580)
      return 'linear-gradient(to right, #ff9800, #ff5722)'; // Orange gradient
    return 'linear-gradient(to right, #f44336, #d32f2f)'; // Red gradient
  });
  
  const spendTierClass = computed(() => {
    switch (props.customerData.spendTier) {
      case 'Silver':
        return 'badge-silver';
      case 'Gold':
        return 'badge-gold';
      case 'Platinum':
        return 'badge-platinum';
      default:
        return 'badge-default';
    }
  });
  </script>
    
  <style scoped>
  .header-section {
    background-color: #f7f9fc; /* Light background */
    border-bottom: 1px solid #e0e0e0; /* Light border for separation */
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
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #ffffff;
  }
  
  .customer-info {
    flex: 1;
  }
  
  .customer-name {
    margin: 0;
    font-size: 2rem; /* Increase font size */
    font-weight: 700; /* Make it bold */
    color: #08294a; /* Night Sky color */
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
    color: #297fb7; /* Primary Blue */
  }
  
  /* Loading and Error Placeholder Styles */
  .loading-placeholder,
  .error-placeholder {
    text-align: center;
    padding: 2rem;
    font-size: 1.25rem;
    color: #595959;
  }
  
  .customer-metrics {
    margin-top: 1rem;
  }
  
  .metric {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .metric-label {
    font-weight: 600;
    color: #6b7280;
    margin-right: 0.5rem;
  }
  
  .metric-value {
    font-weight: 600;
    color: #08294a;
  }
  
  /* Adjusted credit score bar */
  .credit-score-bar {
    width: 100%;
    background-color: #f3f4f6;
    border-radius: 5px;
    height: 15px;
    margin: 0.5rem 0;
    overflow: hidden;
  }
  
  .credit-score-bar .progress {
    height: 100%;
    transition: width 0.5s ease;
  }
  
  .metric-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    color: #ffffff;
    font-weight: 600;
  }
  
  .badge-silver {
    background-color: #c0c0c0;
  }
  
  .badge-gold {
    background-color: #ffd700;
  }
  
  .badge-platinum {
    background-color: #e5e4e2;
  }
  
  .badge-default {
    background-color: #6b7280;
  }
  </style>
  