// src/main.js

import Nora from '@primevue/themes/nora';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Badge from 'primevue/badge';
import Chart from 'primevue/chart'; // Import Chart component
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Panel from 'primevue/panel';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.component('Panel', Panel);
app.component('Badge', Badge);
app.component('Chart', Chart);
app.component('TabMenu', TabMenu);

app.directive('styleclass', StyleClass);

app.use(PrimeVue, {
    theme: {
        preset: Nora
    }
});

app.mount('#app');
