<!-- src/components/NotesFeed.vue -->
<template>
    <div>
      <h4>Notes</h4>
      
      <!-- Display existing notes -->
      <div v-if="notes.length">
        <div v-for="note in notes" :key="note.id" class="p-card p-mb-2">
          <div class="p-card-body">
            <p><strong>{{ note.author }}:</strong> {{ note.content }}</p>
            <small>{{ formatDate(note.createdAt) }}</small>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No notes available.</p>
      </div>
      
      <!-- Add a new note -->
      <form @submit.prevent="addNote" class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12">
          <label for="newNote">Add Note</label>
          <InputText id="newNote" v-model="newNote" rows="3" required />
        </div>
        <div class="p-field p-col-12">
          <Button label="Add Note" icon="pi pi-plus" type="submit" />
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { usePrequalStore } from '../store/prequalStore';
  
  const props = defineProps({
    requestId: {
      type: [String, Number],
      required: true
    }
  });
  
  const prequalStore = usePrequalStore();
  const toast = useToast();
  
  const notes = ref([]);
  const newNote = ref('');
  
  // Fetch notes when component mounts
  onMounted(async () => {
    await prequalStore.fetchNotes(props.requestId);
    notes.value = prequalStore.notes;
  });
  
  // Function to add a new note
  const addNote = async () => {
    if (!newNote.value.trim()) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Note cannot be empty.',
        life: 3000
      });
      return;
    }
  
    try {
      const note = await prequalStore.addNote(props.requestId, newNote.value);
      notes.value.push(note);
      newNote.value = '';
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Note added successfully.',
        life: 3000
      });
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add note. Please try again.',
        life: 3000
      });
    }
  };
  
  // Function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  