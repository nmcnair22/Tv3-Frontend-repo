<template>
  <div>
    <h1>Test Page</h1>
    <!-- Comment out the previous component -->
    <!-- <ConnectivityPreferencesForm v-model="formData" /> -->

    <!-- Include the PreferenceTiersForm component -->
    <PreferenceTiersForm v-model="formData" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PreferenceTiersForm from '../components/prequal/PreferenceTiersForm.vue'; // Adjust the path as necessary

const formData = ref({});
</script>
