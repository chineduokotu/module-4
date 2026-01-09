import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Switch } from 'react-router-dom';

import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import CustomerDetail from './CustomerDetail';
import CustomerStatement from './CustomerStatement';
import InvoiceDetail from './InvoiceDetail';

/**
 * Customer Module Routes
 * This component handles all routing for the Customer Feature Module.
 * It strictly relies on parent app Router context.
 * 
 * IMPORTANT: Route order matters! More specific routes MUST come before parameterized routes.
 */
const CustomerRoutes: React.FC = () => {
    return (
        <IonRouterOutlet>
            <Switch>
                {/* SPECIFIC ROUTES FIRST */}
                
                {/* List Page */}
                <Route exact path="/customers" component={CustomerList} />

                {/* Create New - MUST be before :id routes */}
                <Route exact path="/customers/new" component={CustomerForm} />

                {/* Edit - specific with /edit suffix */}
                <Route exact path="/customers/:id/edit" component={CustomerForm} />

                {/* Statement - standalone page */}
                <Route exact path="/customers/:id/statement" component={CustomerStatement} />

                {/* Invoice Detail */}
                <Route exact path="/invoices/:invoiceId" component={InvoiceDetail} />

                {/* PARAMETERIZED ROUTES LAST */}
                
                {/* Detail View with optional tab */}
                <Route path="/customers/:id" component={CustomerDetail} />
            </Switch>
        </IonRouterOutlet>
    );
};

export default CustomerRoutes;
