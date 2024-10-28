<!-- src/components/AddressForm.vue -->
<template>
    <div class="address-form">
      <div class="header">
        <span>Address {{ index + 1 }}</span>
        <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="emitRemove" />
      </div>
      <div class="p-fluid form-grid">
        <div class="p-field">
          <label for="addressLine1">Address Line 1</label>
          <InputText id="addressLine1" v-model="address.line1" required />
        </div>
        <!-- Similar setup for Address Line 2, City, State, ZIP -->
        
        <!-- Connection Details -->
        <div class="p-field">
          <label>Connections</label>
          <div v-for="(conn, connIndex) in address.connections" :key="connIndex" class="connection-block">
            <SelectButton :options="connectionTypes" v-model="conn.type" optionLabel="label" optionValue="value" />
            <SelectButton :options="connectionDesigns" v-model="conn.design" optionLabel="label" optionValue="value" />
            <Button icon="pi pi-minus" class="p-button-danger p-button-text" @click="emitRemoveConnection(connIndex)" />
          </div>
          <Button label="Add Connection" icon="pi pi-plus" @click="addConnection" class="p-button-secondary" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import SelectButton from 'primevue/selectbutton'; // Assuming you use SelectButton for simplicity
import { Button, InputText } from 'primevue/{componentName}'; // Adjust based on your setup
import { defineEmits, defineProps } from 'vue';
  
  const props = defineProps({
    address: Object,
    index: Number
  });
  
  const emits = defineEmits(['remove', 'removeConnection', 'addConnection']);
  
  const emitRemove = () => emits('remove');
  const emitRemoveConnection = (index) => emits('removeConnection', index);
  const addConnection = () => emits('addConnection');
  
  const connectionTypes = [
    { label: 'Primary', value: 'Primary' },
    // Add other options as needed
  ];
  
  const connectionDesigns = [
    { label: 'Carrier Diversity', value: 'Carrier Diversity' },
    // Add other designs as needed
  ];
  </script>
  
  <style scoped>
  .address-form {
    border: 1px solid #dee2e6;
    border-radius: 4px;
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .connection-block {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }
  
  .form-grid {
    display: grid;
    gap: 1rem;
  }
  </style>