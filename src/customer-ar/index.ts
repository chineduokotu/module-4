// Export Pages
export { default as CustomerList } from './pages/CustomerList';
export { default as CustomerForm } from './pages/CustomerForm';
export { default as CustomerDetail } from './pages/CustomerDetail';
export { default as CustomerInvoices } from './pages/CustomerInvoices';
export { default as InvoiceDetail } from './pages/InvoiceDetail';

// Export Types
export * from './types/customer';
export * from './types/invoice';
export * from './types/receipt';
export * from './types/ledger';

// Export Route Config
export { customerRoutes } from './routes';

// Export Services (Optional, if needed by other modules)
export { CustomerService } from './services/customer.service';
export { InvoiceService } from './services/invoice.service';
export { ReceiptService } from './services/receipt.service';
