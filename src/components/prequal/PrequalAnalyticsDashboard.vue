<!-- src/components/prequal/PrequalAnalyticsDashboard.vue -->
<template>
    <div class="prequal-analytics-dashboard">
      <!-- Statistics Overview -->
      <div class="statistics grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card class="p-4">
          <h3 class="text-lg">Total Requests</h3>
          <p class="text-3xl font-bold">{{ analyticsData.totalRequests }}</p>
        </Card>
        <Card class="p-4">
          <h3 class="text-lg">Qualified (Preferred)</h3>
          <p class="text-3xl font-bold">{{ analyticsData.qualifiedPreferred }}</p>
        </Card>
        <Card class="p-4">
          <h3 class="text-lg">Qualified (Secondary)</h3>
          <p class="text-3xl font-bold">{{ analyticsData.qualifiedSecondary }}</p>
        </Card>
      </div>
  
      <!-- Data Visualization -->
      <div class="data-visualization grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 class="text-lg mb-2">Technology Breakdown</h3>
          <Chart type="pie" :data="technologyChartData" :options="chartOptions" />
        </Card>
        <Card>
          <h3 class="text-lg mb-2">Provider Breakdown</h3>
          <Chart type="pie" :data="providerChartData" :options="chartOptions" />
        </Card>
        <Card class="md:col-span-2">
          <h3 class="text-lg mb-2">Cost Analysis</h3>
          <Chart type="bar" :data="costChartData" :options="barChartOptions" />
        </Card>
      </div>
  
      <!-- Scenario Builder -->
      <div class="scenario-builder p-4 bg-gray-100 rounded-lg mt-6">
        <h3 class="text-xl mb-4">Scenario Builder</h3>
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Dropdown
            v-model="newScenario.technology"
            :options="technologyOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Technology"
            class="w-full md:w-1/4"
          />
          <Dropdown
            v-model="newScenario.provider"
            :options="providerOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Provider"
            class="w-full md:w-1/4"
          />
          <InputNumber
            v-model="newScenario.costFactor"
            placeholder="Cost Factor"
            class="w-full md:w-1/4"
            :min="0"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="2"
          />
          <Button label="Create Scenario" icon="pi pi-plus" @click="createScenario" class="p-button-success" />
        </div>
      </div>
  
      <!-- Scenarios List -->
      <div class="scenarios-list p-4 bg-gray-100 rounded-lg mt-6">
        <h3 class="text-xl mb-4">Saved Scenarios</h3>
        <DataTable :value="scenarios" selectionMode="single" @selection-change="onSelectScenario" class="p-datatable-sm">
          <Column field="id" header="ID" sortable></Column>
          <Column field="technology" header="Technology" sortable></Column>
          <Column field="provider" header="Provider" sortable></Column>
          <Column field="costFactor" header="Cost Factor" sortable></Column>
        </DataTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { usePrequalStore } from '../../store/prequalStore';
  
  // Initialize Toast
  const toast = useToast();
  
  // Initialize the store
  const prequalStore = usePrequalStore();
  
  // Reactive variables
  const analyticsData = ref({
    totalRequests: 0,
    qualifiedPreferred: 0,
    qualifiedSecondary: 0,
    technologyBreakdown: [],
    providerBreakdown: [],
    costAnalysis: [],
  });
  
  const scenarios = ref([]);
  const selectedScenario = ref(null);
  
  // Scenario builder state
  const newScenario = ref({
    technology: null,
    provider: null,
    costFactor: null,
  });
  
  // Computed properties for Dropdown options
  const technologyOptions = computed(() => {
    return analyticsData.value.technologyBreakdown.map(item => ({
      label: item.technology,
      value: item.technology,
    }));
  });
  
  const providerOptions = computed(() => {
    return analyticsData.value.providerBreakdown.map(item => ({
      label: item.provider,
      value: item.provider,
    }));
  });
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Fetch analytics data on mount
  onMounted(async () => {
    try {
      await prequalStore.fetchAnalyticsData();
      analyticsData.value = prequalStore.analyticsData;
      scenarios.value = prequalStore.scenarios;
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Analytics data loaded successfully!',
        life: 3000
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load analytics data.',
        life: 3000
      });
    }
  });
  
  // Watch for updates in the store's analytics data
  prequalStore.$subscribe((mutation, state) => {
    analyticsData.value = state.analyticsData;
    scenarios.value = state.scenarios;
  });
  
  // Prepare chart data
  const technologyChartData = computed(() => ({
    labels: analyticsData.value.technologyBreakdown.map(item => item.technology),
    datasets: [
      {
        data: analyticsData.value.technologyBreakdown.map(item => item.count),
        backgroundColor: [
          '#42A5F5',
          '#66BB6A',
          '#FFA726',
          '#AB47BC',
          '#FF7043',
          '#26C6DA',
        ],
      },
    ],
  }));
  
  const providerChartData = computed(() => ({
    labels: analyticsData.value.providerBreakdown.map(item => item.provider),
    datasets: [
      {
        data: analyticsData.value.providerBreakdown.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8BC34A',
          '#FF9800',
          '#9C27B0',
        ],
      },
    ],
  }));
  
  const costChartData = computed(() => ({
    labels: scenarios.value.map(scenario => `Scenario ${scenario.id}`),
    datasets: [
      {
        label: 'Cost Factor',
        data: scenarios.value.map(scenario => scenario.costFactor),
        backgroundColor: '#42A5F5',
      },
    ],
  }));
  
  // Function to create a new scenario
  const createScenario = async () => {
    if (!newScenario.value.technology || !newScenario.value.provider || newScenario.value.costFactor === null) {
      toast.add({
        severity: 'warn',
        summary: 'Incomplete',
        detail: 'Please fill in all scenario fields.',
        life: 3000
      });
      return;
    }
    try {
      await prequalStore.createScenario(newScenario.value);
      // Reset the scenario builder fields
      newScenario.value = {
        technology: null,
        provider: null,
        costFactor: null,
      };
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Scenario created successfully!',
        life: 3000
      });
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create scenario.',
        life: 3000
      });
    }
  };
  
  // Function to handle scenario selection
  const onSelectScenario = (event) => {
    selectedScenario.value = event.value;
    // Implement additional logic if needed (e.g., update charts based on the selected scenario)
  };
  </script>
  
  <style scoped>
  .prequal-analytics-dashboard {
    padding: 1rem;
  }
  
  .statistics {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
  
  @media (min-width: 768px) {
    .statistics {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .data-visualization {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
  
  @media (min-width: 768px) {
    .data-visualization {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .data-visualization .p-card {
    height: 300px;
  }
  
  .data-visualization .p-card:last-child {
    height: 400px;
  }
  
  .scenario-builder,
  .scenarios-list {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
  }
  
  .scenario-builder h3,
  .scenarios-list h3 {
    margin-bottom: 1rem;
  }
  </style>
  