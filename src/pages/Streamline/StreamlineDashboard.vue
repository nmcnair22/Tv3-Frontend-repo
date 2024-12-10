<template>
  <div class="px-4 py-2 min-h-screen bg-gradient-to-tl from-gray-100 to-gray-50 font-sans text-gray-800">
    <!-- Header -->
    <header class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl xs:text-3xl lg:text-4xl font-bold text-[#0B2244] mb-1">
          Bill Processing Dashboard
        </h1>
        <p class="text-sm xs:text-base md:text-lg text-gray-600 max-w-3xl">
          Monitor, review, and manage the bill scanning and validation pipeline.
        </p>
      </div>
      <div>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          class="p-button-outlined"
          @click="refreshAll"
        />
      </div>
    </header>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
        :value="metrics.billsInQueue"
        icon="pi pi-clock"
        color="orange"
      />
      <KPICard
        title="Bills Needing Audit"
        :value="metrics.billsNeedingAudit"
        icon="pi pi-exclamation-triangle"
        color="red"
      />
    </div>

    <!-- Interval and Global Search -->
    <div class="flex flex-col xs:flex-row xs:items-center gap-4 mb-4">
      <div class="flex flex-col xs:flex-row xs:items-center gap-2 text-sm w-full xs:w-auto">
        <span class="text-gray-700 font-medium whitespace-nowrap">Show records from:</span>
        <Select
          v-model="selectedInterval"
          :options="intervalOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Interval"
          size="small"
          @change="onIntervalChange"
        />
      </div>
      <div class="relative w-full xs:w-48">
        <span class="p-input-icon-left w-full inline-flex items-center">
          <i class="pi pi-search text-gray-500 mr-2"></i>
          <InputText
            v-model="globalFilterValue"
            placeholder="Search"
            size="small"
            class="w-full"
          />
        </span>
      </div>
    </div>

    <!-- Processing Queue Table -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Processing Queue</h2>
      <div class="bg-white rounded-lg shadow-sm p-4 w-full overflow-auto">
        <DataTable
          :value="processingQueue"
          dataKey="id"
          paginator
          :rows="10"
          responsiveLayout="scroll"
          :globalFilter="globalFilterValue"
          :loading="isLoadingProcessingQueue"
          sortMode="single"
        >
          <Column field="id" header="Job ID" sortable />
          <Column field="payload.filePath" header="File Path" sortable />
          <Column field="status" header="Status" sortable />
          <Column field="priority" header="Priority" sortable />
          <Column field="createdAt" header="Enqueued At" :body="formatDate" sortable />
          <Column header="Details" style="min-width:100px;" bodyClass="text-center">
            <template #body="slotProps">
              <Button
                label="Details"
                icon="pi pi-eye"
                class="p-button-text"
                @click="openDrawer(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <!-- Audit Queue Table -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Audit Queue</h2>
      <div class="bg-white rounded-lg shadow-sm p-4 w-full overflow-auto">
        <DataTable
          :value="auditBills"
          dataKey="id"
          paginator
          :rows="10"
          responsiveLayout="scroll"
          :globalFilter="globalFilterValue"
          :loading="isLoadingAuditBills"
          sortMode="single"
        >
          <Column field="id" header="Bill ID" sortable />
          <Column field="customer_name" header="Customer Name" sortable />
          <Column field="invoice_id" header="Invoice ID" sortable />
          <Column field="status" header="Status" sortable />
          <Column field="error_message" header="Issue Description" />
          <Column header="Details" style="min-width:100px;" bodyClass="text-center">
            <template #body="slotProps">
              <Button
                label="Details"
                icon="pi pi-eye"
                class="p-button-text"
                @click="openDrawer(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <!-- Successful Scan Queue Table -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Successful Scan Queue</h2>
      <div class="bg-white rounded-lg shadow-sm p-4 w-full overflow-auto">
        <DataTable
          :value="processedBills"
          dataKey="id"
          paginator
          :rows="10"
          responsiveLayout="scroll"
          :globalFilter="globalFilterValue"
          :loading="isLoadingProcessedBills"
          sortMode="single"
        >
          <Column field="id" header="Bill ID" sortable />
          <Column field="account.customer.name" header="Customer" sortable />
          <Column field="account.account_number" header="Account Number" sortable />
          <Column field="status" header="Status" sortable />
          <Column field="updated_at" header="Processed Date" :body="formatDate" sortable />
          <Column header="Details" style="min-width:100px;" bodyClass="text-center">
            <template #body="slotProps">
              <Button
                label="Details"
                icon="pi pi-eye"
                class="p-button-text"
                @click="openDrawer(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <!-- File Upload Section -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Upload New Bills</h2>
      <FileUpload
        name="files[]"
        :customUpload="true"
        accept=".pdf"
        :maxFileSize="10000000"
        :uploadHandler="uploadBills"
        multiple
      />
    </section>

    <Toast position="top-right" />

    <!-- Details Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      :modal="true"
      :closable="true"
      :style="{ width: drawerWidth }"
      position="right"
    >
      <template #header>
        <div class="w-full h-14 flex items-center px-4 bg-[#0B2244]">
          <h4 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1.5 h-4 bg-[#FFB400] rounded-sm"></span>
            Bill Details
          </h4>
        </div>
      </template>

      <div class="p-4 space-y-6 text-sm text-[#595959] overflow-auto" :style="{ maxHeight: 'calc(100vh - 3rem)' }">
        <div>
          <h5 class="text-base text-[#0B2244] font-semibold flex items-center gap-2 mb-2">
            <i class="pi pi-user text-[#FFB400]"></i> Customer & Account Info
          </h5>
          <div class="bg-[#297FB7]/[0.08] p-3 rounded space-y-1 text-gray-800">
            <div><strong>Customer:</strong> {{ selectedBill?.customer_name || 'N/A' }}</div>
            <div><strong>Account #:</strong> {{ selectedBill?.account_number || 'N/A' }}</div>
            <div><strong>Carrier (Vendor):</strong> {{ selectedBill?.carrier_name || 'N/A' }}</div>
            <div>
              <strong>Amount Due:</strong>
              <span class="text-[#FFB400] font-semibold">{{ formatCurrency(selectedBill?.amount_due) }}</span>
            </div>
            <div><strong>Due Date:</strong> {{ formatDate(selectedBill?.due_date) }}</div>
            <div><strong>Location:</strong> {{ selectedBill?.location_name || 'N/A' }}</div>
          </div>
        </div>

        <!-- PDF Preview Section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h5 class="text-base text-[#0B2244] font-semibold flex items-center gap-2">
              <i class="pi pi-file text-[#FFB400]"></i> Bill Document
            </h5>
            <Button
              label="Download Bill"
              icon="pi pi-download"
              size="small"
              class="p-button-outlined p-button-secondary p-button-sm custom-download-bill-button"
              @click="downloadBill"
            />
          </div>
          <div class="bg-[#297FB7]/[0.08] p-3 rounded space-y-1">
            <!-- If the bill is from the processed bills and has archived_file_path, PDF is available -->
            <!-- If it's from queue or audit and not processed, no PDF -->
            <div v-if="pdfSource(selectedBill)">
              <VuePdfEmbed
                :source="pdfSource(selectedBill)"
                style="width: 100%; height: 700px; border: 1px solid #ccc;"
                @load="onPdfLoad"
                @error="onPdfError"
              />
            </div>
            <div v-else class="text-red-500 text-sm">No PDF available</div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup>
import KPICard from '@/components/Streamline/KPICard.vue';
import { useBillImportStore } from '@/store/billImportStore';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Drawer from 'primevue/drawer';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const billImportStore = useBillImportStore();

const {
  processingQueue,
  auditBills,
  processedBills,
  isLoadingProcessingQueue,
  isLoadingAuditBills,
  isLoadingProcessedBills,
  metrics,
} = storeToRefs(billImportStore);

const globalFilterValue = ref('');
const selectedInterval = ref(24);
const intervalOptions = [
  { label: '24 Hours', value: 24 },
  { label: '48 Hours', value: 48 },
  { label: 'Last Week', value: 168 },
  { label: 'This Month', value: 720 }
];

const drawerVisible = ref(false);
const selectedBill = ref(null);

onMounted(() => {
  refreshAll();
});

function refreshAll() {
  billImportStore.fetchMetrics();
  billImportStore.fetchProcessingQueue();
  billImportStore.fetchAuditBills();
  fetchProcessedBills();
  billImportStore.setupSocket();
}

function onIntervalChange() {
  fetchProcessedBills();
}

function fetchProcessedBills() {
  billImportStore.fetchProcessedBills(selectedInterval.value);
}

async function uploadBills(event) {
  const files = event.files;
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  try {
    await billImportStore.uploadBills(formData);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Bills uploaded successfully!' });
    billImportStore.fetchProcessingQueue();
  } catch (error) {
    console.error('Error uploading bills:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload bills.' });
  }
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (isNaN(date)) return 'N/A';
  return dayjs(date).format('MMM D, YYYY h:mm A');
}

function formatCurrency(value) {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function pdfSource(bill) {
  if (!bill || !bill.archived_file_path) {
    return null;
  }
  const url = `http://localhost:3000/api/bills/file?path=${encodeURIComponent(bill.archived_file_path)}`;
  return url;
}

function onPdfLoad() {
  console.log('PDF loaded successfully!');
}

function onPdfError(err) {
  console.error('PDF failed to load:', err);
}

function downloadBill() {
  if (!selectedBill.value?.archived_file_path) return;
  const url = pdfSource(selectedBill.value);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function openDrawer(bill) {
  // Assign the currently selected row data directly to selectedBill.
  // For processed bills, archived_file_path should already be present from fetchProcessedBills.
  // For queue or audit bills that aren't processed, archived_file_path won't exist, so no PDF.
  selectedBill.value = bill;
  drawerVisible.value = true;
}

const drawerWidth = computed(() => {
  return window.innerWidth < 768 ? '100vw' : '48rem';
});
</script>

<style scoped>
.grid {
  display: grid;
}
</style>
