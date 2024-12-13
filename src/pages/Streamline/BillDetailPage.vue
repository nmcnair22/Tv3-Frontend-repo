<template>
  <div class="min-h-screen bg-gradient-to-tl from-gray-100 to-gray-50 font-sans text-gray-800 px-4 py-2">

    <!-- Page Title and Navigation -->
    <header class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl xs:text-3xl lg:text-4xl font-bold text-[#0B2244] mb-1">
          Bill Details
        </h1>
        <p class="text-sm xs:text-base md:text-lg text-gray-600 max-w-3xl">
          Review and edit the details of this bill, update line items, and verify data against the original document.
        </p>
      </div>
      <div>
        <Button label="Delete Bill" icon="pi pi-trash" severity="danger" @click="showDeleteConfirm = true" />
      </div>
    </header>

    <div v-if="isLoadingSelectedBill" class="flex items-center justify-center py-4">
      <i class="pi pi-spinner pi-spin mr-2"></i>
      Loading bill details, please wait...
    </div>

    <div v-else-if="fetchError" class="text-red-500 text-sm">
      {{ fetchError }}
    </div>

    <div v-else-if="selectedBill">
      <!-- Main layout: left = info + details + line items, right = PDF -->
      <div class="grid gap-3 md:grid-cols-2">
        
        <!-- Left Column: Use flexible sizing so it adjusts with screen size -->
        <div class="flex flex-col gap-3">
          <!-- Combined Info Card -->
          <div class="bg-white p-3 rounded-lg shadow-sm space-y-3">
            <h2 class="text-lg font-semibold text-[#0B2244] mb-2">Account, Customer & Vendor Info</h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col text-sm">
                <label class="font-medium mb-1">Account Number</label>
                <InputText v-model="selectedBill.account_number" />
              </div>
              <div class="flex flex-col text-sm">
                <label class="font-medium mb-1">Expected Amount</label>
                <InputNumber v-model="selectedBill.expected_amount" mode="currency" currency="USD" locale="en-US" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div v-if="selectedBill.account" class="flex flex-col text-sm">
                <label class="font-medium mb-1">Pay Type</label>
                <InputText v-model="selectedBill.account.pay_type" />
              </div>
              <div class="flex flex-col text-sm">
                <label class="font-medium mb-1">Provider Name</label>
                <InputText :value="selectedBill.account?.provider_name" disabled />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col text-sm">
                <label class="font-medium mb-1">Customer Name</label>
                <InputText v-model="selectedBill.customer_name" />
              </div>
              <div class="flex flex-col text-sm">
                <label class="font-medium mb-1">Location Name</label>
                <InputText v-model="selectedBill.location_name" />
              </div>
            </div>
            <div class="flex flex-col text-sm">
              <label class="font-medium mb-1">Carrier (Vendor)</label>
              <InputText v-model="selectedBill.carrier_name" />
            </div>
          </div>

          <!-- Bill Details & Line Items Card -->
          <div class="bg-white p-3 rounded-lg shadow-sm space-y-3 flex-1 flex flex-col">
            <h2 class="text-lg font-semibold text-[#0B2244]">Bill Details</h2>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex flex-col">
                <label class="font-medium mb-1">Status</label>
                <Select v-model="selectedBill.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" showClear />
              </div>
              <div class="flex flex-col">
                <label class="font-medium mb-1">Sub-Status</label>
                <Select v-model="selectedBill.subStatus" :options="subStatusOptions" optionLabel="label" optionValue="value" placeholder="Select Sub-Status" showClear />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex flex-col">
                <label class="font-medium mb-1">Bill ID</label>
                <InputText :value="selectedBill.id" disabled />
              </div>
              <div class="flex flex-col">
                <label class="font-medium mb-1">Amount Due</label>
                <InputNumber v-model="selectedBill.amount_due" mode="currency" currency="USD" locale="en-US" />
              </div>
              <div class="flex flex-col">
                <label class="font-medium mb-1">Due Date</label>
                <DatePicker v-model="selectedBill.due_date" dateFormat="yy-mm-dd" placeholder="Select date" showIcon />
              </div>
            </div>
            <div class="flex flex-col text-sm">
              <label class="font-medium mb-1">Notes</label>
              <InputText v-model="selectedBill.notes" placeholder="Additional notes..." />
            </div>
            <div class="border-t pt-3 flex-1 flex flex-col">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-[#0B2244]">Line Items</h2>
                <Button label="Add Item" icon="pi pi-plus" size="small" @click="addLineItem" />
              </div>
              <DataTable :value="selectedBill.line_items" dataKey="id" responsiveLayout="scroll" size="small" class="border border-gray-200 rounded-lg mt-2 flex-1">
                <Column field="description" header="Description" />
                <Column field="category" header="Category" />
                <Column field="subcategory" header="Sub-Category" />
                <Column field="amount" header="Amount">
                  <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.amount) }}
                  </template>
                </Column>
                <Column style="width:2rem;">
                  <template #body="slotProps">
                    <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="removeLineItem(slotProps.data)" />
                  </template>
                </Column>

                <!-- Footer with total -->
                <template #footer>
                  <tr>
                    <td colspan="3" class="text-right font-semibold">Total:</td>
                    <td class="font-semibold">{{ formatCurrency(calculateLineItemsTotal(selectedBill.line_items)) }}</td>
                    <td></td>
                  </tr>
                </template>
              </DataTable>
            </div>
          </div>
        </div>

        <!-- Right: PDF Viewer -->
        <div class="bg-white p-3 rounded-lg shadow-sm flex flex-col w-full" style="height:85vh;">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-semibold text-[#0B2244]">Bill Document</h2>
            <div class="space-x-2">
              <Button icon="pi pi-arrow-left" @click="prevPage" :disabled="currentPage <= 1" />
              <Button icon="pi pi-arrow-right" @click="nextPage" :disabled="currentPage >= numPages" />
            </div>
          </div>

          <div class="flex-1">
            <VuePdfEmbed
              :source="pdfSource(selectedBill)"
              :page="currentPage"
              :zoomMode="'page-fit'"
              @loaded="onPdfLoaded"
              @load="onPdfLoad"
              @error="onPdfError"
              style="width: 100%; height: 100%;"
            />
          </div>

          <div class="mt-2 text-sm text-gray-500 text-center">
            Page {{ currentPage }} of {{ numPages }}
          </div>
        </div>
      </div>

      <!-- Confirm Delete Dialog -->
      <Dialog
        header="Confirm Delete"
        v-model:visible="showDeleteConfirm"
        :modal="true"
        :draggable="false"
        :closable="false"
      >
        <p>Are you sure you want to delete this bill? This action cannot be undone.</p>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="showDeleteConfirm = false" />
          <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteBill" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { useBillImportStore } from '@/store/billImportStore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import VuePdfEmbed from 'vue-pdf-embed';

const route = useRoute();
const billImportStore = useBillImportStore();

const showDeleteConfirm = ref(false);

const statusOptions = [
  { label: 'Processed', value: 'Processed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const subStatusOptions = [
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const selectedBill = computed(() => billImportStore.selectedBill);
const isLoadingSelectedBill = computed(() => billImportStore.isLoadingSelectedBill);
const fetchError = computed(() => billImportStore.fetchError);

const currentPage = ref(1);
const numPages = ref(1);

function pdfSource(billData) {
  if (!billData || !billData.archived_file_path) return null;
  const url = `http://localhost:3000/api/bills/file?path=${encodeURIComponent(billData.archived_file_path)}`;
  return url;
}

function onPdfLoad() {
  console.log('PDF loaded successfully!');
}

function onPdfError(err) {
  console.error('PDF failed to load:', err);
}

function onPdfLoaded(pdf) {
  // pdf is an instance of PDFDocumentProxy
  numPages.value = pdf.numPages;
  if (currentPage.value > numPages.value) currentPage.value = numPages.value;
}

function nextPage() {
  if (currentPage.value < numPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function addLineItem() {
  if (!selectedBill.value.line_items) {
    selectedBill.value.line_items = [];
  }
  const newId = selectedBill.value.line_items.length
    ? Math.max(...selectedBill.value.line_items.map(i => i.id)) + 1
    : 1;
  selectedBill.value.line_items.push({ id: newId, description: '', category: '', subcategory: '', amount: 0 });
}

function removeLineItem(item) {
  selectedBill.value.line_items = selectedBill.value.line_items.filter(li => li.id !== item.id);
}

function formatCurrency(value) {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function deleteBill() {
  // Implement delete logic here
  console.log('Bill deleted:', selectedBill.value.id);
  showDeleteConfirm.value = false;
}

function calculateLineItemsTotal(lineItems) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

async function fetchBill() {
  const billId = route.params.billId;
  if (billId) {
    await billImportStore.fetchBillById(billId);
  }
}

onMounted(fetchBill);
watch(() => route.params.billId, fetchBill);
</script>

<style scoped>
.whitespace-normal {
  white-space: normal;
}
.break-words {
  word-wrap: break-word;
  word-break: break-word;
}
</style>
