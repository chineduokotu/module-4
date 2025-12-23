import { CustomerClassification } from '../types/customer';
import { apiClient } from '../../utils/api.client';
import { API_ENDPOINTS } from '../../config/api.config';

export const ReferenceService = {
    /**
     * Get customer classifications
     */
    getClassifications: async (): Promise<CustomerClassification[]> => {
        return await apiClient.get<CustomerClassification[]>(
            API_ENDPOINTS.CLASSIFICATIONS
        );
    }
};
