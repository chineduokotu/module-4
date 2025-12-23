# API Integration Guide

This module is designed using the **Service Layer Pattern**. This means the specific implementation of how data is fetched (currently mock data) is completely separated from the User Interface (UI).

**When the backend API is ready, you ONLY need to edit the files in the `services/` folder.** You do NOT need to touch the Pages or Components.

## How to Switch to Real API

### 1. Prerequisites
Ensure you have the base URL of your API (e.g., provided by the backend team). It's best practice to store this in an environment variable.

Example `.env` file in project root:
```
REACT_APP_API_URL=https://api.yourcompany.com/v1
```

### 2. Updating a Service
Open `src/customer-ar/services/customer.service.ts`.

**Current Mock Implementation:**
```typescript
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // ... filtering mock data ...
        resolve(filteredCustomers);
      }, 800);
    });
  }
```

**Real API Implementation (Example using fetch):**
```typescript
  // Add this property to the class or as a constant
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append('q', filters.search);
    if (filters?.status) queryParams.append('status', filters.status);

    const response = await fetch(`${this.baseUrl}/customers?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  }
```

### 3. Repeat for other methods
You will need to do this for every method (`getCustomer`, `createCustomer`, `updateCustomer`, etc.) in:
- `customer.service.ts`
- `invoice.service.ts`
- `receipt.service.ts`

## Checklist for Backend Team
When speaking to the backend team, you can show them the **Types** in `src/customer-ar/types/`. Tell them:
> "Please ensure the API endpoints return JSON data that matches these interface definitions (`Customer`, `Invoice`, `Receipt`). If the API returns different field names, I will map them in the Service layer."
