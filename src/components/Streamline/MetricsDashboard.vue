<script setup lang="ts">
import { ref } from 'vue';

// Temporary hardcoded data
const totalBills = ref(10);
const validationPassRate = ref(95);
const averageProcessingTime = ref(2.5);
const billsGraphData = ref({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Bills Processed',
    data: [10, 20, 15],
    backgroundColor: '#42A5F5'
  }]
});
const validationGraphData = ref({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Validation Pass Rate',
    data: [90, 95, 85],
    backgroundColor: '#66BB6A'
  }]
});
const processingTimeGraphData = ref({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Avg Processing Time',
    data: [1.5, 2.0, 2.5],
    backgroundColor: '#FFA726'
  }]
});
const revenueByCategoryData = ref({
  labels: ['Comcast', 'AT&T', 'Spectrum'],
  datasets: [{
    label: 'Revenue',
    data: [5000, 3000, 2000],
    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
  }]
});
const expensesByCategoryData = ref({
  labels: ['Internet', 'Cable TV', 'Broadband'],
  datasets: [{
    label: 'Expenses',
    data: [3000, 2000, 1500],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
});
</script>
