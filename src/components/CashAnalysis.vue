<!-- src/components/CashAnalysis.vue -->

<template>
  <div>
    <h2>Cash Account Analysis</h2>

    <!-- Date Range Display -->
    <p>Date Range: {{ startDate }} to {{ endDate }}</p>

    <!-- Growth Rate Input -->
    <div class="controls-container">
      <InputNumber
        v-model="localGrowthRate"
        placeholder="Growth Rate (%)"
        mode="decimal"
        :min="0"
        @change="emitGrowthRate"
      />
    </div>

    <!-- Loading and Error Messages -->
    <Loading v-if="isLoading" />
    <ErrorMessage v-if="error" :message="error" />

    <!-- Analysis Results -->
    <div v-if="!isLoading && cashAnalysisData">
      <p>
        Minimum Balance: {{ formatCurrency(cashAnalysisData.minBalance) }}
      </p>
      <p>
        Maximum Balance: {{ formatCurrency(cashAnalysisData.maxBalance) }}
      </p>
      <p>
        Adjusted Minimum Balance (with growth):
        {{ formatCurrency(cashAnalysisData.adjustedMinBalance) }}
      </p>

      <!-- Chart of Daily Balances -->
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>

    <p v-else-if="!isLoading && !error">
      No cash analysis data available.
    </p>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import InputNumber from 'primevue/inputnumber';
import { computed, ref, watch } from 'vue';
import { useCashAnalysisStore } from '../store/cashAnalysisStore';
import ErrorMessage from './ErrorMessage.vue';
import Loading from './Loading.vue';

const props = defineProps({
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  growthRate: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update-growth-rate']);

const cashAnalysisStore = useCashAnalysisStore();
const { cashAnalysisData, isLoading, error } = cashAnalysisStore;

// Local growth rate to allow two-way binding
const localGrowthRate = ref(props.growthRate);

// Watch for changes in growthRate prop to update localGrowthRate
watch(
  () => props.growthRate,
  (newVal) => {
    localGrowthRate.value = newVal;
  }
);

// Emit updated growth rate when localGrowthRate changes
function emitGrowthRate() {
  emit('update-growth-rate', localGrowthRate.value);
}

// Fetch analysis data when component is mounted or when props change
watch(
  () => [props.startDate, props.endDate, localGrowthRate.value],
  async () => {
    if (props.startDate && props.endDate) {
      await cashAnalysisStore.fetchCashAnalysis(
        props.startDate,
        props.endDate,
        localGrowthRate.value
      );
    }
  },
  { immediate: true }
);

// Format currency
function formatCurrency(value) {
  if (typeof value !== 'number') {
    return '$0.00';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(value);
}

// Chart data
const chartData = computed(() => {
  if (!cashAnalysisData || !cashAnalysisData.cumulativeBalances) {
    return null;
  }

  return {
    labels: cashAnalysisData.cumulativeBalances.map((item) => item.date),
    datasets: [
      {
        label: 'Daily Balance',
        data: cashAnalysisData.cumulativeBalances.map((item) => item.balance),
        fill: false,
        borderColor: '#42A5F5',
      },
    ],
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};
</script>

<style scoped>
.controls-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.chart {
  max-width: 100%;
  margin-top: 1rem;
}
</style>