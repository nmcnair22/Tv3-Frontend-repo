<!-- QualificationLevelForm.vue -->
<template>
    <div class="qualification-level-form">
      <h3>Qualification Level</h3>
      <div class="p-field-radiobutton">
        <RadioButton
          inputId="quick"
          name="qualificationLevel"
          value="quick"
          v-model="form.qualificationLevel"
        />
        <label for="quick">Quick Qualification</label>
        <p v-if="form.qualificationLevel === 'quick'" class="description">
          Quick Qualification provides fast results with basic information.
        </p>
      </div>
      <div class="p-field-radiobutton">
        <RadioButton
          inputId="accurate"
          name="qualificationLevel"
          value="accurate"
          v-model="form.qualificationLevel"
        />
        <label for="accurate">Accurate Qualification</label>
        <p v-if="form.qualificationLevel === 'accurate'" class="description">
          Accurate Qualification provides detailed results but may take longer.
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import RadioButton from 'primevue/radiobutton';
import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
  });
  
  const emits = defineEmits(['update:modelValue', 'validation']);
  
  const form = ref(props.modelValue || 'quick');
  
  watch(form, (newVal) => {
    emits('update:modelValue', newVal);
    validateForm();
  });
  
  function validateForm() {
    const isValid = form.value === 'quick' || form.value === 'accurate';
    emits('validation', isValid);
  }
  </script>
  
  <style scoped>
  .qualification-level-form {
    margin-top: 1rem;
  }
  .description {
    font-size: 0.9rem;
    color: #6c757d;
    margin-left: 2rem;
  }
  </style>
  