<!-- PreferenceTiersForm.vue -->
<template>
  <div class="bg-gray-50 dark:bg-gray-800 p-6 md:p-12 lg:p-20">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-4">
      Preference Tiers
    </h3>
    <Button
      label="Add Tier"
      icon="pi pi-plus"
      @click="addTier"
      class="mb-4"
    />
    <div
      v-for="(tier, index) in form.tiers"
      :key="'tier-' + index"
      class="mb-6"
    >
      <div class="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Tier {{ index + 1 }}
          </h4>
          <Button
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-danger"
            @click="removeTier(index)"
          />
        </div>
        <!-- Tier Preferences -->
        <div class="grid grid-cols-12 gap-4">
          <!-- Technology Types -->
          <div class="col-span-12">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">
              Technology Types
            </label>
            <MultiSelect
              v-model="tier.technologyTypes"
              :options="technologyOptions"
              optionLabel="label"
              placeholder="Select technologies"
              class="w-full"
              required
            />
          </div>
          <!-- Download Speed -->
          <div class="col-span-12 md:col-span-6">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">
              Download Speed
            </label>
            <Select
              v-model="tier.downloadSpeed"
              :options="downloadSpeedOptions"
              optionLabel="label"
              placeholder="Select download speed"
              class="w-full"
              required
            />
          </div>
          <!-- Upload Speed -->
          <div class="col-span-12 md:col-span-6">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">
              Upload Speed
            </label>
            <Select
              v-model="tier.uploadSpeed"
              :options="uploadSpeedOptions"
              optionLabel="label"
              placeholder="Select upload speed"
              class="w-full"
              required
            />
          </div>
          <!-- Maximum Price -->
          <div class="col-span-12 md:col-span-6">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">
              Maximum Price ($)
            </label>
            <InputNumber
              v-model="tier.maxPrice"
              mode="currency"
              currency="USD"
              locale="en-US"
              placeholder="Max Price"
              class="w-full"
              required
            />
          </div>
          <!-- Enable Providers Preferences -->
          <div class="col-span-12">
            <div class="flex items-center mt-4">
              <Checkbox
                v-model="tier.enableProviders"
                :inputId="'enableProviders-' + index"
                class="text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label
                :for="'enableProviders-' + index"
                class="ml-2 text-gray-700 dark:text-gray-200"
              >
                Enable Providers Preferences
              </label>
            </div>
          </div>
          <!-- Providers Panel -->
          <div v-if="tier.enableProviders" class="col-span-12">
            <!-- Preferred Providers -->
            <div class="mt-4">
              <label class="block text-gray-700 dark:text-gray-200 mb-1">
                Preferred Providers
              </label>
              <PickList
                :modelValue="tier.preferredProvidersModel"
                @update:modelValue="updatePreferredProviders(index, $event)"
                dataKey="value"
                :source="providerOptions"
                :target="tier.preferredProviders"
                :sourceHeader="'Available Providers'"
                :targetHeader="'Preferred Providers'"
                class="w-full"
              >
                <template #item="{ item }">
                  {{ item.label }}
                </template>
              </PickList>
            </div>
            <!-- Providers to Avoid -->
            <div class="mt-4">
              <label class="block text-gray-700 dark:text-gray-200 mb-1">
                Providers to Avoid
              </label>
              <PickList
                :modelValue="tier.providersToAvoidModel"
                @update:modelValue="updateProvidersToAvoid(index, $event)"
                dataKey="value"
                :source="providerOptions"
                :target="tier.providersToAvoid"
                :sourceHeader="'Available Providers'"
                :targetHeader="'Providers to Avoid'"
                class="w-full"
              >
                <template #item="{ item }">
                  {{ item.label }}
                </template>
              </PickList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// Import PrimeVue components
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import PickList from 'primevue/picklist';
import Select from 'primevue/select';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue', 'validation']);

const form = reactive({ tiers: props.modelValue.tiers || [] });

const technologyOptions = [
  { label: 'Fiber', value: 'fiber' },
  { label: 'Cable', value: 'cable' },
  { label: 'DSL', value: 'dsl' },
  { label: 'Wireless', value: 'wireless' },
  // Add more options as needed
];

const speedOptions = [
  { label: '10 Mbps', value: 10 },
  { label: '20 Mbps', value: 20 },
  { label: '50 Mbps', value: 50 },
  { label: '100 Mbps', value: 100 },
  { label: '200 Mbps', value: 200 },
  { label: '500 Mbps', value: 500 },
  { label: '1 Gbps (1000 Mbps)', value: 1000 },
];

const downloadSpeedOptions = speedOptions;
const uploadSpeedOptions = speedOptions;

// Flat list of providers
const providerOptions = [
  // National Providers
  { label: 'Xfinity (Comcast)', value: 'xfinity' },
  { label: 'Charter Communications (Spectrum)', value: 'charter' },
  { label: 'AT&T Internet', value: 'att' },
  { label: 'Verizon (FiOS and 5G Home Internet)', value: 'verizon' },
  { label: 'T-Mobile Home Internet', value: 'tmobile' },
  { label: 'HughesNet', value: 'hughesnet' },
  { label: 'Viasat Internet', value: 'viasat' },
  { label: 'EarthLink', value: 'earthlink' },
  { label: 'CenturyLink (Lumen Technologies)', value: 'centurylink' },
  { label: 'Frontier Communications', value: 'frontier' },
  { label: 'Cox Communications', value: 'cox' },
  { label: 'Altice USA (Optimum)', value: 'altice' },
  { label: 'Mediacom Communications', value: 'mediacom' },
  { label: 'Windstream', value: 'windstream' },
  { label: 'Cable One (Sparklight)', value: 'cableone' },
  { label: 'WideOpenWest (WOW!)', value: 'wow' },
  { label: 'TDS Telecom', value: 'tds' },
  { label: 'Consolidated Communications', value: 'consolidated' },
  { label: 'Google Fiber', value: 'googlefiber' },
  // Regional and Local Providers
  { label: 'Astound Broadband', value: 'astound' },
  { label: 'Breezeline', value: 'breezeline' },
  { label: 'Midco (Midcontinent Communications)', value: 'midco' },
  { label: 'Allo Communications', value: 'allo' },
  { label: 'Blue Ridge Communications', value: 'blueridge' },
  { label: 'Buckeye Broadband', value: 'buckeye' },
  { label: 'GCI', value: 'gci' },
  { label: 'Grande Communications', value: 'grande' },
  { label: 'MetroNet', value: 'metronet' },
  { label: 'RCN', value: 'rcn' },
  { label: 'Sonic.net', value: 'sonic' },
  { label: 'Ziply Fiber', value: 'ziply' },
  { label: 'Armstrong', value: 'armstrong' },
  { label: 'Atlantic Broadband', value: 'atlantic' },
  { label: 'Cincinnati Bell', value: 'cincinnatibell' },
  { label: 'Cogent Communications', value: 'cogent' },
  { label: 'Shentel (Glo Fiber)', value: 'shentel' },
  { label: 'Hotwire Communications', value: 'hotwire' },
  { label: 'Starry Internet', value: 'starry' },
  { label: 'Ting Internet', value: 'ting' },
  // Satellite and Fixed Wireless Providers
  { label: 'SpaceX (Starlink)', value: 'starlink' },
  { label: 'Rise Broadband', value: 'risebroadband' },
  { label: 'GeoLinks', value: 'geolinks' },
  { label: 'Nextlink Internet', value: 'nextlink' },
  // Other Notable Providers
  { label: 'Brightspeed', value: 'brightspeed' },
  { label: 'Bluepeak (Vast Broadband)', value: 'bluepeak' },
  { label: 'Point Broadband', value: 'pointbroadband' },
  { label: 'Schurz Communications', value: 'schurz' },
  { label: 'Veracity Networks', value: 'veracity' },
  { label: 'Arvig Communication', value: 'arvig' },
  { label: 'Empire Access', value: 'empire' },
  { label: 'Fastwyre', value: 'fastwyre' },
  { label: 'FOCUS Broadband', value: 'focus' },
  { label: 'Tachus', value: 'tachus' },
];

function addTier() {
  form.tiers.push({
    technologyTypes: [],
    downloadSpeed: null,
    uploadSpeed: null,
    maxPrice: null,
    enableProviders: false,
    preferredProviders: [],
    providersToAvoid: [],
    preferredProvidersModel: [providerOptions.slice(), []],
    providersToAvoidModel: [providerOptions.slice(), []],
  });
  validateForm();
}

function removeTier(index) {
  form.tiers.splice(index, 1);
  validateForm();
}

function updatePreferredProviders(index, newValue) {
  form.tiers[index].preferredProvidersModel = newValue;
  form.tiers[index].preferredProviders = newValue[1];
}

function updateProvidersToAvoid(index, newValue) {
  form.tiers[index].providersToAvoidModel = newValue;
  form.tiers[index].providersToAvoid = newValue[1];
}

watch(
  () => form.tiers,
  (newVal) => {
    emits('update:modelValue', { tiers: newVal });
    validateForm();
  },
  { deep: true }
);

function validateForm() {
  const isValid = form.tiers.length > 0;
  emits('validation', isValid);
}
</script>

<style scoped>
.p-checkbox-box {
  border: 1px solid #d1d5db; /* Tailwind's gray-300 */
  background-color: #fff; /* Ensure background is white */
}
.p-checkbox-box.p-highlight {
  background-color: #3b82f6 !important; /* Tailwind's blue-500 */
  border-color: #3b82f6 !important;
}
.p-checkbox-icon {
  color: #000000 !important; /* Black checkmark */
}
</style>
