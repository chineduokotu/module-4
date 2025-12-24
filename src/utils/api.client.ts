import { API_CONFIG, STORAGE_KEYS } from '../config/api.config';

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Get authentication token from storage
 * Falls back to static token if no token in localStorage
 */
const getAuthToken = (): string | null => {
    // First try localStorage, then fall back to static token
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (storedToken) {
        return storedToken;
    }

    // Use static token as fallback (if defined)
    return (API_CONFIG as any).STATIC_TOKEN || null;
};

/**
 * API Client utility for making HTTP requests
 */
export class ApiClient {
    private baseUrl: string;
    private timeout: number;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Build headers with authentication
     */
    private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
        const headers: Record<string, string> = {
            ...API_CONFIG.HEADERS,
            ...customHeaders,
        };

        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Add appToken header if available (required by backend)
        const staticAppToken = (API_CONFIG as any).STATIC_APP_TOKEN;
        if (staticAppToken) {
            headers['appToken'] = staticAppToken;
        }

        return headers;
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            let errorData;

            try {
                errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                // If response is not JSON, use status text
            }

            throw new ApiError(response.status, errorMessage, errorData);
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            console.log('ℹ️ API returned 204 No Content');
            return {} as T;
        }

        // Clone the response so we can read it multiple times if needed
        const responseClone = response.clone();

        try {
            const jsonData = await response.json();
            console.log('✅ Successfully parsed JSON response');
            return jsonData;
        } catch (parseError) {
            console.error('❌ Failed to parse JSON response:', parseError);
            console.log('📄 Response status:', responseClone.status);
            console.log('📄 Response headers:', Object.fromEntries(responseClone.headers.entries()));

            // Try to get the raw text from the cloned response
            try {
                const text = await responseClone.text();
                console.log('📄 Raw response text:', text.substring(0, 500)); // First 500 chars
            } catch (textError) {
                console.error('❌ Could not read response text:', textError);
            }

            return {} as T;
        }
    }

    /**
     * Make a GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        // Build the full path
        let fullPath = `${this.baseUrl}${endpoint}`;

        // Add query parameters
        if (params) {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });
            const queryString = queryParams.toString();
            if (queryString) {
                fullPath += `?${queryString}`;
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            // Debug logging
            const headers = this.getHeaders() as Record<string, string>;
            console.log('🔍 API GET Request:', {
                url: fullPath,
                params,
                hasAuthToken: !!headers['Authorization'],
                authHeader: headers['Authorization'] ? `Bearer ${headers['Authorization'].substring(7, 20)}...` : 'None'
            });

            const response = await fetch(fullPath, {
                method: 'GET',
                headers: headers,
                signal: controller.signal,
            });

            console.log('📡 API Response Status:', response.status, response.statusText);

            const result = await this.handleResponse<T>(response);
            console.log('✅ API Response Data:', result);

            return result;
        } catch (error) {
            console.error('❌ API Request Failed:', {
                url: fullPath,
                error
            });
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Make a POST request
     */
    async post<T>(endpoint: string, data?: any): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: data ? JSON.stringify(data) : undefined,
                signal: controller.signal,
            });

            return await this.handleResponse<T>(response);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Make a PUT request
     */
    async put<T>(endpoint: string, data?: any): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: data ? JSON.stringify(data) : undefined,
                signal: controller.signal,
            });

            return await this.handleResponse<T>(response);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Make a DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                signal: controller.signal,
            });

            return await this.handleResponse<T>(response);
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

/**
 * Singleton instance of ApiClient
 */
export const apiClient = new ApiClient();
