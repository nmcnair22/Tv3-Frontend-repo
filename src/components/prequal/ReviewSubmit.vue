<!-- ReviewSubmit.vue -->
<template>
    <div class="review-submit">
      <h3>Review & Submit</h3>
      <!-- Summary Cards -->
      <Card>
        <template #title>Basic Information</template>
        <ul>
          <li><strong>Street:</strong> {{ formData.basicInfo.street }}</li>
          <li><strong>City:</strong> {{ formData.basicInfo.city }}</li>
          <li><strong>State:</strong> {{ formData.basicInfo.state }}</li>
          <li><strong>Zip Code:</strong> {{ formData.basicInfo.zip }}</li>
          <li><strong>Contact Person:</strong> {{ formData.basicInfo.contactPerson }}</li>
          <li><strong>Phone Number:</strong> {{ formData.basicInfo.phoneNumber }}</li>
          <li>
            <strong>Building Type:</strong>
            {{ getBuildingTypeLabel(formData.basicInfo.buildingType) }}
          </li>
          <li>
            <strong>Ownership Status:</strong>
            {{ formData.basicInfo.ownershipStatus === 'own' ? 'Own' : 'Rent' }}
          </li>
        </ul>
      </Card>
  
      <Card>
        <template #title>Qualification Level</template>
        <p>
          {{ formData.qualificationLevel === 'quick' ? 'Quick Qualification' : 'Accurate Qualification' }}
        </p>
      </Card>
  
      <Card>
        <template #title>Connectivity Preferences</template>
        <ul>
          <li>
            <strong>Technology Types:</strong>
            {{ getTechnologyLabels(formData.connectivityPreferences.technologyTypes).join(', ') }}
          </li>
          <li>
            <strong>Speed Limitations:</strong>
            Min {{ formData.connectivityPreferences.minSpeed }} Mbps - Max
            {{ formData.connectivityPreferences.maxSpeed }} Mbps
          </li>
          <li>
            <strong>Price Requirements:</strong>
            Min ${{ formData.connectivityPreferences.minPrice }} - Max ${{ formData.connectivityPreferences.maxPrice }}
          </li>
        </ul>
      </Card>
  
      <Card v-if="formData.preferenceTiers && formData.preferenceTiers.tiers.length > 0">
        <template #title>Preference Tiers</template>
        <div v-for="(tier, index) in formData.preferenceTiers.tiers" :key="index">
          <h4>Tier {{ index + 1 }}</h4>
          <ul>
            <li>
              <strong>Technology Types:</strong>
              {{ getTechnologyLabels(tier.technologyTypes).join(', ') }}
            </li>
            <li><strong>Speed:</strong> {{ tier.speed }} Mbps</li>
            <li><strong>Max Price:</strong> ${{ tier.maxPrice }}</li>
          </ul>
        </div>
      </Card>
  
      <!-- Confirmation Checkbox -->
      <div class="p-field-checkbox mt-4">
        <Checkbox inputId="confirm" v-model="confirmed" />
        <label for="confirm">I confirm that the above information is correct.</label>
      </div>
    </div>
  </template>
  
  <script setup>
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import { ref, watch } from 'vue';
  
  const props = defineProps({
    formData: {
      type: Object,
      required: true,
    },
  });
  
  const emits = defineEmits(['validation']);
  
  const confirmed = ref(false);
  
  watch(confirmed, () => {
    validateForm();
  });
  
  function validateForm() {
    emits('validation', confirmed.value);
  }
  
  const technologyOptions = [
    { label: 'Fiber', value: 'fiber' },
    { label: 'Cable', value: 'cable' },
    { label: 'DSL', value: 'dsl' },
    { label: 'Wireless', value: 'wireless' },
  ];
  
  const buildingTypes = [
    { label: 'Commercial', value: 'commercial' },
    { label: 'Residential', value: 'residential' },
    { label: 'Industrial', value: 'industrial' },
    { label: 'Mixed Use', value: 'mixed' },
  ];
  
  function getTechnologyLabels(values) {
    return technologyOptions.filter(option => values.includes(option.value)).map(option => option.label);
  }
  
  function getBuildingTypeLabel(value) {
    const type = buildingTypes.find(option => option.value === value);
    return type ? type.label : '';
  }
  </script>
  
  <style scoped>
  .review-submit {
    margin-top: 1rem;
  }
  .mt-4 {
    margin-top: 1.5rem;
  }
  </style>
  