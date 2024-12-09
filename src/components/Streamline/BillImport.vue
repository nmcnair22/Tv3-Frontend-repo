<!-- src/components/Streamline/BillImport.vue -->

<template>
    <div class="bill-import">
      <!-- Header Section -->
      <BillImportHeader />
  
      <!-- Metrics Section with Hardcoded Data -->
      <MetricsDashboard
        :totalBills="10"
        validationPassRate="95"
        averageProcessingTime="2.5"
        :billsGraphData="billsGraphData"
        :validationGraphData="validationGraphData"
        :processingTimeGraphData="processingTimeGraphData"
        :revenueByCategoryData="revenueByCategoryData"
        :expensesByCategoryData="expensesByCategoryData"
      />
  
      <!-- File Upload Section -->
      <Card title="Upload Bills">
        <FileUpload
          name="files[]"
          aria-label="Upload Bills"
          :auto="false"
          :customUpload="true"
          accept="application/pdf"
          :maxFileSize="10000000" <!-- 10MB -->
          :uploadHandler="uploadBills"
          multiple
          :invalidFileSizeMessage="'File size exceeds 10MB.'"
          :invalidFileTypeMessage="'Only PDF files are allowed.'"
          mode="advanced"
          chooseLabel="Select Files"
          uploadLabel="Upload"
          cancelLabel="Cancel"
          :disabled="false"
        >
          <!-- Empty Slot -->
          <template #empty>
            <span class="empty-upload">Drag and drop PDF files here to upload.</span>
          </template>
        </FileUpload>
        <!-- Uploading Indicator -->
        <div class="p-mt-2 flex items-center gap-2">
          <ProgressSpinner />
          <p>Uploading and processing bills...</p>
        </div>
      </Card>
  
      <!-- Processed Bills Table with Hardcoded Data -->
      <ProcessedBillsTable :processedBills="processedBills" />
    </div>
  </template>
  
  <script setup lang="ts">
  import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import BillImportHeader from './BillImportHeader.vue';
import MetricsDashboard from './MetricsDashboard.vue';
import ProcessedBillsTable from './ProcessedBillsTable.vue';
  
  // Hardcoded data for testing
  const billsGraphData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Bills Processed',
      data: [10, 20, 15],
      backgroundColor: '#42A5F5'
    }]
  };
  
  const validationGraphData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Validation Pass Rate',
      data: [90, 95, 85],
      backgroundColor: '#66BB6A'
    }]
  };
  
  const processingTimeGraphData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Avg Processing Time',
      data: [1.5, 2.0, 2.5],
      backgroundColor: '#FFA726'
    }]
  };
  
  const revenueByCategoryData = {
    labels: ['Comcast', 'AT&T', 'Spectrum'],
    datasets: [{
      label: 'Revenue',
      data: [5000, 3000, 2000],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
    }]
  };
  
  const expensesByCategoryData = {
    labels: ['Internet', 'Cable TV', 'Broadband'],
    datasets: [{
      label: 'Expenses',
      data: [3000, 2000, 1500],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };
  
  const processedBills = [
    { id: 'bill1', fileName: 'Sample1.pdf', status: 'Approved', processedDate: '2023-10-10' },
    { id: 'bill2', fileName: 'Sample2.pdf', status: 'Pending', processedDate: '2023-10-12' },
  ];
  
  // Upload handler for testing (no actual upload)
  const uploadBills = (event) => {
    console.log('Upload handler triggered', event);
  };
  </script>
  
  <style scoped>
  .bill-import {
    padding: 1rem;
  }
  
  .empty-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: #666;
    font-size: 1rem;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #fafafa;
  }
  
  .card {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
  }
  </style>
  