import axios from 'axios';

/**
 * Mock utilities that simulate the mother application's common/utils exports.
 * When integrating into the mother app, this file should be REPLACED or REMOVED.
 */

// Generate a unique request ID
export const requestID = (): string => {
    return `rid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get the base URL for API calls
export const baseUrl = (): string => {
    return '/api/';
};

// Axios config with headers
export const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'appToken': localStorage.getItem('appToken') || ''
    }
};
