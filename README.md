# 📊 Accounting System - Customer Management Module

A modern, full-featured **Customer Management (Accounts Receivable)** system built with React, TypeScript, Ionic, and Material-UI. This frontend application integrates with a backend API to manage customers, invoices, receipts, and financial reporting.

---

## 🚀 Features

### Customer Management
- ✅ **Customer List** - Paginated table with search and filtering
- ✅ **Customer Detail** - Comprehensive customer overview with tabs
- ✅ **Customer Form** - Create and edit customer profiles
- ✅ **Customer Types** - Support for Business and Individual customers
- ✅ **Status Management** - Active, Inactive, and Blocked statuses
- ✅ **Credit Limit Tracking** - Monitor customer credit limits

### Financial Operations
- 📄 **Invoice Management** - View and manage customer invoices
- 💰 **Receipt/Payment Tracking** - Record and allocate payments
- 📊 **Customer Ledger** - Complete transaction history
- 📑 **Account Statements** - Generate customer statements
- 🔄 **Payment Allocation** - Allocate receipts to specific invoices

### Reporting & Analytics
- 📈 **Aging Reports** - Track overdue accounts
- 💵 **Outstanding Balances** - Monitor receivables
- 📊 **Customer Summary** - Quick financial overview

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Mobile UI:** Ionic React v7
- **Routing:** React Router v5
- **Build Tool:** Vite
- **State Management:** React Hooks
- **HTTP Client:** Fetch API with custom wrapper

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Backend API** running at the configured endpoint

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd accounting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Edit `src/config/api.config.ts` to point to your backend:
   ```typescript
   export const API_CONFIG = {
       BASE_URL: 'http://your-backend-url/api',
       TIMEOUT: 30000,
   };
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
accounting/
├── src/
│   ├── customer-ar/              # Customer Management Module
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AllocationDialog.tsx
│   │   │   ├── CustomerCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── SummaryCard.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useCustomer.ts
│   │   │   └── useCustomers.ts
│   │   ├── pages/                # Page components
│   │   │   ├── CustomerList.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerInvoices.tsx
│   │   │   ├── CustomerLedger.tsx
│   │   │   ├── CustomerReceipts.tsx
│   │   │   ├── CustomerStatement.tsx
│   │   │   └── InvoiceDetail.tsx
│   │   ├── services/             # API service layer
│   │   │   ├── customer.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   ├── receipt.service.ts
│   │   │   ├── reference.service.ts
│   │   │   ├── report.service.ts
│   │   │   └── workflow.service.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── customer.ts
│   │   │   ├── invoice.ts
│   │   │   ├── ledger.ts
│   │   │   ├── receipt.ts
│   │   │   ├── report.ts
│   │   │   └── workflow.ts
│   │   ├── routes.ts             # Route configuration
│   │   └── index.ts              # Module exports
│   ├── config/                   # App configuration
│   │   └── api.config.ts         # API endpoints & settings
│   └── utils/                    # Utility functions
│       └── api.client.ts         # HTTP client wrapper
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔌 API Integration

This application requires a backend API with the following endpoints:

### Customer Endpoints
- `GET /geacloud_customers` - List customers (paginated)
- `POST /geacloud_customers/create` - Create customer
- `GET /geacloud_customers/view/:id` - Get customer details
- `PUT /geacloud_customers/update/:id` - Update customer
- `DELETE /geacloud_customers/delete/:id` - Delete customer

### Invoice Endpoints
- `GET /geacloud_invoices` - List invoices
- `GET /geacloud_invoices/view/:id` - Get invoice details
- `POST /geacloud_invoices/credit/:id` - Credit invoice
- `POST /geacloud_invoices/writeoff/:id` - Write off invoice

### Receipt Endpoints
- `GET /geacloud_receipts` - List receipts
- `POST /geacloud_receipts/allocate` - Allocate payment
- `GET /geacloud_receipts/history/:customerId` - Receipt history

### Report Endpoints
- `GET /geacloud_reports/aging` - Aging report
- `GET /geacloud_reports/statement` - Customer statement

### Reference Data
- `GET /geacloud_references/classifications` - Get classifications

See `src/customer-ar/API_INTEGRATION.md` for detailed API documentation.

---

## 🎯 Usage

### Navigation Flow

```
/customers (Customer List)
    ├─→ /customers/new (Create Customer)
    ├─→ /customers/:id (Customer Detail)
    │   ├─→ /customers/:id/edit (Edit Customer)
    │   ├─→ /customers/:id/invoices (Customer Invoices)
    │   ├─→ /customers/:id/receipts (Customer Receipts)
    │   ├─→ /customers/:id/ledger (Customer Ledger)
    │   └─→ /customers/:id/statement (Customer Statement)
    └─→ /invoices/:invoiceId (Invoice Detail)
```

### Key Features

1. **Search & Filter** - Find customers by name, code, or status
2. **Pagination** - Navigate through large customer lists
3. **Tab Navigation** - Access different customer views seamlessly
4. **Form Validation** - Required fields and data validation
5. **Error Handling** - User-friendly error messages
6. **Loading States** - Visual feedback during API calls

---

## 🔐 Authentication

The application uses **JWT Bearer token authentication**. Tokens are stored in `localStorage` and automatically included in all API requests.

Configure storage keys in `src/config/api.config.ts`:
```typescript
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
};
```

---

## 🏗️ Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` folder.

---

## 🧪 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## ⚠️ Known Issues

- **404 Error on Customer List** - Ensure backend API is running and accessible
- Backend endpoints must match the configuration in `api.config.ts`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Built with React, TypeScript, and Material-UI
- Ionic Framework for mobile-ready components
- Vite for blazing-fast development

---

## 📞 Support

For issues or questions, please contact the development team.

---

**Last Updated:** December 2025
