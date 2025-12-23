import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Box
} from '@mui/material';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../types/invoice';
import { Receipt } from '../types/receipt';

interface Props {
    open: boolean;
    onClose: () => void;
    receipt: Receipt;
    onAllocate: (allocations: { invoiceId: string; amount: number }[]) => void;
}

export const AllocationDialog: React.FC<Props> = ({ open, onClose, receipt, onAllocate }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [allocations, setAllocations] = useState<{ [invoiceId: string]: number }>({});
    const [availableAmount, setAvailableAmount] = useState(0);

    useEffect(() => {
        if (open && receipt) {
            setAvailableAmount(receipt.unallocatedAmount);
            // Fetch unpaid invoices for this customer
            InvoiceService.getInvoicesByCustomer(receipt.customerId)
                .then(data => {
                    // Filter for invoices with balance > 0
                    setInvoices(data.filter(inv => inv.balance > 0 && inv.status !== 'Void'));
                });
            setAllocations({});
        }
    }, [open, receipt]);

    const handleAmountChange = (invoiceId: string, amountStr: string) => {
        const amount = parseFloat(amountStr) || 0;
        setAllocations(prev => ({
            ...prev,
            [invoiceId]: amount
        }));
    };

    const getTotalAllocated = () => {
        return Object.values(allocations).reduce((sum, val) => sum + val, 0);
    };

    const handleSubmit = () => {
        const result = Object.entries(allocations)
            .filter(([_, amount]) => amount > 0)
            .map(([invoiceId, amount]) => ({ invoiceId, amount }));
        onAllocate(result);
        onClose();
    };

    const remaining = availableAmount - getTotalAllocated();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Allocate Receipt #{receipt?.number}</DialogTitle>
            <DialogContent>
                <Box mb={2} display="flex" justifyContent="space-between">
                    <Typography>Receipt Amount: ${receipt?.totalAmount.toFixed(2)}</Typography>
                    <Typography>Available to Allocate: <strong>${availableAmount.toFixed(2)}</strong></Typography>
                </Box>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Balance Due</TableCell>
                            <TableCell align="right" width={150}>Allocate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.number}</TableCell>
                                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                <TableCell align="right">${invoice.balance.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <TextField
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 0, max: Math.min(invoice.balance, availableAmount) }}
                                        value={allocations[invoice.id] || ''}
                                        onChange={(e) => handleAmountChange(invoice.id, e.target.value)}
                                        placeholder="0.00"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {invoices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No unpaid invoices found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                    <Typography color={remaining < 0 ? 'error' : 'textSecondary'}>
                        Remaining: ${remaining.toFixed(2)}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={remaining < 0 || getTotalAllocated() === 0}
                >
                    Save Allocation
                </Button>
            </DialogActions>
        </Dialog>
    );
};
