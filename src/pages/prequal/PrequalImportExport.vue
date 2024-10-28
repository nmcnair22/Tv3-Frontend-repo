<!-- src/pages/prequal/PrequalImportExport.vue -->
<template>
    <div>
      <h2>Data Import/Export</h2>
      <div class="p-grid">
        <!-- Import Section -->
        <div class="p-col-12 p-md-6">
          <h3>Import Data</h3>
          <FileUpload
            ref="fileUploadRef"
            name="prequal-import"
            url="/api/prequal/import"
            :auto="false"
            :customUpload="true"
            :uploadHandler="handleImport"
            :multiple="false"
            accept=".csv, .xlsx"
            maxFileSize="1000000"
          />
          <Button
            label="Upload"
            icon="pi pi-upload"
            class="p-mt-2"
            @click="triggerImport"
          />
        </div>
        <!-- Export Section -->
        <div class="p-col-12 p-md-6">
          <h3>Export Data</h3>
          <Button
            label="Export Requests"
            icon="pi pi-download"
            class="p-button-success"
            @click="exportData"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import { ref } from 'vue';
import { usePrequalStore } from '../../store/prequalstore';
  
  const prequalStore = usePrequalStore();
  const fileUploadRef = ref(null);
  
  // Handle the import process
  const handleImport = async (event) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post('/api/prequal/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle success (e.g., show notification)
      alert('Import successful!');
      // Optionally, refresh the data
      prequalStore.fetchRequests();
    } catch (error) {
      console.error('Import failed:', error);
      // Handle error (e.g., show notification)
      alert('Import failed. Please try again.');
    }
  };
  
  // Trigger the file upload dialog
  const triggerImport = () => {
    if (fileUploadRef.value) {
      fileUploadRef.value.choose();
    }
  };
  
  // Handle the export process
  const exportData = async () => {
    try {
      const response = await axios.get('/api/prequal/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prequal_requests.xlsx'); // or 'prequal_requests.csv'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      // Handle error (e.g., show notification)
      alert('Export failed. Please try again.');
    }
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  .p-grid {
    margin-top: 1rem;
  }
  
  .p-col-12 {
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .p-col-12 {
      margin-bottom: 0;
    }
  }
  </style>
  