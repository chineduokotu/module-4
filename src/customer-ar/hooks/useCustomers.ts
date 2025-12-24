import { useState, useEffect, useCallback } from 'react';
import { Customer, PaginatedResponse } from '../types/customer';
import { CustomerService } from '../services/customer.service';

interface UseCustomersParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export const useCustomers = (params: UseCustomersParams = {}) => {
    const { page = 1, limit = 10, search, status } = params;

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response: any = await CustomerService.getCustomers(
                page,
                limit,
                search,
                status
            );

            // Debug: Log the actual response structure
            console.log('🔍 API Response:', response);

            // Handle backend error format
            if (response.status === 'false' || response.status === false) {
                throw new Error(response.message || 'API returned an error');
            }

            // Handle success format
            if (response.status_code === 200 && response.status === true && response.data) {
                console.log('✅ Successfully parsed customers response');
                setCustomers(response.data.customers || []);
                setPagination({
                    page: response.data.page,
                    limit: response.data.limit,
                    total: response.data.total,
                    totalPages: response.data.pages
                });
                setError(null);
            } else {
                console.error('❌ Unexpected response format:', response);
                throw new Error('Unexpected API response format');
            }

        } catch (err: any) {
            let errorMessage = 'Failed to fetch customers';

            if (err.status === 404) {
                errorMessage = 'API endpoint not found. Please ensure the backend server is running.';
            } else if (err.status === 401) {
                errorMessage = 'Unauthorized. Please log in again.';
            } else if (err.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setCustomers([]); // Reset to empty array on error
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, status]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return { customers, pagination, loading, error, refetch: fetchCustomers };
};
