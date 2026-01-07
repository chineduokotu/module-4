import React from 'react';

// Direct imports (React.lazy removed to fix React 18 + Ionic compatibility issue)
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerDetail from './pages/CustomerDetail';
import CustomerInvoices from './pages/CustomerInvoices';
import InvoiceDetail from './pages/InvoiceDetail';
import CustomerReceipts from './pages/CustomerReceipts';
import CustomerLedger from './pages/CustomerLedger';
import CustomerStatement from './pages/CustomerStatement';

export interface CustomerRoute {
    path: string;
    exact?: boolean;
    component: React.FC<any>;
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
