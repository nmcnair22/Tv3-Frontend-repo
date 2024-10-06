// src/main.js

import Nora from '@primevue/themes/nora';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Chart from 'primevue/chart'; // Import Chart component
import PrimeVue from 'primevue/config';
import Panel from 'primevue/panel';
import StyleClass from 'primevue/styleclass';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.component('Panel', Panel);
app.component('Chart', Chart); // Register Chart component
app.directive('styleclass', StyleClass);

app.use(PrimeVue, {
    theme: {
        preset: Nora
    }
});

app.mount('#app');
