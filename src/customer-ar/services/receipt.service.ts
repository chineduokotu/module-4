import { Receipt, AllocationRequest, PaymentHistoryItem } from '../types/receipt';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const ReceiptService = {
    /**
     * Get receipts by customer ID
     */
    getReceiptsByCustomer: async (customerId: string): Promise<Receipt[]> => {
        // The API might return paginated results, adjust as needed
        return await apiClient.get<Receipt[]>(
            API_ENDPOINTS.RECEIPTS,
            { customer_id: customerId }
        );
    },

    /**
     * Get single receipt by ID
     */
    getReceipt: async (id: string): Promise<Receipt | null> => {
        try {
            // Assuming there's a view endpoint similar to other resources
            return await apiClient.get<Receipt>(`${API_ENDPOINTS.RECEIPTS}/${id}`);
        } catch (error) {
            console.error('Error fetching receipt:', error);
            return null;
        }
    },

    /**
     * Create a new receipt (record payment)
     */
    createReceipt: async (receipt: Omit<Receipt, 'id' | 'unallocatedAmount' | 'status'>): Promise<Receipt> => {
        return await apiClient.post<Receipt>(
            API_ENDPOINTS.RECEIPTS,
            receipt
        );
    },

    /**
     * Allocate receipt to invoices
     */
    allocateReceipt: async (receiptId: string, allocations: { invoiceId: string; amount: number }[]): Promise<void> => {
        const request: AllocationRequest = {
            receiptId,
            allocations
        };

        await apiClient.post(
            API_ENDPOINTS.RECEIPTS_ALLOCATE,
            request
        );
    },

    /**
     * Get payment history for a customer
     */
    getPaymentHistory: async (customerId: string): Promise<PaymentHistoryItem[]> => {
        return await apiClient.get<PaymentHistoryItem[]>(
            API_ENDPOINTS.RECEIPTS_HISTORY(customerId)
        );
    }
};

