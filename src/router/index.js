// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Import existing components
import FormWithFiles from '../components/formWithFiles.vue';
import PrequalLayout from '../layouts/PrequalLayout.vue';
import StatsDemo from '../layouts/statsDemo.vue';
import BalanceSheet from '../pages/BalanceSheet.vue';
import CashFlow from '../pages/CashFlow.vue';
import FinanceDashboard from '../pages/FinanceDashboard.vue';
import FinanceDashboardLocal from '../pages/FinanceDashboardLocal.vue';
import FinanceDashboardLocalAgingPayments from '../pages/FinanceDashboardLocalAgingPayments.vue';
import FinanceDashboardLocalInflows from '../pages/FinanceDashboardLocalInflows.vue';
import Income from '../pages/Income.vue';
import NewTab1 from '../pages/NewTab1.vue';
import NewTab2 from '../pages/NewTab2.vue';
import Paytrack from '../pages/Paytrack.vue'; // Main Paytrack Component
import PaytrackOverview from '../pages/PaytrackOverview.vue'; // Paytrack Overview Page
import PaytrackOverviewLocal from '../pages/PaytrackOverviewLocal.vue'; // New Paytrack Overview Local
import PrequalAnalytics from '../pages/prequal/PrequalAnalytics.vue';
import PrequalDetail from '../pages/prequal/PrequalDetail.vue';
import PrequalImportExport from '../pages/prequal/PrequalImportExport.vue';
import PrequalQueue from '../pages/prequal/PrequalQueue.vue';
import PrequalRequest from '../pages/prequal/PrequalRequest.vue';
import TestPage from '../pages/TestPage.vue';

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
    path: '/finance/dashboard-local',
    component: FinanceDashboardLocal,
    name: 'FinanceDashboardLocal',
    meta: {
      title: 'Finance Dashboard - Local',
      breadcrumb: ['Finance', 'Dashboard - Local'],
      headerType: 'with-tabs',
      headerOptions: {
        showTabs: true,
        tabs: [
          { label: 'Inflows', icon: 'pi pi-fw pi-chart-bar', route: '/finance/dashboard-local/inflows' },
          { label: 'Aging and Payments', icon: 'pi pi-fw pi-clock', route: '/finance/dashboard-local/aging-payments' },
          { label: 'New Tab 1', icon: 'pi pi-fw pi-chart-line', route: '/finance/dashboard-local/new-tab-1' },
          { label: 'New Tab 2', icon: 'pi pi-fw pi-chart-pie', route: '/finance/dashboard-local/new-tab-2' },
        ],
      },
    },
    children: [
      {
        path: 'inflows',
        component: FinanceDashboardLocalInflows,
        name: 'FinanceDashboardLocalInflows',
        meta: {
          title: 'Inflows',
          breadcrumb: ['Finance', 'Dashboard - Local', 'Inflows'],
          headerType: 'with-tabs',
        },
        props: true,
      },
      {
        path: 'aging-payments',
        component: FinanceDashboardLocalAgingPayments,
        name: 'FinanceDashboardLocalAgingPayments',
        meta: {
          title: 'Aging and Payments',
          breadcrumb: ['Finance', 'Dashboard - Local', 'Aging and Payments'],
          headerType: 'with-tabs',
        },
        props: true,
      },
      {
        path: 'new-tab-1',
        component: NewTab1,
        name: 'FinanceDashboardLocalNewTab1',
        meta: {
          title: 'New Tab 1',
          breadcrumb: ['Finance', 'Dashboard - Local', 'New Tab 1'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'new-tab-2',
        component: NewTab2,
        name: 'FinanceDashboardLocalNewTab2',
        meta: {
          title: 'New Tab 2',
          breadcrumb: ['Finance', 'Dashboard - Local', 'New Tab 2'],
          headerType: 'with-tabs',
        },
      },
      {
        path: '',
        redirect: '/finance/dashboard-local/inflows',
      },
    ],
  },
  {
    path: '/finance/paytrack',
    component: Paytrack, // Main Paytrack component for the old version
    name: 'Paytrack',
    meta: {
      title: 'Paytrack - Old',
      breadcrumb: ['Finance', 'Paytrack'],
      headerType: 'with-tabs',
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
        path: 'overview', // Old Paytrack Overview
        component: PaytrackOverview,
        name: 'PaytrackOverview',
      },
      {
        path: 'customers',
        component: Placeholder, // Replace with actual Customers component later
        name: 'PaytrackCustomers',
        meta: {
          title: 'Paytrack Customers',
          breadcrumb: ['Finance', 'Paytrack', 'Customers'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'invoices',
        component: Placeholder, // Replace with actual Invoices component later
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
    path: '/finance/paytrack-local',
    component: Paytrack, // Main Paytrack component for the local version
    name: 'PaytrackLocal',
    meta: {
      title: 'Paytrack - Local',
      breadcrumb: ['Finance', 'Paytrack - Local'],
      headerType: 'with-tabs',
      headerOptions: {
        showTabs: true,
        tabs: [
          { label: 'Overview', icon: 'pi pi-fw pi-chart-bar', route: '/finance/paytrack-local/overview' },
          { label: 'Customers', icon: 'pi pi-fw pi-list', route: '/finance/paytrack-local/customers' },
          { label: 'Invoices', icon: 'pi pi-file-o', route: '/finance/paytrack-local/invoices' },
        ],
      },
    },
    children: [
      {
        path: 'overview', // New Paytrack Overview
        component: PaytrackOverviewLocal, // New PaytrackOverviewLocal component
        name: 'PaytrackOverviewLocal',
        meta: {
          title: 'Paytrack Overview - Local',
          breadcrumb: ['Finance', 'Paytrack - Local', 'Overview'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'customers', // Paytrack Customers
        component: Placeholder, // Replace with actual Customers component later
        name: 'PaytrackCustomersLocal',
        meta: {
          title: 'Paytrack Customers - Local',
          breadcrumb: ['Finance', 'Paytrack - Local', 'Customers'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'invoices', // Paytrack Invoices
        component: Placeholder, // Replace with actual Invoices component later
        name: 'PaytrackInvoicesLocal',
        meta: {
          title: 'Paytrack Invoices - Local',
          breadcrumb: ['Finance', 'Paytrack - Local', 'Invoices'],
          headerType: 'with-tabs',
        },
      },
    ],
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
    path: '/prequal',
    component: PrequalLayout,
    meta: {
      title: 'Prequalification Tool',
      breadcrumb: ['Prequal'],
      headerType: 'with-tabs',
      headerOptions: {
        showTabs: true,
        tabs: [
          { label: 'Requests', icon: 'pi pi-fw pi-list', route: '/prequal/requests' },
          { label: 'Queue', icon: 'pi pi-fw pi-inbox', route: '/prequal/queue' },
          { label: 'Import/Export', icon: 'pi pi-fw pi-upload', route: '/prequal/import-export' },
          { label: 'Analytics', icon: 'pi pi-fw pi-chart-bar', route: '/prequal/analytics' },
        ],
      },
    },
    children: [
      {
        path: 'requests',
        component: PrequalRequest,
        name: 'PrequalRequests', // Unique route name
        meta: {
          title: 'Request Submission',
          breadcrumb: ['Prequal', 'Requests'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'queue',
        component: PrequalQueue,
        name: 'PrequalQueue',
        meta: {
          title: 'Queue Management',
          breadcrumb: ['Prequal', 'Queue'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'detail/:id',
        component: PrequalDetail,
        name: 'PrequalDetail',
        meta: {
          title: 'Request Detail',
          breadcrumb: ['Prequal', 'Detail'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'import-export',
        component: PrequalImportExport,
        name: 'PrequalImportExport',
        meta: {
          title: 'Data Import/Export',
          breadcrumb: ['Prequal', 'Import/Export'],
          headerType: 'with-tabs',
        },
      },
      {
        path: 'analytics',
        component: PrequalAnalytics,
        name: 'PrequalAnalytics',
        meta: {
          title: 'Analytics',
          breadcrumb: ['Prequal', 'Analytics'],
          headerType: 'with-tabs',
        },
      },
      // Redirect `/prequal` to `/prequal/requests`
      {
        path: '',
        redirect: 'requests',
      },
    ],
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
  {
    path: '/test',
    component: TestPage,
    name: 'TestPage',
    meta: {
      title: 'Test Page',
      breadcrumb: ['Test'],
      headerType: 'default',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
