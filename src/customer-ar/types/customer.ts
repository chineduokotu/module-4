export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

/**
 * Customer interface matching the actual API response
 * Based on Postman test structure
 */
export interface Customer {
  id: number; // API returns number, not string
  customer_code: string;
  name: string;
  email: string;
  phone: string;
  address: string; // API returns flat string, not object
  city: string;
  state: string;
  classification_id: number;
  classification_name: string;
  contact_person: string;
  status: number; // API returns number (0/1), not string
  credit_limit: string; // API returns string "100000.00"
  current_balance: string; // API returns string "0.00"
  created_at: string;
  updated_at: string;
}

export interface CustomerSummary {
  totalInvoices: number;
  totalOutstanding: number;
  totalPaid: number;
  overdueAmount: number;
}

/**
 * API Response wrapper structure
 * All API responses follow this format
 */
export interface ApiResponse<T> {
  status_code: number;
  status: boolean;
  message: string;
  data: T;
}

/**
 * Paginated data structure (nested inside ApiResponse.data)
 */
export interface PaginatedData<T> {
  customers: T[]; // Note: API uses 'customers' key, not generic array
  total: number;
  page: number;
  limit: number;
  pages: number; // Note: API uses 'pages', not 'totalPages'
}

/**
 * Complete paginated response type
 */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

/**
 * Customer classification from reference data
 */
export interface CustomerClassification {
  id: string;
  name: string;
  code: string;
}

