export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

export interface Customer {
  id: number;
  customer_code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  classification_id: number;
  classification_name: string;
  contact_person: string;
  status: number;
  credit_limit: string;
  current_balance: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerSummary {
  totalInvoices: number;
  totalOutstanding: number;
  totalPaid: number;
  overdueAmount: number;
}

export interface ApiResponse<T> {
  status_code: number;
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  customers: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;


export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceAllocation {
  date: string;
  receiptReference: string;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  balance: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';
  allocations?: InvoiceAllocation[];
}
