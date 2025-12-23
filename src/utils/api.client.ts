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
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
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
            return {} as T;
        }

        try {
            return await response.json();
        } catch {
            return {} as T;
        }
    }

    /**
     * Make a GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = new URL(`${this.baseUrl}${endpoint}`);

        // Add query parameters
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: this.getHeaders(),
                signal: controller.signal,
            });

            return await this.handleResponse<T>(response);
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
