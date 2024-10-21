// src/config/statConfig.js

export const statBoxesConfig = [
    {
        id: 'totalAR',
        title: 'Total Accounts Receivable',
        store: 'balanceSheetStore',
        getter: 'getValue',
        dataKey: 'Total Accounts Receivable',
        format: 'currency',
    },
    {
        id: 'totalAP',
        title: 'Total Accounts Payable',
        store: 'balanceSheetStore',
        getter: 'getValue',
        dataKey: 'Total Accounts Payable',
        format: 'currency',
    },
    {
        id: 'netIncome',
        title: 'Net Income',
        store: 'incomeStore',
        getter: 'getValue',
        dataKey: 'Net Income',
        format: 'currency',
    },
    // Add more stat boxes as needed
];
