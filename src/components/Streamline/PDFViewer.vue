<template>
    <div>
      <pdf
        v-if="src"
        :src="src"
        :page="currentPage"
        @num-pages="pageCount = $event"
        style="display: inline-block; width: 100%;"
      ></pdf>
      <div class="flex items-center gap-2 mt-2">
        <Button icon="pi pi-chevron-left" @click="prevPage" :disabled="currentPage <= 1" size="small"/>
        <span class="text-sm">{{ currentPage }} / {{ pageCount }}</span>
        <Button icon="pi pi-chevron-right" @click="nextPage" :disabled="currentPage >= pageCount" size="small"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import { ref, watch } from 'vue';
import pdf from 'vue-pdf';
  
  const props = defineProps({
    src: { type: String, required: true }
  });
  
  const currentPage = ref(1);
  const pageCount = ref(0);
  
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  
  const nextPage = () => {
    if (currentPage.value < pageCount.value) currentPage.value++;
  };
  
  watch(() => props.src, () => {
    currentPage.value = 1;
  });
  </script>
  
  <style scoped>
  </style>