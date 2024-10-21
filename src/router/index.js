// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Import existing components
import FormWithFiles from '../components/formWithFiles.vue';
import StatsDemo from '../layouts/statsDemo.vue';
import BalanceSheet from '../pages/BalanceSheet.vue';
import CashFlow from '../pages/CashFlow.vue';
import FinanceDashboard from '../pages/FinanceDashboard.vue';
import Income from '../pages/Income.vue';
import Paytrack from '../pages/Paytrack.vue'; // Main Paytrack Component
import PaytrackOverview from '../pages/PaytrackOverview.vue'; // Paytrack Overview Page

// Create placeholder components
const Placeholder = { template: '<div>Coming Soon...</div>' };

const routes = [
  {
    path: '/finance/cash-flow',
    component: CashFlow,
    name: 'CashFlow',
    meta: {
      title: 'Cash Flow',
      breadcrumb: ['Finance', 'Cash Flow'],
      headerType: 'default', // Using default header
    },
  },
  {
    path: '/finance/income',
    component: Income,
    name: 'Income',
    meta: {
      title: 'Income',
      breadcrumb: ['Finance', 'Income'],
      headerType: 'default',
    },
  },
  {
    path: '/finance/balance-sheet',
    component: BalanceSheet,
    name: 'BalanceSheet',
    meta: {
      title: 'Balance Sheet',
      breadcrumb: ['Finance', 'Balance Sheet'],
      headerType: 'default',
    },
  },
  {
    path: '/finance/expenses-spend',
    component: Placeholder,
    name: 'ExpensesSpend',
    meta: {
      title: 'Expenses/Spend',
      breadcrumb: ['Finance', 'Expenses/Spend'],
      headerType: 'default',
    },
  },
  {
    path: '/finance/dashboard',
    component: FinanceDashboard,
    name: 'FinanceDashboard',
    meta: {
      title: 'Finance Dashboard',
      breadcrumb: ['Finance', 'Dashboard'],
      headerType: 'default',
    },
  },
  {
    path: '/finance/paytrack',
    component: Paytrack, // <-- Main Paytrack component
    name: 'Paytrack',
    meta: {
      title: 'Paytrack',
      breadcrumb: ['Finance', 'Paytrack'],
      headerType: 'with-tabs', // Indicates that this header includes tabs
      headerOptions: {
        showTabs: true,
        tabs: [
          { label: 'Overview', icon: 'pi pi-fw pi-chart-bar', route: '/finance/paytrack/overview' },
          { label: 'Customers', icon: 'pi pi-fw pi-list', route: '/finance/paytrack/customers' },
          { label: 'Invoices', icon: 'pi pi-file-o', route: '/finance/paytrack/invoices' },
        ],
      },
    },
    children: [
      {
        path: 'overview', // Paytrack Overview
        component: PaytrackOverview,
        name: 'PaytrackOverview',
        meta: {
          title: 'Paytrack Overview',
          breadcrumb: ['Finance', 'Paytrack', 'Overview'],
          headerType: 'with-tabs', // Keep the tabs for all Paytrack routes
        },
      },
      {
        path: 'customers', // Paytrack Customers
        component: Placeholder, // Replace this with the actual Customers component later
        name: 'PaytrackCustomers',
        meta: {
          title: 'Paytrack Customers',
          breadcrumb: ['Finance', 'Paytrack', 'Customers'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'invoices', // Paytrack Invoices
        component: Placeholder, // Replace this with the actual Invoices component later
        name: 'PaytrackInvoices',
        meta: {
          title: 'Paytrack Invoices',
          breadcrumb: ['Finance', 'Paytrack', 'Invoices'],
          headerType: 'with-tabs',
        },
      },
    ],
  },
  {
    path: '/streamline/dashboard',
    component: Placeholder,
    name: 'StreamlineDashboard',
    meta: {
      title: 'Streamline Dashboard',
      breadcrumb: ['Streamline', 'Dashboard'],
      headerType: 'default',
    },
  },
  {
    path: '/streamline/bill-imports',
    component: Placeholder,
    name: 'BillImports',
    meta: {
      title: 'Bill Imports',
      breadcrumb: ['Streamline', 'Bill Imports'],
      headerType: 'default',
    },
  },
  {
    path: '/managed-services',
    component: Placeholder,
    name: 'ManagedServices',
    meta: {
      title: 'Managed Services',
      breadcrumb: ['Managed Services'],
      headerType: 'default',
    },
  },
  {
    path: '/field-services',
    component: Placeholder,
    name: 'FieldServices',
    meta: {
      title: 'Field Services',
      breadcrumb: ['Field Services'],
      headerType: 'default',
    },
  },
  {
    path: '/page-elements/form-with-files',
    component: FormWithFiles,
    name: 'FormWithFiles',
    meta: {
      title: 'Form with Files',
      breadcrumb: ['Page Elements', 'Form with Files'],
      headerType: 'default',
    },
  },
  {
    path: '/stats-demo',
    component: StatsDemo,
    name: 'StatBoxes',
    meta: {
      title: 'Stat Boxes',
      breadcrumb: ['Page Elements', 'Stat Boxes'],
      headerType: 'default',
    },
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route for undefined paths
    component: Placeholder,
    name: 'NotFound',
    meta: {
      title: 'Page Not Found',
      breadcrumb: ['Home', '404'],
      headerType: 'default',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
