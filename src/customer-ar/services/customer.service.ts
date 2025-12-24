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
        const params: Record<string, any> = {
            page,
            limit,
            search: search || '',
            requestID: 'rid_12345678902' // Fixed RequestID as per API spec
        };

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
            console.log(`[CustomerService] Fetching customer ${id}...`);
            // Attempt 1: Search by ID (if API supports it)
            let response = await CustomerService.getCustomers(1, 100, id);
            let found = response.data.customers.find(c => String(c.id) === String(id) || c.customer_code === id);

            if (!found) {
                console.log('[CustomerService] Customer not found via search, generic list fetch (limit 100)...');
                // Attempt 2: Fetch recent list without search
                response = await CustomerService.getCustomers(1, 100);
                found = response.data.customers.find(c => String(c.id) === String(id) || c.customer_code === id);
            }

            if (found) {
                console.log('[CustomerService] Customer found:', found.name);
            } else {
                console.warn('[CustomerService] Customer ID not found in first 100 records');
            }

            return found || null;
        } catch (error) {
            console.error('Error fetching customer:', error);
            return null;
        }
    },

    /**
     * Create a new customer
     */
    createCustomer: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
        const payload = {
            ...customer,
            requestID: 'rid_12345678902'
        };

        return await apiClient.post<Customer>(
            API_ENDPOINTS.CUSTOMER_CREATE,
            payload
        );
    },

    /**
     * Update existing customer
     */
    updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
        const payload = {
            ...customer,
            requestID: 'rid_12345678902'
        };

        return await apiClient.put<Customer>(
            API_ENDPOINTS.CUSTOMER_UPDATE(id),
            payload
        );
    },

    /**
     * Delete customer
     */
    deleteCustomer: async (id: string): Promise<void> => {
        await apiClient.delete(`${API_ENDPOINTS.CUSTOMER_DELETE(id)}?requestID=rid_12345678902`);
    },

    /**
     * Get customer summary (totals, outstanding, etc.)
     */
    getCustomerSummary: async (id: string): Promise<CustomerSummary> => {
        // This might be part of the customer detail response or a separate endpoint
        // For now, we'll fetch the customer and derive the summary
        const customer = await CustomerService.getCustomer(id);

        if (!customer) {
            throw new Error('Customer not found');
        }

        return {
            totalInvoices: 0, // These would come from the API response
            totalOutstanding: parseFloat(customer.current_balance) || 0,
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

