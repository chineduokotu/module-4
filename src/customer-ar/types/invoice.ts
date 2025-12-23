export type InvoiceStatus = 'draft' | 'posted' | 'paid' | 'unpaid' | 'overdue' | 'void';

export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    total: number;
}

export interface Allocation {
    date: string;
    receiptReference: string;
    amount: number;
}

export interface Invoice {
    id: string;
    customerId: string;
    number: string;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    subtotal: number;
    tax: number;
    totalAmount: number; // API uses totalAmount instead of total
    balance: number; // Remaining amount to be paid
    lineItems: InvoiceLineItem[];
    allocations?: Allocation[];
    notes?: string;
    createdAt?: string;
}

/**
 * Credit note request
 */
export interface CreditNoteRequest {
    reason: string;
    amount: number;
    notes?: string;
}

/**
 * Write-off request
 */
export interface WriteOffRequest {
    reason: string;
    notes?: string;
}

