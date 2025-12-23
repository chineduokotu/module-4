/**
 * Aging bucket
 */
export interface AgingBucket {
    current: number;      // 0-30 days
    days30: number;       // 31-60 days
    days60: number;       // 61-90 days
    days90: number;       // 91-120 days
    days120Plus: number;  // 120+ days
    total: number;
}

/**
 * Aging analysis for a single customer
 */
export interface CustomerAging {
    customerId: string;
    customerName: string;
    customerCode: string;
    aging: AgingBucket;
}

/**
 * Aging analysis report
 */
export interface AgingReport {
    asOfDate: string;
    customers: CustomerAging[];
    totals: AgingBucket;
}

/**
 * Customer statement line item
 */
export interface StatementLineItem {
    id?: string; // Optional for DataTable compatibility
    date: string;
    type: 'invoice' | 'payment' | 'credit_note' | 'adjustment';
    reference: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

/**
 * Customer statement
 */
export interface CustomerStatement {
    customerId: string;
    customerName: string;
    customerCode: string;
    startDate: string;
    endDate: string;
    openingBalance: number;
    closingBalance: number;
    lineItems: StatementLineItem[];
}
