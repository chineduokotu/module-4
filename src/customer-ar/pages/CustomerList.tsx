import React, { useState } from 'react';
import {
    Box, Typography, Button, TextField, MenuItem, Stack, Pagination
} from '@mui/material';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton as IonicButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { Customer } from '../types/customer';
import { useCustomers } from '../hooks/useCustomers';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { useHistory } from 'react-router-dom';

const CustomerList: React.FC = () => {
    const history = useHistory();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Use debounced search or pass search directly
    const { customers, pagination, loading, error } = useCustomers({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined
    });

    const columns = [
        { id: 'code', label: 'Code', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        {
            id: 'creditLimit', label: 'Credit Limit', minWidth: 100, align: 'right' as const,
            format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'balance', label: 'Balance', minWidth: 100, align: 'right' as const,
            format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'status', label: 'Status', minWidth: 100,
            format: (value: string) => <StatusBadge status={value} />
        },
        {
            id: 'actions', label: 'Actions', minWidth: 100, align: 'center' as const,
            format: (_: any, row: Customer) => (
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Button size="small" onClick={(e) => { e.stopPropagation(); history.push(`/customers/${row.id}`); }}>
                        View
                    </Button>
                    <Button size="small" color="secondary" onClick={(e) => { e.stopPropagation(); history.push(`/customers/${row.id}/statement`); }}>
                        Stmt
                    </Button>
                </Stack>
            )
        }
    ];

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusFilter(e.target.value);
        setPage(1); // Reset to first page on filter change
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Customer List</IonTitle>
                    <IonicButton slot="end" onClick={() => history.push('/customers/new')}>
                        <IonIcon icon={add} slot="start" />
                        New
                    </IonicButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            label="Search Customers"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ width: 300 }}
                            placeholder="Search by name or code..."
                        />
                        <TextField
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            size="small"
                            sx={{ width: 150 }}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Blocked">Blocked</MenuItem>
                        </TextField>
                    </Box>

                    {loading ? (
                        <Typography>Loading customers...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : !customers || customers.length === 0 ? (
                        <Typography>No customers found.</Typography>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                rows={customers}
                                onRowClick={(row) => history.push(`/customers/${row.id}`)}
                            />

                            {pagination.totalPages > 1 && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={pagination.totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        showFirstButton
                                        showLastButton
                                    />
                                    <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
                                        Showing {customers.length} of {pagination.total} customers
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default CustomerList;
