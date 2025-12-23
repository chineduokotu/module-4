import { AgingReport, CustomerStatement } from '../types/report';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const ReportService = {
    /**
     * Get aging analysis for all customers
     */
    getAgingAnalysis: async (asOfDate?: string): Promise<AgingReport> => {
        const params: Record<string, any> = {};

        if (asOfDate) {
            params.as_of_date = asOfDate;
        }

        return await apiClient.get<AgingReport>(
            API_ENDPOINTS.REPORTS_AGING,
            params
        );
    },

    /**
     * Get aging analysis for a single customer
     */
    getCustomerAging: async (customerId: string, asOfDate?: string): Promise<AgingReport> => {
        const params: Record<string, any> = {
            customer_id: customerId
        };

        if (asOfDate) {
            params.as_of_date = asOfDate;
        }

        return await apiClient.get<AgingReport>(
            API_ENDPOINTS.REPORTS_AGING,
            params
        );
    },

    /**
     * Get customer statement
     */
    getCustomerStatement: async (
        customerId: string,
        startDate: string,
        endDate: string
    ): Promise<CustomerStatement> => {
        return await apiClient.get<CustomerStatement>(
            API_ENDPOINTS.REPORTS_STATEMENT,
            {
                customer_id: customerId,
                start_date: startDate,
                end_date: endDate
            }
        );
    }
};
