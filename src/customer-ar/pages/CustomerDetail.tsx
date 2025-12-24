import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Tabs, Tab, Button, Typography, Paper
} from '@mui/material';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { useParams, useHistory, useLocation, /*Outlet*/ } from 'react-router-dom';
import { CustomerService } from '../services/customer.service';
import { CustomerSummary } from '../types/customer';
import { CustomerCard } from '../components/CustomerCard';
import { SummaryCard } from '../components/SummaryCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useCustomer } from '../hooks/useCustomer';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const location = useLocation();

    // Use custom hook for customer data
    const { customer, loading: customerLoading, error } = useCustomer(id);

    const [summary, setSummary] = useState<CustomerSummary | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);

    // Tab mapping
    const currentTab = (() => {
        if (location.pathname.endsWith('/invoices')) return 1;
        if (location.pathname.endsWith('/receipts')) return 2;
        if (location.pathname.endsWith('/ledger')) return 3;
        if (location.pathname.endsWith('/statement')) return 4;
        return 0; // Overview
    })();

    useEffect(() => {
        if (id) {
            setSummaryLoading(true);
            CustomerService.getCustomerSummary(id)
                .then(setSummary)
                .catch(err => {
                    console.error('Failed to load summary:', err);
                    setSummary(null);
                })
                .finally(() => setSummaryLoading(false));
        }
    }, [id]);

    const handleTabChange = (_: any, newValue: number) => {
        if (!id) return;
        switch (newValue) {
            case 0: history.push(`/customers/${id}`); break;
            case 1: history.push(`/customers/${id}/invoices`); break;
            case 2: history.push(`/customers/${id}/receipts`); break;
            case 3: history.push(`/customers/${id}/ledger`); break;
            case 4: history.push(`/customers/${id}/statement`); break;
        }
    };

    if (customerLoading || summaryLoading) return <Box p={3}><LoadingSkeleton /></Box>;
    if (error || !customer) return <Box p={3}><Typography>{error || 'Customer not found'}</Typography></Box>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>Customer Detail</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4">{customer.name}</Typography>
                        <Button variant="outlined" onClick={() => history.push(`/customers/${id}/edit`)}>
                            Edit Profile
                        </Button>
                    </Box>

                    <Grid container spacing={3} mb={3}>
                        <Grid item xs={12} md={4}>
                            <CustomerCard customer={customer} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <SummaryCard title="Total Invoices" value={summary?.totalInvoices || 0} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <SummaryCard title="Outstanding" value={`$${summary?.totalOutstanding || 0}`} color="#f44336" />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <SummaryCard title="Paid" value={`$${summary?.totalPaid || 0}`} color="#4caf50" />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <SummaryCard title="Overdue" value={`$${summary?.overdueAmount || 0}`} color="#ff9800" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={currentTab} onChange={handleTabChange}>
                            <Tab label="Overview" />
                            <Tab label="Invoices" />
                            <Tab label="Receipts/Payments" />
                            <Tab label="Ledger" />
                            <Tab label="Statement" />
                        </Tabs>
                    </Box>

                    {currentTab === 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                            <Paper sx={{ p: 2 }}>
                                <Typography color="text.secondary">No recent activity to display.</Typography>
                            </Paper>
                        </Box>
                    )}

                    {/* <Outlet /> */}
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default CustomerDetail;
