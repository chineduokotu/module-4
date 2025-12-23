import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ReceiptService } from '../services/receipt.service';
import { Receipt } from '../types/receipt';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

import { AllocationDialog } from '../components/AllocationDialog'; // Import Dialog

const CustomerReceipts: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [openAllocation, setOpenAllocation] = useState(false);

    const fetchReceipts = () => {
        if (id) {
            setLoading(true);
            ReceiptService.getReceiptsByCustomer(id)
                .then(setReceipts)
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, [id]);

    const handleAllocateClick = (receipt: Receipt) => {
        setSelectedReceipt(receipt);
        setOpenAllocation(true);
    };

    const handleAllocationSubmit = async (allocations: { invoiceId: string; amount: number }[]) => {
        if (!selectedReceipt) return;
        try {
            await ReceiptService.allocate(selectedReceipt.id, allocations);
            await fetchReceipts();
            setOpenAllocation(false);
            setSelectedReceipt(null);
        } catch (error) {
            console.error('Failed to allocate receipt:', error);
        }
    };

    const columns = [
        { id: 'number', label: 'Receipt #', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 120 },
        { id: 'paymentMethod', label: 'Method', minWidth: 120 },
        {
            id: 'totalAmount', label: 'Amount', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'unallocatedAmount', label: 'Unallocated', minWidth: 100, align: 'right' as const,
            format: (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        {
            id: 'status', label: 'Status', minWidth: 100,
            format: (val: string) => <StatusBadge status={val} />
        },
        {
            id: 'actions', label: 'Actions', minWidth: 100, align: 'center' as const,
            format: (_: any, row: Receipt) => (
                row.unallocatedAmount > 0 ? (
                    <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); handleAllocateClick(row); }}>
                        Allocate
                    </Button>
                ) : null
            )
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Receipts & Payments</Typography>
            </Box>
            <DataTable
                columns={columns}
                rows={receipts}
                pagination
            />
            {selectedReceipt && (
                <AllocationDialog
                    open={openAllocation}
                    onClose={() => setOpenAllocation(false)}
                    receipt={selectedReceipt}
                    onAllocate={handleAllocationSubmit}
                />
            )}
        </Box>
    );
};

export default CustomerReceipts;
