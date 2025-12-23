import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CustomerService } from '../services/customer.service';
import { LedgerEntry } from '../types/ledger';
import { DataTable } from '../components/DataTable';
import { DateRangePicker } from '../components/DateRangePicker';

const CustomerLedger: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (id) {
            setLoading(true);
            CustomerService.getLedger(id, { start: startDate, end: endDate })
                .then(setEntries)
                .finally(() => setLoading(false));
        }
    }, [id, startDate, endDate]);

    const columns = [
        { id: 'date', label: 'Date', minWidth: 100 },
        { id: 'type', label: 'Type', minWidth: 100 },
        { id: 'reference', label: 'Reference', minWidth: 120 },
        { id: 'description', label: 'Description', minWidth: 200 },
        {
            id: 'debit', label: 'Debit', minWidth: 100, align: 'right' as const,
            format: (val: number) => val ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'
        },
        {
            id: 'credit', label: 'Credit', minWidth: 100, align: 'right' as const,
            format: (val: number) => val ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'
        },
        {
            id: 'balance', label: 'Balance', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Customer Ledger</Typography>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />
            </Box>
            <DataTable
                columns={columns}
                rows={entries}
                pagination
            />
        </Box>
    );
};

export default CustomerLedger;
