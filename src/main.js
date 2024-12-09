// src/main.js

import Nora from '@primevue/themes/nora';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chart from 'primevue/chart'; // Import Chart component
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Step from 'primevue/step';
import StepItem from 'primevue/stepitem';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Stepper from 'primevue/stepper';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import Toast from 'primevue/toast';
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
app.component('Stepper', Stepper);
app.component('StepList', StepList);
app.component('StepPanels', StepPanels);
app.component('StepItem', StepItem);
app.component('Step', Step);
app.component('StepPanel', StepPanel);
app.component('Button', Button);
app.component('Card', Card);
app.component('Select', Select);
app.component('Toast', Toast);

app.directive('styleclass', StyleClass);

app.use(PrimeVue, {
    theme: {
        preset: Nora
    }
});

app.mount('#app');
