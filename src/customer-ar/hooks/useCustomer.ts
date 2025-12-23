import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../types/customer';
import { CustomerService } from '../services/customer.service';

export const useCustomer = (id: string | undefined) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomer = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await CustomerService.getCustomer(id);
            setCustomer(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch customer details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    return { customer, loading, error, refetch: fetchCustomer };
};
