export type ReceiptStatus = 'Allocated' | 'Unallocated' | 'Void';

export interface ReceiptAllocation {
    invoiceId: string;
    invoiceNumber: string;
    amountAllocated: number;
}

export interface Receipt {
    id: string;
    customerId: string;
    number: string;
    date: string;
    paymentMethod: string; // e.g., "Bank Transfer", "Check", "Cash"
    reference?: string;
    totalAmount: number;
    unallocatedAmount: number;
    status: ReceiptStatus;
    allocations: ReceiptAllocation[];
    notes?: string;
}

/**
 * Request to allocate payment to invoices
 */
export interface AllocationRequest {
    receiptId: string;
    allocations: {
        invoiceId: string;
        amount: number;
    }[];
}

/**
 * Payment history item
 */
export interface PaymentHistoryItem {
    id: string;
    date: string;
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    invoiceAllocations: {
        invoiceNumber: string;
        amount: number;
    }[];
}

