# Megawatt ERP Demo

Frontend-only ERP demo for a small Egyptian electrical tools and factory supplies company.

## Tech Stack

- React
- TypeScript
- Vite
- Material UI dashboard shell
- Frontend mock data only

## Run

```bash
npm run start
```

## Demo Routes

- `/erp/dashboard`
- `/erp/products`
- `/erp/inventory`
- `/erp/create-invoice`
- `/erp/finance-reports`
- `/erp/print-preview`

## Invoice Workflow

1. Open `/erp/create-invoice`.
2. Select a customer.
3. Add/select products and adjust quantity, price, discount, and paid amount.
4. Click `Generate Invoice`.
5. Click `View Print Preview`.
6. Use `Print` on `/erp/print-preview` to print only the invoice document.

## Notes

- All ERP data is mocked in the frontend.
- No backend calls are required for the demo.
- If authentication is enabled, use the local demo credentials configured in the app.
