<template>
  <div class="px-4 py-2 min-h-screen bg-gradient-to-tl from-gray-100 to-gray-50 font-sans text-gray-800">
    <!-- Header -->
    <header class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl xs:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
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
      <h2 class="text-xl font-semibold mb-2 text-gray-800">Processing Queue</h2>
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

          <!-- Current Step/Status Column with Progress Bar -->
          <Column header="Current Step" style="min-width:200px;">
            <template #body="slotProps">
              <div class="text-sm">
                <div v-if="jobUpdates[slotProps.data.id]">
                  <strong>Status:</strong> {{ jobUpdates[slotProps.data.id].status || 'N/A' }}<br/>
                  <strong>Step:</strong> {{ jobUpdates[slotProps.data.id].step || 'N/A' }}<br/>
                  <span v-if="jobUpdates[slotProps.data.id].detail">
                    <strong>Detail:</strong> {{ jobUpdates[slotProps.data.id].detail }}
                  </span>
                  <div class="mt-2">
                    <ProgressBar
                      :value="getJobProgress(jobUpdates[slotProps.data.id])"
                      :style="{ width: '100%' }"
                      :showValue="true"
                    />
                  </div>
                </div>
                <div v-else>
                  No updates yet...
                  <div class="mt-2">
                    <ProgressBar :value="0" :style="{ width: '100%' }" :showValue="true" />
                  </div>
                </div>
              </div>
            </template>
          </Column>

          <!-- Events Button Instead of Details -->
          <Column header="Events" style="min-width:100px;" bodyClass="text-center">
            <template #body="slotProps">
              <Button
                label="Events"
                icon="pi pi-list"
                class="p-button-text"
                @click="openEventsDrawer(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <!-- Tabs for Audit Queue and Missing Bills -->
    <Tabs value="0">
      <TabList>
        <Tab value="0">Audit Queue</Tab>
        <Tab value="1" @click="fetchMissingBillsData">
          Missing Bills
          <Badge :value="missingBills.length" class="ml-2" severity="info" />
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <!-- Audit Queue Table -->
          <section class="mb-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-800">Audit Queue</h2>
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
        </TabPanel>

        <TabPanel value="1">
          <!-- Missing Bills Table -->
          <section class="mb-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-800">Missing Bills</h2>
            <div class="bg-white rounded-lg shadow-sm p-4 w-full overflow-auto">
              <DataTable
                :value="missingBills"
                dataKey="accountId"
                paginator
                :rows="10"
                responsiveLayout="scroll"
                :loading="isLoadingMissingBills"
                sortMode="single"
                :globalFilter="globalFilterValue"
                filterDisplay="menu"
                rowHover
                stripedRows
                showGridlines
                v-model:expandedRows="expandedMissingRows"
              >
                <Column expander style="width:2rem;"></Column>
                <Column field="accountNumber" header="Account Number" sortable />
                <Column field="customerName" header="Customer" sortable />
                <Column field="locationName" header="Location" sortable />
                <Column field="vendorName" header="Vendor" sortable />
                <Column field="lastBillDueDate" header="Last Bill Due" sortable />
                <Column field="missingBillDueIn" header="Missing Bill Due In (days)" sortable />

                <!-- Updated Expansion Template for cleaner formatting -->
                <template #expansion="slotProps">
                  <div class="p-4 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                    <!-- Billing Details Section -->
                    <div class="mb-4">
                      <h5 class="text-base text-gray-800 font-semibold mb-2 flex items-center gap-2">
                        <i class="pi pi-file text-yellow-500"></i> Billing Details
                      </h5>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span class="font-medium">Last Invoice Date:</span> {{ slotProps.data.lastInvoiceDate || 'N/A' }}<br/>
                          <span class="font-medium">Last Invoice Amount:</span> {{ formatCurrency(slotProps.data.lastInvoiceAmount) }}<br/>
                          <span class="font-medium">Expected Amount:</span> {{ formatCurrency(slotProps.data.expectedAmount) }}<br/>
                          <span class="font-medium">Pay Type:</span> {{ slotProps.data.payType || 'N/A' }}
                        </div>
                        <div>
                          <span class="font-medium">Notes:</span> {{ slotProps.data.notes || 'N/A' }}<br/>
                          <span class="font-medium">Bill Notes:</span> {{ slotProps.data.billNotes || 'N/A' }}
                        </div>
                      </div>
                    </div>

                    <!-- Vendor Info Section -->
                    <div class="mb-4 border-t border-gray-200 pt-4">
                      <h5 class="text-base text-gray-800 font-semibold mb-2 flex items-center gap-2">
                        <i class="pi pi-briefcase text-blue-500"></i> Vendor Information
                      </h5>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span class="font-medium">Vendor Short Name:</span> {{ slotProps.data.vendorShortName || 'N/A' }}<br/>
                          <span class="font-medium">Vendor Name on Check:</span> {{ slotProps.data.vendorNameOnCheck || 'N/A' }}<br/>
                          <span class="font-medium">Vendor Phone:</span> {{ slotProps.data.vendorPhone || 'N/A' }}<br/>
                          <span class="font-medium">Vendor Email:</span> {{ slotProps.data.vendorEmail || 'N/A' }}
                        </div>
                        <div>
                          <span class="font-medium">Vendor Address:</span><br/>
                          <span v-if="slotProps.data.vendorAddress" class="ml-4 block">
                            <span v-if="slotProps.data.vendorAddress.address1">{{ slotProps.data.vendorAddress.address1 }}<br/></span>
                            <span v-if="slotProps.data.vendorAddress.address2">{{ slotProps.data.vendorAddress.address2 }}<br/></span>
                            <span>{{ slotProps.data.vendorAddress.city }}, {{ slotProps.data.vendorAddress.state }} {{ slotProps.data.vendorAddress.zip }}</span>
                          </span>
                          <span v-else class="ml-4 block text-gray-500">N/A</span>
                        </div>
                      </div>
                    </div>

                    <!-- Location Info Section -->
                    <div class="border-t border-gray-200 pt-4">
                      <h5 class="text-base text-gray-800 font-semibold mb-2 flex items-center gap-2">
                        <i class="pi pi-map-marker text-green-500"></i> Location Information
                      </h5>
                      <div>
                        <span class="font-medium">Location Address:</span><br/>
                        <span v-if="slotProps.data.locationAddress" class="ml-4 block">
                          <span v-if="slotProps.data.locationAddress.address">{{ slotProps.data.locationAddress.address }}<br/></span>
                          <span v-if="slotProps.data.locationAddress.suite">{{ slotProps.data.locationAddress.suite }}<br/></span>
                          <span>{{ slotProps.data.locationAddress.city }}, {{ slotProps.data.locationAddress.state }} {{ slotProps.data.locationAddress.zipcode }}</span><br/>
                          <span v-if="slotProps.data.locationAddress.country">Country: {{ slotProps.data.locationAddress.country }}</span>
                        </span>
                        <span v-else class="ml-4 block text-gray-500">N/A</span>
                      </div>
                    </div>
                  </div>
                </template>
              </DataTable>
            </div>
          </section>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- Successful Scan Queue Table -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2 text-gray-800">Successful Scan Queue</h2>
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
          <!-- Make Bill ID clickable -->
          <Column field="id" header="Bill ID" sortable>
            <template #body="slotProps">
              <router-link
                :to="`/streamline/bill/${slotProps.data.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ slotProps.data.id }}
              </router-link>
            </template>
          </Column>

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
      <h2 class="text-xl font-semibold mb-2 text-gray-800">Upload New Bills</h2>
      <FileUpload
        ref="fileUploadRef"
        name="files"
        :multiple="true"
        accept=".pdf"
        :maxFileSize="10000000"
        :customUpload="true"
        @uploader="onCustomUpload"
        :previewWidth="0"
      >
        <template #empty>
          <span>Drag and drop PDF files here, or click to select.</span>
        </template>
        <template #file="{ file }">
          <div class="flex align-items-center gap-2 p-2 border-b border-gray-200">
            <i class="pi pi-file-pdf" style="font-size: 1.5rem; color: #db4437;"></i>
            <div class="flex flex-col">
              <span class="font-medium text-gray-800 text-sm">{{ file.name }}</span>
              <small class="text-gray-500">{{ formatSize(file.size) }}</small>
            </div>
            <Tag value="Pending" severity="warning" class="px-2 py-1 text-xs" />
            <Button icon="pi pi-times" class="p-button-text p-button-danger p-1" @click="onRemove(file)" />
          </div>
        </template>
      </FileUpload>
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
        <div class="w-full h-14 flex items-center px-4 bg-gray-800">
          <h4 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1.5 h-4 bg-yellow-500 rounded-sm"></span>
            Bill Details
          </h4>
        </div>
      </template>

      <div class="p-4 space-y-6 text-sm text-gray-700 overflow-auto" :style="{ maxHeight: 'calc(100vh - 3rem)' }">
        <div>
          <h5 class="text-base text-gray-800 font-semibold flex items-center gap-2 mb-2">
            <i class="pi pi-user text-yellow-500"></i> Customer & Account Info
          </h5>
          <div class="bg-gray-50 p-3 rounded space-y-1">
            <div><strong>Customer:</strong> {{ selectedBill?.customer_name || 'N/A' }}</div>
            <div><strong>Account #:</strong> {{ selectedBill?.account_number || 'N/A' }}</div>
            <div><strong>Carrier (Vendor):</strong> {{ selectedBill?.carrier_name || 'N/A' }}</div>
            <div>
              <strong>Amount Due:</strong>
              <span class="text-yellow-600 font-semibold">{{ formatCurrency(selectedBill?.amount_due) }}</span>
            </div>
            <div><strong>Due Date:</strong> {{ formatDate(selectedBill?.due_date) }}</div>
            <div><strong>Location:</strong> {{ selectedBill?.location_name || 'N/A' }}</div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h5 class="text-base text-gray-800 font-semibold flex items-center gap-2">
              <i class="pi pi-file text-yellow-500"></i> Bill Document
            </h5>
            <Button
              label="Download Bill"
              icon="pi pi-download"
              size="small"
              class="p-button-outlined p-button-secondary p-button-sm"
              @click="downloadBill"
            />
          </div>
          <div class="bg-gray-50 p-3 rounded space-y-1">
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

    <!-- Events Drawer -->
    <Drawer
      v-model:visible="eventsDrawerVisible"
      :modal="true"
      :closable="true"
      :style="{ width: '30rem' }"
      position="right"
    >
      <template #header>
        <div class="w-full h-14 flex items-center px-4 bg-gray-800">
          <h4 class="text-lg font-semibold text-white flex items-center gap-2">
            <span class="w-1.5 h-4 bg-yellow-500 rounded-sm"></span>
            Event Logs for {{ selectedJobId || 'Unknown Job' }}
          </h4>
        </div>
      </template>

      <div class="p-4 space-y-2 overflow-auto" :style="{ maxHeight: 'calc(100vh - 3rem)' }">
        <div v-if="isLoadingEvents" class="text-gray-600 text-sm">
          Loading events...
        </div>
        <div v-else-if="selectedJobEvents.length === 0" class="text-gray-600 text-sm">
          No events found for this job.
        </div>
        <div v-else>
          <div v-for="event in selectedJobEvents" :key="event.id" class="border-b pb-2 mb-2">
            <div class="text-sm text-gray-800 font-medium">
              {{ event.type }}: {{ event.message }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatDate(event.createdAt) }}
            </div>
            <div v-if="event.data" class="mt-1 p-2 bg-gray-50 rounded text-xs text-gray-700 whitespace-pre-wrap">
              Additional Data: {{ JSON.stringify(event.data, null, 2) }}
            </div>
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
import ProgressBar from 'primevue/progressbar';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useRouter } from 'vue-router';

// Tab imports
import Badge from 'primevue/badge';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

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
  selectedJobEvents,
  selectedJobId,
  isLoadingEvents,
  missingBills,
  isLoadingMissingBills
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
const eventsDrawerVisible = ref(false);

const fileUploadRef = ref(null);

const jobUpdates = computed(() => billImportStore.jobUpdates);
const displayedJobMessages = new Set();
const expandedMissingRows = ref({});

onMounted(() => {
  refreshAll();
});

watch(processingQueue, (newVal) => {
  newVal.forEach(job => {
    billImportStore.registerJobListeners(job.id);
  });
}, { immediate: true });

watch(jobUpdates, (newVal) => {
  for (const jobId in newVal) {
    const jobData = newVal[jobId];

    if (jobData.status === 'Completed' && jobData.step === 'ProcessingCompleted') {
      if (!displayedJobMessages.has(jobId)) {
        toast.add({ severity: 'success', summary: `Job ${jobId} Completed`, detail: jobData.detail || 'Bill processed successfully!', life: 3000 });
        displayedJobMessages.add(jobId);
      }
    } else if (jobData.status === 'Duplicate') {
      if (!displayedJobMessages.has(jobId)) {
        toast.add({ severity: 'warn', summary: `Job ${jobId} Duplicate`, detail: 'This bill is a duplicate.', life: 3000 });
        displayedJobMessages.add(jobId);
      }
    } else if (jobData.status === 'Error') {
      if (!displayedJobMessages.has(jobId)) {
        toast.add({ severity: 'error', summary: `Error (Job ${jobId})`, detail: jobData.error || 'An error occurred.', life: 3000 });
        displayedJobMessages.add(jobId);
      }
    }
  }
}, { deep: true });

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

async function fetchMissingBillsData() {
  await billImportStore.fetchMissingBills();
}

async function onCustomUpload(event) {
  const files = event.files;
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  try {
    await billImportStore.uploadBills(formData);
    toast.add({ severity: 'info', summary: 'Queued', detail: 'File(s) successfully queued for processing.', life: 3000 });
  } catch (error) {
    console.error('Error uploading bills:', error);
    toast.add({ severity: 'error', summary: 'Upload Error', detail: 'Failed to queue files.', life: 3000 });
  } finally {
    fileUploadRef.value.clear();
  }
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (isNaN(date)) return 'N/A';
  return dayjs(date).format('MMM D, YYYY h:mm A');
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function onRemove(file) {
  console.log('Remove file', file.name);
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
  selectedBill.value = bill;
  drawerVisible.value = true;
}

async function openEventsDrawer(jobId) {
  await billImportStore.fetchEventsForJob(jobId);
  eventsDrawerVisible.value = true;
}

const drawerWidth = computed(() => {
  return window.innerWidth < 768 ? '100vw' : '48rem';
});

function getJobProgress(jobData) {
  if (!jobData) return 0;

  const { status, step } = jobData;
  if (status === 'Completed') return 100;
  if (status === 'Duplicate') return 100;
  if (status === 'Audit') return 50;
  if (status === 'Error') return 0;

  if (!step) return 0;
  const stepLower = step.toLowerCase();

  if (stepLower.includes('analysis')) {
    if (stepLower.includes('completed')) return 20;
    return 10;
  }

  if (stepLower.includes('billtype')) {
    return 40;
  }

  if (stepLower.includes('validation')) {
    if (stepLower.includes('passed')) return 60;
    if (stepLower.includes('failed')) return 50;
    return 50;
  }

  if (stepLower.includes('finalization')) {
    return 80;
  }

  if (stepLower.includes('archiving')) {
    if (stepLower.includes('complete')) return 90;
    return 85;
  }

  return 0;
}
</script>

<style scoped>
.grid {
  display: grid;
}
</style>
