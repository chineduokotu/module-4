export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

export interface Customer {
  id: string;
  name: string;
  code: string;
  customerType: 'Business' | 'Individual';
  email?: string;
  phone?: string;
  creditLimit: number;
  balance: number;
  paymentTerms: string; // e.g., "Net 30", "COD"
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: CustomerStatus;
  taxId?: string;
  currency: string;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  totalInvoices: number;
  totalOutstanding: number;
  totalPaid: number;
  overdueAmount: number;
}

/**
 * Pagination response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Customer classification from reference data
 */
export interface CustomerClassification {
  id: string;
  name: string;
  code: string;
}

