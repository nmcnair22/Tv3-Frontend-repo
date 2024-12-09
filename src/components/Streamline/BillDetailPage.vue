<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Bill Details</h1>
      <div v-if="bill">
        <!-- Display bill details -->
        <p><strong>Bill ID:</strong> {{ bill.id }}</p>
        <p><strong>Customer:</strong> {{ bill.customerName }}</p>
        <p><strong>Status:</strong> {{ bill.status }}</p>
        <!-- Other details as needed -->
  
        <!-- Actions -->
        <div class="mt-4">
          <Button label="Add Note" @click="showAddNoteDialog = true" />
          <Button label="Flag for Audit" class="ml-2" @click="flagForAudit" />
        </div>
  
        <!-- Add Note Dialog -->
        <Dialog header="Add Note" v-model:visible="showAddNoteDialog" :modal="true">
          <Textarea v-model="noteContent" rows="5" cols="30" />
          <div class="mt-2">
            <Button label="Save" @click="addNote" />
            <Button label="Cancel" class="ml-2" @click="showAddNoteDialog = false" />
          </div>
        </Dialog>
      </div>
      <div v-else>
        <p>Loading bill details...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useBillDetailStore } from '@/store/billDetailStore';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const billDetailStore = useBillDetailStore();
  
  const bill = ref(null);
  const showAddNoteDialog = ref(false);
  const noteContent = ref('');
  
  const fetchBillDetails = async () => {
    try {
      await billDetailStore.fetchBillDetails(route.params.billId);
      bill.value = billDetailStore.billDetails;
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };
  
  const addNote = async () => {
    try {
      await billDetailStore.addNoteToBill(bill.value.id, noteContent.value);
      showAddNoteDialog.value = false;
      noteContent.value = '';
      // Optionally refresh the bill details to show the new note
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };
  
  const flagForAudit = async () => {
    try {
      await billDetailStore.addAuditFlagToBill(bill.value.id, 'Flagged from frontend');
      // Provide feedback to the user
    } catch (error) {
      console.error('Error flagging bill for audit:', error);
    }
  };
  
  onMounted(() => {
    fetchBillDetails();
  });
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  