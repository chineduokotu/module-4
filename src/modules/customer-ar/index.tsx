import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Switch } from 'react-router-dom';

import CustomerList from './CustomerList';
import CustomerDetail from './CustomerDetail';
import CustomerStatement from './CustomerStatement';
import CustomerAging from './CustomerAging';
import CustomerForm from './CustomerForm';
import InvoiceList from './InvoiceList';
import InvoiceDetail from './InvoiceDetail';
import InvoiceForm from './InvoiceForm';
import PaymentForm from './PaymentForm';
import RefundRequestForm from './RefundRequestForm';
import DiscountRequestForm from './DiscountRequestForm';
import WorkflowList from './WorkflowList';

/**
 * Customer Module Routes
 * This component handles all routing for the Customer Feature Module.
 * It strictly relies on parent app Router context.
 * 
 * Note: Customer Create/Edit can be handled via modals in CustomerList and CustomerDetail,
 * or as standalone pages via /customers/new and /customers/:id/edit routes.
 */
const CustomerRoutes: React.FC = () => {
    return (
        <IonRouterOutlet>
            <Switch>
                {/* Customer Management */}
                <Route exact path="/customers" component={CustomerList} />
                <Route exact path="/customers/new" component={CustomerForm} />
                <Route exact path="/customers/aging" component={CustomerAging} />
                <Route exact path="/customers/:id/edit" component={CustomerForm} />
                
                {/* Invoice Management */}
                <Route exact path="/invoices" component={InvoiceList} />
                <Route exact path="/invoices/new" component={InvoiceForm} />
                <Route exact path="/invoices/:invoiceId" component={InvoiceDetail} />
                <Route exact path="folder/invoices/:invoiceId" component={InvoiceDetail} />
                
                {/* Payments & Workflows */}
                <Route exact path="/payments/new" component={PaymentForm} />
                <Route exact path="/refunds/new" component={RefundRequestForm} />
                <Route exact path="/discounts/new" component={DiscountRequestForm} />
                <Route exact path="/workflows" component={WorkflowList} />
                
                {/* Customer Statement - standalone page */}
                <Route exact path="/customers/:id/statement" component={CustomerStatement} />
                <Route exact path="folder/customers_statement/:id/" component={CustomerStatement} />
                
                {/* Detail View with tabs - MUST be last */}
                <Route path="/customers/:id" component={CustomerDetail} />
                <Route path="folder/customers/:id" component={CustomerDetail} />
            </Switch>
        </IonRouterOutlet>
    );
};

export default CustomerRoutes;
