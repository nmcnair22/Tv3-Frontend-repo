<template>
  <div class="min-h-screen bg-gradient-to-tl from-gray-100 to-gray-50 font-sans text-gray-800">
    <div class="px-4 py-6 xs:py-8 md:py-10 xl:px-8 2xl:py-12 w-full">

      <!-- Header -->
      <header class="mb-6 xs:mb-8 md:mb-10 2xl:mb-12">
        <h1 class="text-2xl xs:text-3xl lg:text-4xl font-bold text-[#0B2244] mb-2">
          Recently Processed Bills
        </h1>
        <p class="text-sm xs:text-base md:text-lg text-gray-600 max-w-3xl">
          Review, filter, and export your recently processed bills, and easily view bill details.
        </p>
      </header>

      <!-- Interval selection -->
      <section class="mb-4 xs:mb-6 lg:mb-8 flex flex-col xs:flex-row items-start xs:items-center gap-4">
        <div class="flex flex-col xs:flex-row xs:items-center gap-2 text-sm w-full">
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
      </section>

      <!-- DataTable Section -->
      <section class="mb-6 lg:mb-8">
        <div class="bg-white rounded-lg shadow-sm p-4 w-full overflow-auto">
          <DataTable
            ref="dt"
            :value="bills"
            dataKey="id"
            paginator
            :rows="20"
            :rowsPerPageOptions="[10, 20, 50]"
            responsiveLayout="scroll"
            :globalFilterFields="['id','amount_due','due_date','status','notes','customer_name','location_name','carrier_name']"
            filterDisplay="menu"
            emptyMessage="No bills found."
            :resizableColumns="true"
            columnResizeMode="fit"
            :reorderableColumns="true"
            v-model:filters="filters"
            rowHover
            stripedRows
            showGridlines
            sortMode="multiple"
            stateStorage="session"
            stateKey="dt-state-demo"
            size="small"
            class="p-datatable border-none w-full"
            v-model:expandedRows="expandedRows"
            :loading="loadingFromStore"
            :rowGroupMode="groupEnabled ? 'subheader' : null"
            :groupRowsBy="groupEnabled && groupField ? groupField : null"
          >
            <template #groupheader="slotProps">
              <div class="py-2 px-3 bg-gray-100 font-semibold text-[#0B2244]">
                {{ slotProps.data[groupField] }}
              </div>
            </template>

            <!-- Table Header -->
            <template #header>
              <div class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-2">
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Clear Filters"
                  outlined
                  size="small"
                  class="p-button-outlined p-button-secondary p-button-sm custom-clear-filter-button"
                  @click="clearFilter"
                />
                <div class="relative w-full xs:w-48">
                  <span class="p-input-icon-left w-full inline-flex items-center">
                    <i class="pi pi-search text-gray-500 mr-2"></i>
                    <InputText
                      v-model="filters.global.value"
                      placeholder="Search"
                      size="small"
                      class="w-full"
                    />
                  </span>

                </div>
              </div>
            </template>

            <template #loading>
              <div class="flex items-center justify-center py-3 text-sm text-gray-600">
                <i class="pi pi-spinner pi-spin mr-2"></i>
                Loading data, please wait...
              </div>
            </template>

            <!-- Expander Column on the left -->
            <Column expander style="width:2rem;"></Column>

            <!-- ID Column (Numeric) -->
            <Column
              field="id"
              header="ID"
              sortable
              filterField="id"
              dataType="numeric"
              style="min-width:100px;"
            >
              <!-- Added this body template -->
              <template #body="slotProps">
                <router-link
                  :to="`/streamline/bill/${slotProps.data.id}`"
                  class="text-blue-600 hover:underline"
                >
                  {{ slotProps.data.id }}
                </router-link>
              </template>

              <template #filter="{ filterModel }">
                <InputNumber
                  v-model="filterModel.value"
                  class="p-column-filter w-full"
                  placeholder="ID"
                  size="small"
                />
              </template>
            </Column>

            <!-- Amount Due Column (Numeric) -->
            <Column
              field="amount_due"
              header="Amount"
              sortable
              filterField="amount_due"
              dataType="numeric"
              style="min-width:120px;"
            >
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount_due) }}
              </template>
              <template #filter="{ filterModel }">
                <InputNumber
                  v-model="filterModel.value"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  class="p-column-filter w-full"
                  placeholder="Amount"
                  size="small"
                />
              </template>
            </Column>

            <!-- Due Date Column (Date) -->
            <Column
              field="due_date"
              header="Due Date"
              sortable
              dataType="date"
              filterField="due_date"
              style="min-width:140px;"
            >
              <template #body="slotProps">
                {{ formatDate(slotProps.data.due_date) }}
              </template>
              <template #filter="{ filterModel }">
                <DatePicker
                  v-model="filterModel.value"
                  dateFormat="yy-mm-dd"
                  placeholder="Date"
                  showIcon
                  size="small"
                  class="p-column-filter w-full"
                />
              </template>
            </Column>

            <!-- Status Column (Text) -->
            <Column
              field="status"
              header="Status"
              sortable
              dataType="text"
              filterField="status"
              style="min-width:120px;"
            >
              <template #filter="{ filterModel }">
                <Select
                  v-model="filterModel.value"
                  :options="statuses"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Status"
                  size="small"
                  class="p-column-filter w-full"
                  showClear
                />
              </template>
              <template #body="slotProps">
                <span class="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-50 text-[#0B2244]">
                  {{ slotProps.data.status || 'N/A' }}
                </span>
              </template>
            </Column>

            <!-- Customer Column (Text) -->
            <Column
              field="customer_name"
              header="Customer"
              sortable
              dataType="text"
              filterField="customer_name"
              style="min-width:180px;"
            >
              <template #filter="{ filterModel }">
                <InputText
                  v-model="filterModel.value"
                  size="small"
                  class="p-column-filter w-full"
                  placeholder="Customer"
                />
              </template>
            </Column>

            <!-- Location Column (Text) -->
            <Column
              field="location_name"
              header="Location"
              sortable
              dataType="text"
              filterField="location_name"
              style="min-width:180px;"
            >
              <template #filter="{ filterModel }">
                <InputText
                  v-model="filterModel.value"
                  size="small"
                  class="p-column-filter w-full"
                  placeholder="Location"
                />
              </template>
            </Column>

            <!-- Carrier Column (Text) -->
            <Column
              field="carrier_name"
              header="Carrier"
              sortable
              dataType="text"
              filterField="carrier_name"
              style="min-width:180px;"
            >
              <template #filter="{ filterModel }">
                <InputText
                  v-model="filterModel.value"
                  type="text"
                  class="p-column-filter w-full"
                  placeholder="Carrier"
                  size="small"
                />
              </template>
            </Column>

            <!-- Notes Column (Text) -->
            <Column
              field="notes"
              header="Notes"
              dataType="text"
              filterField="notes"
              sortable
              style="min-width:220px;"
            >
              <template #filter="{ filterModel }">
                <InputText
                  v-model="filterModel.value"
                  size="small"
                  class="p-column-filter w-full"
                  placeholder="Notes"
                />
              </template>
              <template #body="slotProps">
                <div class="whitespace-normal break-words text-sm text-gray-700">
                  {{ slotProps.data.notes }}
                </div>
              </template>
            </Column>

            <!-- Details Column -->
            <Column header="Details" style="min-width:100px;" bodyClass="text-center">
              <template #body="slotProps">
                <Button
                  label="View"
                  icon="pi pi-eye"
                  size="small"
                  class="p-button-outlined p-button-secondary w-auto"
                  @click="openDrawer(slotProps.data)"
                />
              </template>
            </Column>

            <!-- Expansion Template with Category and Sub-Category -->
            <template #expansion="slotProps">
              <div class="p-2 bg-gray-50 text-sm">
                <DataTable
                  :value="slotProps.data.line_items"
                  responsiveLayout="scroll"
                  dataKey="id"
                  size="small"
                  class="border border-gray-200 rounded-lg w-full"
                >
                  <Column field="description" header="Description" sortable style="min-width:200px;"></Column>
                  <Column field="amount" header="Amount" style="min-width:120px;">
                    <template #body="liSlotProps">
                      {{ formatCurrency(liSlotProps.data.amount) }}
                    </template>
                  </Column>
                  <Column field="category" header="Category" style="min-width:120px;"></Column>
                  <Column field="subcategory" header="Sub-Category" style="min-width:120px;"></Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </section>

      <!-- Grouping & Export -->
      <section class="mb-6 lg:mb-8 bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 text-sm w-full">
        <Select
          v-model="groupField"
          :options="groupFields"
          optionLabel="label"
          optionValue="value"
          placeholder="Group By"
          size="small"
        />
        <Button
          :label="groupEnabled ? 'Disable Grouping' : 'Enable Grouping'"
          @click="toggleGrouping"
          outlined
          size="small"
          class="p-button-outlined p-button-secondary"
        />
        <div class="flex-1"></div>
        <Button
          label="Export CSV"
          icon="pi pi-download"
          size="small"
          class="p-button-success p-button-outlined"
          @click="$refs.dt.exportCSV({ selectionOnly: false })"
        />
      </section>
    </div>

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
            Account & Bill Details
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
            <div v-if="pdfSource(selectedBill)">
              <VuePdfEmbed
                :source="pdfSource(selectedBill)"
                style="width: 100%; height: 820px; border: 1px solid #ccc;"
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
import { useBillImportStore } from '@/store/billImportStore';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import * as pdfjsLib from 'pdfjs-dist';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Drawer from 'primevue/drawer';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { computed, onMounted, ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const billStore = useBillImportStore();

const bills = computed(() => billStore.processedBills || []);
const loadingFromStore = computed(() => billStore.isLoadingProcessedBills);

const selectedBill = ref(null);
const drawerVisible = ref(false);
const expandedRows = ref({});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  amount_due: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  due_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  customer_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  location_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
  carrier_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
});

const statuses = [
  { label: 'Processed', value: 'Processed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const groupEnabled = ref(false);
const groupField = ref(null);
const groupFields = [
  { label: 'Status', value: 'status' },
  { label: 'Due Date', value: 'due_date' },
  { label: 'Customer', value: 'customer_name' },
  { label: 'Carrier', value: 'carrier_name' }
];

const intervalOptions = [
  { label: '24 Hours', value: 24 },
  { label: '48 Hours', value: 48 },
  { label: 'Last Week', value: 168 },
  { label: 'This Month', value: 720 }
];

const selectedInterval = ref(168);

async function onIntervalChange() {
  await loadBills();
}

function toggleGrouping() {
  if (groupEnabled.value) {
    groupEnabled.value = false;
    groupField.value = null;
  } else if (groupField.value) {
    groupEnabled.value = true;
  }
}

function onGroupChange() {
  if (groupField.value) {
    groupEnabled.value = true;
  }
}

function clearFilter() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    amount_due: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    due_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    customer_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    location_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    carrier_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
  };
}

function formatCurrency(value) {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadBills() {
  await billStore.fetchProcessedBills(selectedInterval.value);
}

function openDrawer(bill) {
  selectedBill.value = bill;
  drawerVisible.value = true;
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

const drawerWidth = computed(() => {
  return window.innerWidth < 768 ? '100vw' : '48rem';
});

onMounted(() => {
  loadBills();
});
</script>

<style scoped>
.whitespace-normal {
  white-space: normal;
}
.break-words {
  word-wrap: break-word;
  word-break: break-word;
}

.custom-clear-filter-button {
  max-width: 200px;
  width: auto !important;
  flex-shrink: 0;
}

.custom-download-bill-button {
  max-width: 200px;
  width: auto !important;
  flex-shrink: 0;
}
</style>
