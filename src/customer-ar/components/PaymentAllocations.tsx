import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { Allocation } from '../types/invoice';

interface PaymentAllocationsProps {
    allocations?: Allocation[];
}

const PaymentAllocations: React.FC<PaymentAllocationsProps> = ({ allocations = [] }) => {
    if (allocations.length === 0) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Payment Allocations</Typography>
                <Typography variant="body2" color="text.secondary">No payments allocated to this invoice.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Payment Allocations
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Reference</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allocations.map((allocation) => (
                            <TableRow key={allocation.id}>
                                <TableCell>{new Date(allocation.date).toLocaleDateString()}</TableCell>
                                <TableCell>{allocation.receiptReference}</TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(allocation.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PaymentAllocations;
