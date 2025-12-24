/**
 * API Configuration
 * Central configuration for all API calls
 */

export const API_CONFIG = {
    BASE_URL: '/api', // Using Vite proxy to bypass CORS
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        'Content-Type': 'application/json',
    },
    // Static bearer token for authentication (from Postman - working token)
    STATIC_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYmNkNDM2NWUwM2E1NTk1OGQ3NjE2MDZmZWNiOTJhOGQ3MTVjZWIzZTQ0MDhlNWM2YWMwOWUxYTQ0MGJmYTRjMCIsImVtYWlsIjoiMDgwNTU0MDY5NzciLCJhcHBUb2tlbiI6InRva2VuMmQ1ZWUzYTk0M2ZiNzA4OWE4MmFlMzY1OWY4NGEzZDAifQ.Rz1HLjyO-0HJqs3fJdinRk7HvxJO4GeFh3T1lWDupKo',
    // App token extracted from JWT payload (from Postman - working token)
    STATIC_APP_TOKEN: 'token2d5ee3a943fb7089a82ae3659f84a3d0',
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Reference Data
    CLASSIFICATIONS: '/geacloud_references/classifications',

    // Customer Management
    CUSTOMERS: '/Geacloud_Customers', // Fixed: Changed from geacloud_Customers to match Postman
    CUSTOMER_CREATE: '/Geacloud_Customers/create',
    CUSTOMER_VIEW: (id: string) => `/Geacloud_Customers/view/${id}`,
    CUSTOMER_UPDATE: (id: string) => `/Geacloud_Customers/update/${id}`,
    CUSTOMER_DELETE: (id: string) => `/Geacloud_Customers/delete_x/${id}`,

    // Invoice Management
    INVOICES: '/geacloud_invoices',
    INVOICE_VIEW: (id: string) => `/geacloud_invoices/view/${id}`,
    INVOICE_CREDIT: (id: string) => `/geacloud_invoices/credit/${id}`,
    INVOICE_WRITEOFF: (id: string) => `/geacloud_invoices/writeoff/${id}`,

    // Payment Allocation
    RECEIPTS: '/geacloud_receipts',
    RECEIPTS_ALLOCATE: '/geacloud_receipts/allocate',
    RECEIPTS_HISTORY: (customerId: string) => `/geacloud_receipts/history/${customerId}`,

    // Workflows & Approvals
    WORKFLOW_REFUND: '/geacloud_workflows/refund',
    WORKFLOW_DISCOUNT: '/geacloud_workflows/discount',
    WORKFLOW_PENDING: '/geacloud_workflows/pending',
    WORKFLOW_ACTION: (requestId: string) => `/geacloud_workflows/action/${requestId}`,

    // Reports
    REPORTS_AGING: '/geacloud_reports/aging',
    REPORTS_STATEMENT: '/geacloud_reports/statement',
} as const;

/**
 * Storage keys for authentication
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'token', // Changed from 'auth_token' to match actual localStorage key
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const;
