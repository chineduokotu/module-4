/**
 * Workflow request types
 */
export type WorkflowType = 'refund' | 'discount';
export type WorkflowStatus = 'pending' | 'approved' | 'rejected';

/**
 * Refund request
 */
export interface RefundRequest {
    customerId: string;
    invoiceId: string;
    amount: number;
    reason: string;
    notes?: string;
}

/**
 * Discount request
 */
export interface DiscountRequest {
    customerId: string;
    invoiceId: string;
    discountPercentage?: number;
    discountAmount?: number;
    reason: string;
    notes?: string;
}

/**
 * Workflow approval item
 */
export interface WorkflowApproval {
    id: string;
    type: WorkflowType;
    customerId: string;
    customerName: string;
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    reason: string;
    notes?: string;
    status: WorkflowStatus;
    requestedBy: string;
    requestedAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
}

/**
 * Workflow action request (approve/reject)
 */
export interface WorkflowActionRequest {
    action: 'approve' | 'reject';
    notes?: string;
}
