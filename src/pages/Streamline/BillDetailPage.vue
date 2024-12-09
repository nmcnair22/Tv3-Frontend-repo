<!-- src/pages/Streamline/BillDetailPage.vue -->
<template>
  <div>
    <BillDetailHeader :bill="bill" />

    <div class="p-grid p-nogutter p-mt-4">
      <!-- Bill Information Section -->
      <div class="p-col-12 p-md-6">
        <Card title="Bill Information">
          <p><strong>Customer:</strong> {{ bill.customer }}</p>
          <p><strong>Carrier:</strong> {{ bill.carrier }}</p>
          <p><strong>Location:</strong> {{ bill.location }}</p>
          <p><strong>Account Number:</strong> {{ bill.accountNumber }}</p>
          <p><strong>Amount:</strong> ${{ bill.amount }}</p>
          <p><strong>Expected Amount:</strong> ${{ bill.expectedAmount }}</p>
          <p><strong>Variance:</strong> ${{ bill.variance }}</p>
          <p><strong>Validation Status:</strong> <ValidationStatus :status="bill.validationStatus" /></p>
          <p><strong>Processed At:</strong> {{ formattedDate(bill.processedAt) }}</p>
        </Card>
      </div>

      <!-- Extracted Data Section -->
      <div class="p-col-12 p-md-6">
        <Card title="Extracted Data">
          <pre>{{ bill.extractedData }}</pre>
        </Card>
      </div>

      <!-- Notes Section -->
      <div class="p-col-12 p-md-6">
        <Card title="Notes">
          <ul>
            <li v-for="note in bill.notes" :key="note.id">
              <strong>{{ note.author }}:</strong> {{ note.content }} <em>({{ formattedDate(note.createdAt) }})</em>
            </li>
            <li v-if="bill.notes.length === 0">No notes available.</li>
          </ul>
          <Textarea v-model="newNote" placeholder="Add a note..." rows="3" class="p-mt-2"></Textarea>
          <Button label="Add Note" icon="pi pi-plus" class="p-mt-2" @click="addNote" />
        </Card>
      </div>

      <!-- Audit Flags Section -->
      <div class="p-col-12 p-md-6">
        <Card title="Audit Flags">
          <ul>
            <li v-for="flag in bill.auditFlags" :key="flag.id">
              {{ flag.reason }} <em>({{ formattedDate(flag.createdAt) }})</em>
            </li>
            <li v-if="bill.auditFlags.length === 0">No audit flags.</li>
          </ul>
          <Textarea v-model="newAuditFlag" placeholder="Add an audit flag..." rows="3" class="p-mt-2"></Textarea>
          <Button label="Add Audit Flag" icon="pi pi-plus" class="p-mt-2" @click="addAuditFlag" />
        </Card>
      </div>

      <!-- Account Lifecycle Management Section -->
      <div class="p-col-12">
        <Card title="Account Lifecycle Management">
          <ul>
            <li v-for="accountFlag in bill.accountFlags" :key="accountFlag.id">
              {{ accountFlag.flag }} <em>({{ formattedDate(accountFlag.createdAt) }})</em>
            </li>
            <li v-if="bill.accountFlags.length === 0">No account flags.</li>
          </ul>
          <Textarea v-model="newAccountFlag" placeholder="Add an account flag..." rows="3" class="p-mt-2"></Textarea>
          <Button label="Add Account Flag" icon="pi pi-plus" class="p-mt-2" @click="addAccountFlag" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BillDetailHeader from '../../components/Streamline/BillDetailHeader.vue';
import ValidationStatus from '../../components/ValidationStatus.vue';
import { useBillDetailStore } from '../../store/billDetailStore';

const store = useBillDetailStore();
const route = useRoute();
const router = useRouter();

const billId = route.params.billId;
const bill = ref(null);
const newNote = ref('');
const newAuditFlag = ref('');
const newAccountFlag = ref('');

// Fetch bill details
const fetchBillDetails = async () => {
  try {
    await store.fetchBillDetails(billId);
    bill.value = store.billDetails;
  } catch (error) {
    console.error('Error fetching bill details:', error);
  }
};

// Add a new note
const addNote = async () => {
  if (!newNote.value.trim()) return;
  try {
    await store.addNoteToBill(billId, newNote.value);
    newNote.value = '';
    await fetchBillDetails();
  } catch (error) {
    console.error('Error adding note:', error);
  }
};

// Add a new audit flag
const addAuditFlag = async () => {
  if (!newAuditFlag.value.trim()) return;
  try {
    await store.addAuditFlagToBill(billId, newAuditFlag.value);
    newAuditFlag.value = '';
    await fetchBillDetails();
  } catch (error) {
    console.error('Error adding audit flag:', error);
  }
};

// Add a new account flag
const addAccountFlag = async () => {
  if (!newAccountFlag.value.trim()) return;
  try {
    await store.addAccountFlagToBill(billId, newAccountFlag.value);
    newAccountFlag.value = '';
    await fetchBillDetails();
  } catch (error) {
    console.error('Error adding account flag:', error);
  }
};

// Format date
const formattedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchBillDetails();
});
</script>

<style scoped>
/* Add any necessary styling here */
</style>
