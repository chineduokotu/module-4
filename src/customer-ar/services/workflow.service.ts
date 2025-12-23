import {
    WorkflowApproval,
    RefundRequest,
    DiscountRequest,
    WorkflowActionRequest
} from '../types/workflow';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const WorkflowService = {
    /**
     * Submit a refund request
     */
    submitRefundRequest: async (request: RefundRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.WORKFLOW_REFUND,
            request
        );
    },

    /**
     * Submit a discount request
     */
    submitDiscountRequest: async (request: DiscountRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.WORKFLOW_DISCOUNT,
            request
        );
    },

    /**
     * Get pending approvals
     */
    getPendingApprovals: async (): Promise<WorkflowApproval[]> => {
        return await apiClient.get<WorkflowApproval[]>(
            API_ENDPOINTS.WORKFLOW_PENDING
        );
    },

    /**
     * Approve a workflow request
     */
    approveRequest: async (requestId: string, notes?: string): Promise<void> => {
        const action: WorkflowActionRequest = {
            action: 'approve',
            notes
        };

        await apiClient.post(
            API_ENDPOINTS.WORKFLOW_ACTION(requestId),
            action
        );
    },

    /**
     * Reject a workflow request
     */
    rejectRequest: async (requestId: string, notes?: string): Promise<void> => {
        const action: WorkflowActionRequest = {
            action: 'reject',
            notes
        };

        await apiClient.post(
            API_ENDPOINTS.WORKFLOW_ACTION(requestId),
            action
        );
    }
};
