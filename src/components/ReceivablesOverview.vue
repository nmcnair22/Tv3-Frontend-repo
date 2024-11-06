<!-- src/components/ReceivablesOverview.vue -->
<template>
  <div class="receivables-overview">
    <!-- Existing Stat Cards -->
    <div class="stat-card">
      <h3>Starting Receivables</h3>
      <p>{{ formatCurrency(inflowsData.startingReceivables) }}</p>
    </div>
    <div class="stat-card">
      <h3>Ending Receivables</h3>
      <p>{{ formatCurrency(inflowsData.endingReceivables) }}</p>
    </div>
    <div class="stat-card">
      <h3>Net Change in Receivables</h3>
      <p>{{ formatCurrency(inflowsData.netChangeReceivables) }}</p>
    </div>
    <!-- Clickable Stat Cards with Badges -->
    <div class="stat-card" @click="openModal('invoices')">
      <h3>New Revenue</h3>
      <!-- Badge for New Invoices -->
      <Badge
        v-if="newActivities.newInvoices.count > 0"
        :value="newActivities.newInvoices.count"
        severity="info"
        class="new-badge"
      />
      <p>{{ formatCurrency(inflowsData.totalNewInvoices) }}</p>
    </div>
    <div class="stat-card" @click="openModal('payments')">
      <h3>Payments</h3>
      <!-- Badge for New Payments -->
      <Badge
        v-if="newActivities.newPayments.count > 0"
        :value="newActivities.newPayments.count"
        severity="success"
        class="new-badge"
      />
      <p>{{ formatCurrency(inflowsData.totalPaymentsReceived) }}</p>
    </div>
    <div class="stat-card" @click="openModal('credits')">
      <h3>Credits</h3>
      <!-- Badge for New Credits -->
      <Badge
        v-if="newActivities.newCredits.count > 0"
        :value="newActivities.newCredits.count"
        severity="warning"
        class="new-badge"
      />
      <p>{{ formatCurrency(inflowsData.totalCredits) }}</p>
    </div>
    <div class="stat-card" @click="openModal('adjustments')">
      <h3>Adjustments</h3>
      <!-- Badge for New Adjustments -->
      <Badge
        v-if="newActivities.newAdjustments.count > 0"
        :value="newActivities.newAdjustments.count"
        severity="danger"
        class="new-badge"
      />
      <p>{{ formatCurrency(inflowsData.adjustments) }}</p>
    </div>
    <!-- Optional: Total Change in AR -->
    <div class="stat-card">
      <h3>Total Change in AR</h3>
      <p>{{ formatCurrency(inflowsData.totalChangeInAR) }}</p>
    </div>

    <!-- Modals -->
    <NewItemsModal
      v-if="modalVisible"
      v-model:visible="modalVisible"
      :type="modalType"
      :items="getModalItems()"
      @close="modalVisible = false"
    />
  </div>
</template>

<script setup>
import axios from 'axios';
import Badge from 'primevue/badge';
import { onMounted, ref } from 'vue';
import NewItemsModal from './NewItemsModal.vue';

const props = defineProps({
  inflowsData: {
    type: Object,
    default: () => ({}),
  },
});

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

// Reactive variables for new activities
const newActivities = ref({
  newInvoices: { count: 0, items: [] },
  newPayments: { count: 0, items: [] },
  newCredits: { count: 0, items: [] },
  newAdjustments: { count: 0, items: [] },
});

// Modal state
const modalType = ref(null);
const modalVisible = ref(false);

// Use your backend URL from environment variables or default to 'http://localhost:3000'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

async function fetchNewActivities() {
  try {
    const response = await axios.get(`${backendUrl}/api/local/financial-dashboard/new-activities`);
    newActivities.value = response.data;
    console.log('Fetched new activities:', newActivities.value); // For debugging
  } catch (error) {
    console.error('Error fetching new activities:', error);
  }
}

function openModal(type) {
  modalType.value = type;
  modalVisible.value = true;
}

function getModalItems() {
  const key = 'new' + capitalizeFirstLetter(modalType.value);
  console.log('Getting modal items for key:', key); // For debugging
  if (newActivities.value[key]) {
    return newActivities.value[key].items;
  }
  return [];
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

onMounted(() => {
  fetchNewActivities();
});
</script>

<style scoped>
.receivables-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-card {
  position: relative; /* To position badge */
  background-color: #FFFFFF;
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 calc(16.66% - 1rem);
  min-width: 150px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #297FB7;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; /* Make the stat card clickable */
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  margin-bottom: 0.5rem;
  color: #08294A;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-card p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #297FB7;
  margin: 0;
}

/* Badge styling */
.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Responsive design as before */
@media (max-width: 1200px) {
  .stat-card {
    flex: 1 1 calc(33.333% - 1rem);
  }
}

@media (max-width: 992px) {
  .stat-card {
    flex: 1 1 calc(33.333% - 1rem);
  }
}

@media (max-width: 768px) {
  .stat-card {
    flex: 1 1 calc(50% - 1rem);
  }

  .stat-card p {
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .stat-card {
    flex: 1 1 100%;
  }

  .stat-card h3 {
    font-size: 1rem;
  }

  .stat-card p {
    font-size: 1rem;
  }
}
</style>