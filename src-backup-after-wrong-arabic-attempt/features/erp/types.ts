export type CurrencyCode = 'EGP';

export type ProductCategory =
  | 'Cables'
  | 'Circuit Breakers'
  | 'Contactors'
  | 'Switches'
  | 'Sockets'
  | 'Distribution Panels'
  | 'LED Flood Lights'
  | 'Cable Trays'
  | 'Industrial Plugs'
  | 'Factory Supplies';

export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  currency: CurrencyCode;
  taxRate: number;
  stockQuantity: number;
  reorderLevel: number;
  supplierId: string;
  supplierName: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'credit_hold';

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  taxRegistrationNumber?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  balance: number;
  currency: CurrencyCode;
  status: CustomerStatus;
}

export type SupplierStatus = 'active' | 'inactive';

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  taxRegistrationNumber?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  leadTimeDays: number;
  balance: number;
  currency: CurrencyCode;
  status: SupplierStatus;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantityOnHand: number;
  reorderLevel: number;
  reorderQuantity: number;
  unit: string;
  lastRestocked: string;
}

export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'return';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  referenceId: string;
  referenceType: 'purchase_order' | 'invoice' | 'stock_adjustment' | 'sales_return';
  date: string;
  notes: string;
}

export interface InvoiceLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export type InvoiceStatus = 'draft' | 'issued' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  lines: InvoiceLine[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'cheque' | 'instapay';

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  method: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'salaries'
  | 'logistics'
  | 'maintenance'
  | 'office_supplies'
  | 'marketing'
  | 'miscellaneous';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  currency: CurrencyCode;
  date: string;
  description: string;
  vendorName: string;
  recordedBy: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  currency?: CurrencyCode;
  unit?: string;
  trendPercent: number;
  trendDirection: 'up' | 'down' | 'neutral';
  timeframe: string;
}

export interface FinanceSummary {
  period: string;
  currency: CurrencyCode;
  revenue: number;
  cost: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
  receivables: number;
  payables: number;
}
