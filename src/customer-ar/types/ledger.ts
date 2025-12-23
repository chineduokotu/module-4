export type LedgerEntryType = 'Invoice' | 'Payment' | 'Credit Note' | 'Debit Note' | 'Adjustment';

export interface LedgerEntry {
    id: string;
    date: string;
    type: LedgerEntryType;
    reference: string; // Invoice Number or Receipt Number
    description?: string;
    debit: number; // Increase in receivable (Invoice)
    credit: number; // Decrease in receivable (Payment)
    balance: number; // Running balance
    currency: string;
}

export interface CustomerStatementItem {
    date: string;
    activity: string;
    reference: string;
    amount: number;
    balance: number;
    dueDate?: string;
    status?: string;
}
