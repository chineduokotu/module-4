import { Customer, CustomerSummary, PaginatedResponse } from '../types/customer';
import { LedgerEntry, CustomerStatementItem } from '../types/ledger';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const CustomerService = {
    /**
     * Get customers with pagination and search
     */
    getCustomers: async (
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string
    ): Promise<PaginatedResponse<Customer>> => {
        const params: Record<string, any> = { page, limit };

        if (search) {
            params.search = search;
        }

        if (status) {
            params.status = status;
        }

        return await apiClient.get<PaginatedResponse<Customer>>(
            API_ENDPOINTS.CUSTOMERS,
            params
        );
    },

    /**
     * Get single customer by ID
     */
    getCustomer: async (id: string): Promise<Customer | null> => {
        try {
            return await apiClient.get<Customer>(API_ENDPOINTS.CUSTOMER_VIEW(id));
        } catch (error) {
            console.error('Error fetching customer:', error);
            return null;
        }
    },

    /**
     * Create a new customer
     */
    createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
        return await apiClient.post<Customer>(
            API_ENDPOINTS.CUSTOMER_CREATE,
            customer
        );
    },

    /**
     * Update existing customer
     */
    updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
        return await apiClient.put<Customer>(
            API_ENDPOINTS.CUSTOMER_UPDATE(id),
            customer
        );
    },

    /**
     * Delete customer
     */
    deleteCustomer: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.CUSTOMER_DELETE(id));
    },

    /**
     * Get customer summary (totals, outstanding, etc.)
     */
    getCustomerSummary: async (id: string): Promise<CustomerSummary> => {
        // This might be part of the customer detail response or a separate endpoint
        // For now, we'll fetch the customer and derive the summary
        const customer = await apiClient.get<Customer>(API_ENDPOINTS.CUSTOMER_VIEW(id));

        return {
            totalInvoices: 0, // These would come from the API response
            totalOutstanding: customer.balance || 0,
            totalPaid: 0,
            overdueAmount: 0
        };
    },

    /**
     * Get customer ledger entries
     */
    getLedger: async (customerId: string, dateRange?: { start: string; end: string }): Promise<LedgerEntry[]> => {
        // This endpoint might not be explicitly defined, but could be part of statement
        // For now, return empty array - can be updated when backend provides this endpoint
        console.warn('Ledger endpoint not yet implemented');
        return [];
    },

    /**
     * Get customer statement
     */
    getStatement: async (customerId: string, dateRange?: { start: string; end: string }): Promise<CustomerStatementItem[]> => {
        // This would use the reports/statement endpoint
        // For now, return empty array - will be implemented in report service
        console.warn('Statement should be fetched via ReportService');
        return [];
    }
};

