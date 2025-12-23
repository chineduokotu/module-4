import React from 'react';

// Lazy load pages for performance
const CustomerList = React.lazy(() => import('./pages/CustomerList'));
const CustomerForm = React.lazy(() => import('./pages/CustomerForm'));
const CustomerDetail = React.lazy(() => import('./pages/CustomerDetail'));
const CustomerInvoices = React.lazy(() => import('./pages/CustomerInvoices'));
const InvoiceDetail = React.lazy(() => import('./pages/InvoiceDetail'));
const CustomerReceipts = React.lazy(() => import('./pages/CustomerReceipts'));
const CustomerLedger = React.lazy(() => import('./pages/CustomerLedger'));
const CustomerStatement = React.lazy(() => import('./pages/CustomerStatement'));

export interface CustomerRoute {
    path: string;
    exact?: boolean;
    component: React.LazyExoticComponent<React.FC<any>>;
    children?: CustomerRoute[];
}

export const customerRoutes: CustomerRoute[] = [
    {
        path: 'customers',
        exact: true,
        component: CustomerList
    },
    {
        path: 'customers/new',
        exact: true,
        component: CustomerForm
    },
    {
        path: 'customers/:id/edit',
        exact: true,
        component: CustomerForm
    },
    {
        path: 'customers/:id',
        component: CustomerDetail,
        children: [
            { path: 'invoices', component: CustomerInvoices },
            { path: 'receipts', component: CustomerReceipts },
            { path: 'ledger', component: CustomerLedger },
            { path: 'statement', component: CustomerStatement }
        ]
    },
    {
        path: 'invoices/:invoiceId',
        exact: true,
        component: InvoiceDetail
    }
];
