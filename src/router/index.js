import { createRouter, createWebHistory } from 'vue-router';

// Import existing components
import FormWithFiles from '../components/formWithFiles.vue';
import StatsDemo from '../layouts/statsDemo.vue';
import BalanceSheet from '../pages/BalanceSheet.vue'; // <-- Import BalanceSheet component
import CashFlow from '../pages/CashFlow.vue'; // <-- Import CashFlow component
import FinanceDashboard from '../pages/FinanceDashboard.vue'; // <-- Import renamed FinanceDashboard component
import Income from '../pages/Income.vue'; // <-- Import Income component

// Create placeholder components
const Placeholder = { template: '<div>Coming Soon...</div>' };

const routes = [
  {
    path: '/finance/cash-flow',
    component: CashFlow, // <-- Use the imported CashFlow component here
    name: 'CashFlow',
    meta: {
      title: 'Cash Flow',
      breadcrumb: ['Finance', 'Cash Flow']
    }
  },
  {
    path: '/finance/income',
    component: Income, // <-- Use the imported Income component here
    name: 'Income',
    meta: {
      title: 'Income',
      breadcrumb: ['Finance', 'Income']
    }
  },
  {
    path: '/finance/balance-sheet',
    component: BalanceSheet, // <-- Use the imported BalanceSheet component here
    name: 'BalanceSheet',
    meta: {
      title: 'Balance Sheet',
      breadcrumb: ['Finance', 'Balance Sheet']
    }
  },
  {
    path: '/finance/expenses-spend',
    component: Placeholder,
    name: 'ExpensesSpend',
    meta: {
      title: 'Expenses/Spend',
      breadcrumb: ['Finance', 'Expenses/Spend']
    }
  },
  {
    path: '/finance/dashboard',  // <-- Add the Finance Dashboard route
    component: FinanceDashboard, // <-- Use the imported FinanceDashboard component here
    name: 'FinanceDashboard',
    meta: {
      title: 'Finance Dashboard',
      breadcrumb: ['Finance', 'Dashboard']
    }
  },
  {
    path: '/streamline/dashboard',
    component: Placeholder,
    name: 'StreamlineDashboard',
    meta: {
      title: 'Streamline Dashboard',
      breadcrumb: ['Streamline', 'Dashboard']
    }
  },
  {
    path: '/streamline/bill-imports',
    component: Placeholder,
    name: 'BillImports',
    meta: {
      title: 'Bill Imports',
      breadcrumb: ['Streamline', 'Bill Imports']
    }
  },
  {
    path: '/managed-services',
    component: Placeholder,
    name: 'ManagedServices',
    meta: {
      title: 'Managed Services',
      breadcrumb: ['Managed Services']
    }
  },
  {
    path: '/field-services',
    component: Placeholder,
    name: 'FieldServices',
    meta: {
      title: 'Field Services',
      breadcrumb: ['Field Services']
    }
  },
  {
    path: '/page-elements/form-with-files',
    component: FormWithFiles,
    name: 'FormWithFiles',
    meta: {
      title: 'Form with Files',
      breadcrumb: ['Page Elements', 'Form with Files']
    }
  },
  {
    path: '/stats-demo',
    component: StatsDemo,
    name: 'StatBoxes',
    meta: {
      title: 'Stat Boxes',
      breadcrumb: ['Page Elements', 'Stat Boxes']
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
