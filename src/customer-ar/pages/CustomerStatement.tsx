import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Divider, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ReportService } from '../services/report.service';
import { CustomerService } from '../services/customer.service';
import { CustomerStatement as CustomerStatementType } from '../types/report';
import { DateRangePicker } from '../components/DateRangePicker';
import { DataTable } from '../components/DataTable';

const CustomerStatement: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [statement, setStatement] = useState<CustomerStatementType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (id && startDate && endDate) {
            setLoading(true);
            setError(null);
            ReportService.getCustomerStatement(id, startDate, endDate)
                .then(setStatement)
                .catch((err) => {
                    setError(err.message || 'Failed to load statement');
                    console.error('Error loading statement:', err);
                })
                .finally(() => setLoading(false));
        }
    }, [id, startDate, endDate]);

    const columns = [
        { id: 'date', label: 'Date', minWidth: 100 },
        {
            id: 'type',
            label: 'Type',
            minWidth: 100,
            format: (value: string) => value.replace('_', ' ').toUpperCase()
        },
        { id: 'reference', label: 'Reference', minWidth: 120 },
        { id: 'description', label: 'Description', minWidth: 200 },
        {
            id: 'debit', label: 'Debit', minWidth: 100, align: 'right' as const,
            format: (val: number) => val > 0 ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'
        },
        {
            id: 'credit', label: 'Credit', minWidth: 100, align: 'right' as const,
            format: (val: number) => val > 0 ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'
        },
        {
            id: 'balance', label: 'Balance', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Customer Statement</Typography>
                <Box display="flex" gap={2}>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => alert('PDF export functionality to be implemented')}
                        disabled={!statement}
                    >
                        Export PDF
                    </Button>
                </Box>
            </Box>

            {!startDate || !endDate ? (
                <Alert severity="info">Please select a date range to view the statement.</Alert>
            ) : loading ? (
                <Typography>Loading statement...</Typography>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : statement ? (
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#fafafa' }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">{statement.customerName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Customer Code: {statement.customerCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Period: {statement.startDate} to {statement.endDate}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                            <strong>Opening Balance:</strong> {statement.openingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Closing Balance:</strong> {statement.closingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </Typography>
                    </Box>

                    <DataTable
                        columns={columns}
                        rows={statement.lineItems.map((item, index) => ({
                            ...item,
                            id: `${item.reference}-${index}` // Generate unique id for each row
                        }))}
                    />

                    <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>
                        End of Statement
                    </Box>
                </Paper>
            ) : (
                <Alert severity="info">No statement data available for the selected period.</Alert>
            )}
        </Box>
    );
};

export default CustomerStatement;
