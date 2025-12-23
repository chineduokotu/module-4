/**
 * API Configuration
 * Central configuration for all API calls
 */

export const API_CONFIG = {
    BASE_URL: 'http://beninclub1931apps.ng/api',
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Reference Data
    CLASSIFICATIONS: '/geacloud_references/classifications',

    // Customer Management
    CUSTOMERS: '/geacloud_customers',
    CUSTOMER_CREATE: '/geacloud_customers/create',
    CUSTOMER_VIEW: (id: string) => `/geacloud_customers/view/${id}`,
    CUSTOMER_UPDATE: (id: string) => `/geacloud_customers/update/${id}`,
    CUSTOMER_DELETE: (id: string) => `/geacloud_customers/delete/${id}`,

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
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const;
