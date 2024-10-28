<!-- src/pages/prequal/PrequalRequest.vue -->

<template>
  <div class="prequal-request">
    <Card>
      <!-- Use the correct slot name for the header -->
      <template #title>
        <h2>Prequalification Request</h2>
      </template>

      <!-- Stepper Component -->
      <Stepper :value="activeStep">
        <StepList>
          <Step value="0">Basic Info</Step>
          <Step value="1">Qualification Level</Step>
          <Step value="2">Preferences</Step>
          <Step value="3">Preference Tiers</Step>
          <Step value="4">Review & Submit</Step>
        </StepList>
        <StepPanels>
          <!-- Step 0: Basic Information -->
          <StepPanel value="0">
            <BasicInfoForm v-model="formData.basicInfo" />
            <div class="form-navigation">
              <Button label="Next" @click="nextStep" :disabled="!isStepValid" />
            </div>
          </StepPanel>

          <!-- Step 1: Qualification Level -->
          <StepPanel value="1">
            <QualificationLevelForm v-model="formData.qualificationLevel" />
            <div class="form-navigation">
              <Button label="Previous" @click="prevStep" />
              <Button label="Next" @click="nextStep" :disabled="!isStepValid" />
            </div>
          </StepPanel>

          <!-- Step 2: Connectivity Preferences -->
          <StepPanel value="2">
            <ConnectivityPreferencesForm v-model="formData.connectivityPreferences" />
            <div class="form-navigation">
              <Button label="Previous" @click="prevStep" />
              <Button label="Next" @click="nextStep" :disabled="!isStepValid" />
            </div>
          </StepPanel>

          <!-- Step 3: Preference Tiers -->
          <StepPanel value="3">
            <PreferenceTiersForm v-model="formData.preferenceTiers" />
            <div class="form-navigation">
              <Button label="Previous" @click="prevStep" />
              <Button label="Next" @click="nextStep" :disabled="!isStepValid" />
            </div>
          </StepPanel>

          <!-- Step 4: Review & Submit -->
          <StepPanel value="4">
            <ReviewSubmit :formData="formData" />
            <div class="form-navigation">
              <Button label="Previous" @click="prevStep" />
              <Button label="Submit" @click="submitForm" :disabled="!isFormValid" />
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </Card>
  </div>
</template>
    
<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Import Stepper components
import Step from 'primevue/step';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Stepper from 'primevue/stepper';

// Import your form components
import BasicInfoForm from '../../components/prequal/BasicInfoForm.vue';
import ConnectivityPreferencesForm from '../../components/prequal/ConnectivityPreferencesForm.vue';
import PreferenceTiersForm from '../../components/prequal/PreferenceTiersForm.vue';
import QualificationLevelForm from '../../components/prequal/QualificationLevelForm.vue';
import ReviewSubmit from '../../components/prequal/ReviewSubmit.vue';

const router = useRouter();

// Active step value
const activeStep = ref('0');

// Form data structure
const formData = ref({
  basicInfo: {},
  qualificationLevel: {},
  connectivityPreferences: {},
  preferenceTiers: [],
});

// Validation
const isStepValid = ref(true); // Implement validation logic for each step
const isFormValid = ref(true); // Implement overall form validation

const nextStep = () => {
  if (isStepValid.value) {
    // Move to the next step
    activeStep.value = String(Number(activeStep.value) + 1);
  }
};

const prevStep = () => {
  // Move to the previous step
  activeStep.value = String(Number(activeStep.value) - 1);
};

const submitForm = () => {
  if (isFormValid.value) {
    // Submit the form data to the backend API
    // Implement API call here

    // Redirect or show success message
    router.push('/prequal/queue'); // Redirect to queue after submission
  }
};
</script>
      
<style scoped>
.prequal-request {
  max-width: 800px;
  margin: 0 auto;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
        