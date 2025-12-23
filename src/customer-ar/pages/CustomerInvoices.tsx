import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../types/invoice';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

const CustomerInvoices: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            InvoiceService.getInvoicesByCustomer(id)
                .then(setInvoices)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const columns = [
        { id: 'number', label: 'Invoice #', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 120 },
        {
            id: 'totalAmount', label: 'Amount', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'balance', label: 'Balance', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'status', label: 'Status', minWidth: 100,
            format: (val: string) => <StatusBadge status={val} />
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Invoices</Typography>
                {/* New Invoice Button could go here */}
            </Box>
            <DataTable
                columns={columns}
                rows={invoices}
                pagination
                onRowClick={(row) => history.push(`/invoices/${row.id}`)}
            />
        </Box>
    );
};

export default CustomerInvoices;
