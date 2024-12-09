<!-- src/pages/Streamline/StreamlineDashboard.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Streamline Dashboard</h1>

    <!-- KPI Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <KPICard
        title="Total Bills Processed"
        :value="metrics.totalBillsProcessed"
        icon="pi pi-file"
        color="blue"
      />
      <KPICard
        title="Validation Pass Rate"
        :value="metrics.validationPassRate"
        unit="%"
        icon="pi pi-check-circle"
        color="green"
      />
      <KPICard
        title="Bills in Queue"
        :value="processingQueue.length"
        icon="pi pi-clock"
        color="orange"
      />
      <KPICard
        title="Bills Needing Audit"
        :value="auditBills.length"
        icon="pi pi-exclamation-triangle"
        color="red"
      />
    </div>

    <!-- Search and Filter -->
    <div class="mb-6">
      <InputText
        v-model="searchQuery"
        placeholder="Search bills..."
        class="w-full md:w-1/2"
        @input="onSearch"
      />
    </div>

    <!-- Processing Queue Section -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Processing Queue</h2>
      <DataTable
        :value="filteredProcessingQueue"
        :paginator="true"
        :rows="10"
        :loading="isLoadingProcessingQueue"
      >
        <Column field="id" header="Job ID" sortable />
        <Column field="filePath" header="File Path" sortable />
        <Column header="Enqueued At" :body="formatQueueDate" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="priority" header="Priority" sortable />
      </DataTable>
    </div>

    <!-- Audit Bills Section -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Bills Needing Audit</h2>
      <DataTable
        :value="filteredAuditBills"
        :paginator="true"
        :rows="10"
        :loading="isLoadingAuditBills"
      >
        <Column field="id" header="Bill ID" sortable />
        <Column header="Customer Name" :body="auditCustomerNameBodyTemplate" sortable />
        <Column header="Account Number" :body="auditAccountNumberBodyTemplate" sortable />
        <Column field="error_message" header="Issue Description" />
        <Column field="status" header="Status" sortable />
        <Column
          header="Actions"
          :body="auditActionBodyTemplate"
          bodyClass="text-center"
        />
      </DataTable>
    </div>

    <!-- Processed Bills Section -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Recently Processed Bills</h2>
      <div class="flex items-center mb-2">
        <span class="p-float-label mr-2 w-32">
          <InputNumber v-model="hours" :min="1" :max="168" @blur="fetchProcessedBills" />
          <label>Hours</label>
        </span>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          class="p-button-outlined"
          @click="fetchProcessedBills"
        />
      </div>
      <DataTable
        :value="filteredProcessedBills"
        :paginator="true"
        :rows="10"
        :loading="isLoadingProcessedBills"
      >
        <Column field="id" header="Bill ID" sortable />
        <Column header="Customer Name" :body="customerNameBodyTemplate" sortable />
        <Column header="Account Number" :body="accountNumberBodyTemplate" sortable />
        <Column field="status" header="Status" sortable />
        <Column header="Processed Date" :body="formatDate" sortable />
        <Column
          header="Actions"
          :body="processedActionBodyTemplate"
          bodyClass="text-center"
        />
      </DataTable>
    </div>

    <!-- File Upload Section -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Upload New Bills</h2>
      <FileUpload
        name="files[]"
        :customUpload="true"
        accept=".pdf"
        :maxFileSize="10000000"
        :uploadHandler="uploadBills"
        multiple
      />
    </div>

    <!-- Toast for Notifications -->
    <Toast ref="toast" position="top-right" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBillImportStore } from '../../store/billImportStore';

import 'primeicons/primeicons.css';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import KPICard from '../../components/Streamline/KPICard.vue';

// Import dayjs for date formatting
import dayjs from 'dayjs';

const router = useRouter();
const toast = useToast();
const billImportStore = useBillImportStore();

// Destructure state variables from the store
const {
  processingQueue,
  auditBills,
  processedBills,
  isLoadingProcessingQueue,
  isLoadingAuditBills,
  isLoadingProcessedBills,
  metrics,
} = storeToRefs(billImportStore);

// Local state
const searchQuery = ref('');
const hours = ref(24);

// Methods

// Format Date for Processed Bills
const formatDate = (rowData) => {
  const dateField = rowData.updated_at || rowData.processedAt || rowData.created_at;
  return dateField ? dayjs(dateField).format('MMM D, YYYY h:mm A') : 'N/A';
};

// Format Date for Processing Queue
const formatQueueDate = (rowData) => {
  const dateField = rowData.enqueuedAt || rowData.createdAt || rowData.created_at;
  return dateField ? dayjs(dateField).format('MMM D, YYYY h:mm A') : 'N/A';
};

// Customer Name Body Template for Processed Bills
const customerNameBodyTemplate = (rowData) => {
  return rowData.customerName || 'N/A';
};

// Account Number Body Template for Processed Bills
const accountNumberBodyTemplate = (rowData) => {
  return rowData.accountNumber || 'N/A';
};

// Audit Customer Name Body Template
const auditCustomerNameBodyTemplate = (rowData) => {
  return rowData.customerName || 'N/A';
};

// Audit Account Number Body Template
const auditAccountNumberBodyTemplate = (rowData) => {
  return rowData.accountNumber || 'N/A';
};

// Fetch data methods
const fetchProcessedBills = () => {
  billImportStore.fetchProcessedBills(hours.value);
};

const uploadBills = async (event) => {
  const files = event.files;
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  try {
    await billImportStore.uploadBills(formData);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Bills uploaded successfully!' });
    // Refresh the processing queue
    billImportStore.fetchProcessingQueue();
  } catch (error) {
    console.error('Error uploading bills:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload bills.' });
  }
};

// Action templates
const auditActionBodyTemplate = (rowData) => {
  return h(Button, {
    label: 'Review',
    icon: 'pi pi-search',
    class: 'p-button-text',
    onClick: () => viewAuditBillDetails(rowData),
  });
};

const processedActionBodyTemplate = (rowData) => {
  return h(Button, {
    label: 'View',
    icon: 'pi pi-eye',
    class: 'p-button-text',
    onClick: () => viewBillDetails(rowData),
  });
};

// Navigation methods
const viewAuditBillDetails = (bill) => {
  router.push({ name: 'BillDetail', params: { billId: bill.id } });
};

const viewBillDetails = (bill) => {
  router.push({ name: 'BillDetail', params: { billId: bill.id } });
};

// Search and Filtering
const onSearch = () => {
  searchQuery.value = searchQuery.value.trim().toLowerCase();
};

const filteredProcessingQueue = computed(() => {
  if (!searchQuery.value) return processingQueue.value;
  const query = searchQuery.value.toLowerCase();
  return processingQueue.value.filter((item) => {
    const idMatch = item.id.toString().includes(query);
    const statusMatch = (item.status || '').toLowerCase().includes(query);
    const filePathMatch = (item.filePath || '').toLowerCase().includes(query);
    return idMatch || statusMatch || filePathMatch;
  });
});

const filteredAuditBills = computed(() => {
  if (!searchQuery.value) return auditBills.value;
  const query = searchQuery.value.toLowerCase();
  return auditBills.value.filter((item) => {
    const idMatch = item.id.toString().includes(query);
    const statusMatch = (item.status || '').toLowerCase().includes(query);
    const customerNameMatch = item.customerName.toLowerCase().includes(query);
    const accountNumberMatch = item.accountNumber.toLowerCase().includes(query);
    return idMatch || statusMatch || customerNameMatch || accountNumberMatch;
  });
});

const filteredProcessedBills = computed(() => {
  if (!searchQuery.value) return processedBills.value;
  const query = searchQuery.value.toLowerCase();
  return processedBills.value.filter((item) => {
    const idMatch = item.id.toString().includes(query);
    const statusMatch = (item.status || '').toLowerCase().includes(query);
    const customerNameMatch = item.customerName.toLowerCase().includes(query);
    const accountNumberMatch = item.accountNumber.toLowerCase().includes(query);
    return idMatch || statusMatch || customerNameMatch || accountNumberMatch;
  });
});

// Lifecycle hook
onMounted(() => {
  billImportStore.fetchMetrics();
  billImportStore.fetchProcessingQueue();
  billImportStore.fetchAuditBills();
  fetchProcessedBills();
  billImportStore.setupSocket();
});
</script>

<style scoped>
.grid {
  display: grid;
}
</style>