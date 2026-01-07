import { Invoice, CreditNoteRequest, WriteOffRequest } from '../types/invoice';
import { PaginatedResponse } from '../types/customer';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const InvoiceService = {
    /**
     * Get all invoices with optional filters
     */
    getInvoices: async (
        page: number = 1,
        limit: number = 10,
        status?: string,
        customerId?: string
    ): Promise<PaginatedResponse<Invoice>> => {
        const params: Record<string, any> = { page, limit };

        if (status) {
            params.status = status;
        }

        if (customerId) {
            params.customer_id = customerId;
        }

        return await apiClient.get<PaginatedResponse<Invoice>>(
            API_ENDPOINTS.INVOICES,
            params
        );
    },

    /**
     * Get invoices by customer ID
     */
    getInvoicesByCustomer: async (customerId: string): Promise<Invoice[]> => {
        const response = await apiClient.get<PaginatedResponse<Invoice>>(
            API_ENDPOINTS.INVOICES,
            { customer_id: customerId }
        );
        // Access the array from PaginatedData - key might be 'invoices' or 'customers' depending on API
        return (response.data as any).invoices || (response.data as any).customers || [];
    },

    /**
     * Get single invoice by ID
     */
    getInvoice: async (id: string): Promise<Invoice | null> => {
        try {
            return await apiClient.get<Invoice>(API_ENDPOINTS.INVOICE_VIEW(id));
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return null;
        }
    },

    /**
     * Create a new invoice
     */
    createInvoice: async (invoice: Omit<Invoice, 'id' | 'balance' | 'status'>): Promise<Invoice> => {
        return await apiClient.post<Invoice>(
            API_ENDPOINTS.INVOICES,
            invoice
        );
    },

    /**
     * Issue a credit note for an invoice
     */
    issueCreditNote: async (invoiceId: string, creditNote: CreditNoteRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.INVOICE_CREDIT(invoiceId),
            creditNote
        );
    },

    /**
     * Write off an invoice
     */
    writeOffInvoice: async (invoiceId: string, writeOff: WriteOffRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.INVOICE_WRITEOFF(invoiceId),
            writeOff
        );
    }
};

