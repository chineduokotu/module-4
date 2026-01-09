import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Switch } from 'react-router-dom';

import CustomerList from './CustomerList';
import CustomerDetail from './CustomerDetail';
import CustomerStatement from './CustomerStatement';
import InvoiceDetail from './InvoiceDetail';
import CustomerAging from './CustomerAging';

/**
 * Customer Module Routes
 * This component handles all routing for the Customer Feature Module.
 * It strictly relies on parent app Router context.
 * 
 * Note: Customer Create/Edit is handled via modals in CustomerList and CustomerDetail.
 */
const CustomerRoutes: React.FC = () => {
    return (
        <IonRouterOutlet>
            <Switch>
                {/* List Page */}
                <Route exact path="/customers" component={CustomerList} />

                {/* Aging Report */}
                <Route exact path="/customers/aging" component={CustomerAging} />

                {/* Statement - standalone page */}
                <Route exact path="folder/customers_statement/:id/" component={CustomerStatement} />

                {/* Invoice Detail */}
                <Route exact path="folder/invoices/:invoiceId" component={InvoiceDetail} />

                {/* Detail View with optional tab - MUST be last */}
                <Route path="folder/customers/:id" component={CustomerDetail} />
            </Switch>
        </IonRouterOutlet>
    );
};

export default CustomerRoutes;

