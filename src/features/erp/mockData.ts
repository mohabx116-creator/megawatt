import {
  Customer,
  DashboardMetric,
  Expense,
  FinanceSummary,
  InventoryItem,
  Invoice,
  Payment,
  Product,
  Supplier,
  StockMovement
} from './types';

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'El Sewedy Electric',
    companyName: 'El Sewedy Electric for Cables',
    taxRegistrationNumber: 'EG-204-118-650',
    email: 'industrial.sales@elsewedy.example',
    phone: '+20 2 2759 9700',
    address: 'Plot 27, First Settlement Industrial Zone',
    city: 'New Cairo',
    leadTimeDays: 5,
    balance: 185000,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'SUP-002',
    name: 'Schneider Electric Egypt',
    companyName: 'Schneider Electric Egypt and North East Africa',
    taxRegistrationNumber: 'EG-510-774-301',
    email: 'orders.egypt@schneider.example',
    phone: '+20 2 2615 4500',
    address: 'Cairo Festival City Business Park',
    city: 'New Cairo',
    leadTimeDays: 7,
    balance: 96000,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'SUP-003',
    name: 'El Nasr Electrical Supplies',
    companyName: 'El Nasr for Electrical and Factory Supplies',
    taxRegistrationNumber: 'EG-332-610-884',
    email: 'sales@elnasr-supplies.example',
    phone: '+20 10 2444 9011',
    address: '18 Gesr El Suez Street',
    city: 'Cairo',
    leadTimeDays: 3,
    balance: 42000,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'SUP-004',
    name: 'Alex Cable Trays',
    companyName: 'Alexandria Metal Works for Cable Management',
    taxRegistrationNumber: 'EG-841-223-119',
    email: 'factory@alextrays.example',
    phone: '+20 3 542 1180',
    address: 'Industrial Zone, Borg El Arab',
    city: 'Alexandria',
    leadTimeDays: 6,
    balance: 27500,
    currency: 'EGP',
    status: 'active'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ahmed Hassan',
    companyName: 'Hassan Electrical Contracting',
    taxRegistrationNumber: 'EG-109-443-220',
    email: 'ahmed.hassan@hassan-electrical.example',
    phone: '+20 10 1122 3344',
    address: 'Plot 44, Third Industrial Zone',
    city: '6th of October',
    creditLimit: 300000,
    balance: 128440,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'CUST-002',
    name: 'Mona Farouk',
    companyName: 'Delta Food Industries',
    taxRegistrationNumber: 'EG-617-900-214',
    email: 'procurement@delta-food.example',
    phone: '+20 12 7555 9088',
    address: 'Block C, Industrial Zone A1',
    city: '10th of Ramadan',
    creditLimit: 180000,
    balance: 0,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'CUST-003',
    name: 'Mahmoud El Sayed',
    companyName: 'El Sayed Plastics Factory',
    taxRegistrationNumber: 'EG-450-781-552',
    email: 'maintenance@elsayed-plastics.example',
    phone: '+20 11 6600 3312',
    address: 'Factory 12, Small Industries Complex',
    city: 'Obour',
    creditLimit: 90000,
    balance: 22800,
    currency: 'EGP',
    status: 'active'
  },
  {
    id: 'CUST-004',
    name: 'Karim Nabil',
    companyName: 'Nabil Engineering Workshop',
    email: 'karim@nabil-workshop.example',
    phone: '+20 10 4888 2109',
    address: '9 El Teraa Street',
    city: 'Shubra El Kheima',
    creditLimit: 60000,
    balance: 18400,
    currency: 'EGP',
    status: 'credit_hold'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'PRD-001',
    sku: 'CBL-CU-16MM-R',
    name: 'Copper Cable 16mm Single Core Red',
    description: 'Flexible copper power cable for panel wiring and factory feeds.',
    category: 'Cables',
    brand: 'El Sewedy',
    unit: 'meter',
    purchasePrice: 145,
    salePrice: 185,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 2400,
    reorderLevel: 500,
    supplierId: 'SUP-001',
    supplierName: 'El Sewedy Electric',
    status: 'active',
    createdAt: '2025-11-12T09:00:00Z',
    updatedAt: '2026-05-14T08:30:00Z'
  },
  {
    id: 'PRD-002',
    sku: 'MCB-3P-32A-SCH',
    name: 'Schneider MCB 32A 3 Pole',
    description: 'Three-pole miniature circuit breaker for distribution boards.',
    category: 'Circuit Breakers',
    brand: 'Schneider Electric',
    unit: 'piece',
    purchasePrice: 430,
    salePrice: 585,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 86,
    reorderLevel: 40,
    supplierId: 'SUP-002',
    supplierName: 'Schneider Electric Egypt',
    status: 'active',
    createdAt: '2025-12-02T10:15:00Z',
    updatedAt: '2026-05-17T11:20:00Z'
  },
  {
    id: 'PRD-003',
    sku: 'CNT-40A-220V-SCH',
    name: 'Contactor 40A 220V Coil',
    description: 'Industrial contactor for motor control panels and pumps.',
    category: 'Contactors',
    brand: 'Schneider Electric',
    unit: 'piece',
    purchasePrice: 820,
    salePrice: 1120,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 28,
    reorderLevel: 25,
    supplierId: 'SUP-002',
    supplierName: 'Schneider Electric Egypt',
    status: 'active',
    createdAt: '2026-01-09T13:00:00Z',
    updatedAt: '2026-05-16T14:00:00Z'
  },
  {
    id: 'PRD-004',
    sku: 'SW-1G-WHT-EG',
    name: 'One Gang Wall Switch White',
    description: 'Flush-mounted wall switch for offices and light industrial spaces.',
    category: 'Switches',
    brand: 'Gewiss',
    unit: 'piece',
    purchasePrice: 48,
    salePrice: 75,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 310,
    reorderLevel: 120,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'active',
    createdAt: '2026-01-20T09:30:00Z',
    updatedAt: '2026-05-12T09:45:00Z'
  },
  {
    id: 'PRD-005',
    sku: 'SOCK-16A-2P-E',
    name: 'Industrial Socket 16A 2P+E',
    description: 'Surface-mounted socket for workshop and factory utility points.',
    category: 'Sockets',
    brand: 'Legrand',
    unit: 'piece',
    purchasePrice: 165,
    salePrice: 240,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 74,
    reorderLevel: 80,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'low_stock',
    createdAt: '2026-02-04T12:00:00Z',
    updatedAt: '2026-05-18T12:00:00Z'
  },
  {
    id: 'PRD-006',
    sku: 'DB-24WAY-METAL',
    name: 'Distribution Panel 24 Way Metal',
    description: 'Wall-mounted metal distribution panel with neutral and earth bars.',
    category: 'Distribution Panels',
    brand: 'Local Fabrication',
    unit: 'piece',
    purchasePrice: 1850,
    salePrice: 2550,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 11,
    reorderLevel: 8,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'active',
    createdAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-05-10T16:10:00Z'
  },
  {
    id: 'PRD-007',
    sku: 'LED-FLOOD-200W',
    name: 'LED Flood Light 200W IP65',
    description: 'Outdoor LED flood light for factory yards and loading areas.',
    category: 'LED Flood Lights',
    brand: 'Philips',
    unit: 'piece',
    purchasePrice: 1180,
    salePrice: 1550,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 16,
    reorderLevel: 20,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'low_stock',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'PRD-008',
    sku: 'TRAY-GALV-200X50',
    name: 'Galvanized Cable Tray 200x50mm',
    description: 'Three-meter galvanized cable tray length with folded edges.',
    category: 'Cable Trays',
    brand: 'Alex Metal',
    unit: '3m length',
    purchasePrice: 310,
    salePrice: 435,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 140,
    reorderLevel: 60,
    supplierId: 'SUP-004',
    supplierName: 'Alex Cable Trays',
    status: 'active',
    createdAt: '2026-03-09T14:00:00Z',
    updatedAt: '2026-05-15T13:30:00Z'
  },
  {
    id: 'PRD-009',
    sku: 'PLUG-32A-5P-IP44',
    name: 'Industrial Plug 32A 5 Pin IP44',
    description: 'Five-pin industrial plug for three-phase workshop machines.',
    category: 'Industrial Plugs',
    brand: 'PCE',
    unit: 'piece',
    purchasePrice: 355,
    salePrice: 510,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 52,
    reorderLevel: 35,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'active',
    createdAt: '2026-03-22T09:20:00Z',
    updatedAt: '2026-05-13T09:20:00Z'
  },
  {
    id: 'PRD-010',
    sku: 'SUP-CABLE-TIE-300',
    name: 'Nylon Cable Ties 300mm Pack',
    description: 'Pack of 100 black nylon cable ties for panel and tray work.',
    category: 'Factory Supplies',
    brand: 'Megafix',
    unit: 'pack',
    purchasePrice: 55,
    salePrice: 90,
    currency: 'EGP',
    taxRate: 14,
    stockQuantity: 0,
    reorderLevel: 50,
    supplierId: 'SUP-003',
    supplierName: 'El Nasr Electrical Supplies',
    status: 'out_of_stock',
    createdAt: '2026-04-04T15:00:00Z',
    updatedAt: '2026-05-18T15:00:00Z'
  }
];

export const mockInventory: InventoryItem[] = mockProducts.map((product) => ({
  id: `INV-${product.id.replace('PRD-', '')}`,
  productId: product.id,
  productName: product.name,
  sku: product.sku,
  warehouseId: product.category === 'Cable Trays' ? 'WH-ALEX-01' : 'WH-CAIRO-01',
  warehouseName: product.category === 'Cable Trays' ? 'Alexandria Cable Yard' : 'Cairo Main Warehouse',
  quantityOnHand: product.stockQuantity,
  reorderLevel: product.reorderLevel,
  reorderQuantity: Math.max(product.reorderLevel * 2, 20),
  unit: product.unit,
  lastRestocked: product.updatedAt
}));

export const mockStockMovements: StockMovement[] = [
  {
    id: 'STM-001',
    productId: 'PRD-001',
    productName: 'Copper Cable 16mm Single Core Red',
    type: 'purchase',
    quantity: 1000,
    unit: 'meter',
    referenceId: 'PO-2026-041',
    referenceType: 'purchase_order',
    date: '2026-05-14T08:30:00Z',
    notes: 'Monthly cable restock from El Sewedy.'
  },
  {
    id: 'STM-002',
    productId: 'PRD-002',
    productName: 'Schneider MCB 32A 3 Pole',
    type: 'sale',
    quantity: -24,
    unit: 'piece',
    referenceId: 'INV-2026-091',
    referenceType: 'invoice',
    date: '2026-05-17T11:20:00Z',
    notes: 'Issued to Hassan Electrical Contracting.'
  },
  {
    id: 'STM-003',
    productId: 'PRD-007',
    productName: 'LED Flood Light 200W IP65',
    type: 'adjustment',
    quantity: -2,
    unit: 'piece',
    referenceId: 'ADJ-2026-014',
    referenceType: 'stock_adjustment',
    date: '2026-05-18T10:00:00Z',
    notes: 'Damaged packaging found during warehouse count.'
  },
  {
    id: 'STM-004',
    productId: 'PRD-005',
    productName: 'Industrial Socket 16A 2P+E',
    type: 'return',
    quantity: 6,
    unit: 'piece',
    referenceId: 'RET-2026-006',
    referenceType: 'sales_return',
    date: '2026-05-18T12:00:00Z',
    notes: 'Customer returned unused sockets from workshop job.'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2026-091',
    invoiceNumber: 'INV-2026-091',
    customerId: 'CUST-001',
    customerName: 'Hassan Electrical Contracting',
    issueDate: '2026-05-17T11:20:00Z',
    dueDate: '2026-06-16T11:20:00Z',
    currency: 'EGP',
    lines: [
      {
        id: 'LINE-001',
        productId: 'PRD-002',
        productName: 'Schneider MCB 32A 3 Pole',
        sku: 'MCB-3P-32A-SCH',
        quantity: 24,
        unit: 'piece',
        unitPrice: 585,
        discountAmount: 0,
        taxRate: 14,
        taxAmount: 1965.6,
        lineTotal: 16005.6
      },
      {
        id: 'LINE-002',
        productId: 'PRD-001',
        productName: 'Copper Cable 16mm Single Core Red',
        sku: 'CBL-CU-16MM-R',
        quantity: 600,
        unit: 'meter',
        unitPrice: 185,
        discountAmount: 3500,
        taxRate: 14,
        taxAmount: 15050,
        lineTotal: 122550
      }
    ],
    subtotal: 125040,
    discountTotal: 3500,
    taxTotal: 17015.6,
    total: 138555.6,
    paidAmount: 60000,
    balanceDue: 78555.6,
    status: 'issued',
    paymentStatus: 'partially_paid',
    notes: 'Deliver to 6th of October site gate 3.'
  },
  {
    id: 'INV-2026-092',
    invoiceNumber: 'INV-2026-092',
    customerId: 'CUST-002',
    customerName: 'Delta Food Industries',
    issueDate: '2026-05-18T09:10:00Z',
    dueDate: '2026-05-25T09:10:00Z',
    currency: 'EGP',
    lines: [
      {
        id: 'LINE-003',
        productId: 'PRD-008',
        productName: 'Galvanized Cable Tray 200x50mm',
        sku: 'TRAY-GALV-200X50',
        quantity: 80,
        unit: '3m length',
        unitPrice: 435,
        discountAmount: 1200,
        taxRate: 14,
        taxAmount: 4704,
        lineTotal: 38304
      },
      {
        id: 'LINE-004',
        productId: 'PRD-009',
        productName: 'Industrial Plug 32A 5 Pin IP44',
        sku: 'PLUG-32A-5P-IP44',
        quantity: 12,
        unit: 'piece',
        unitPrice: 510,
        discountAmount: 0,
        taxRate: 14,
        taxAmount: 856.8,
        lineTotal: 6976.8
      }
    ],
    subtotal: 40920,
    discountTotal: 1200,
    taxTotal: 5560.8,
    total: 45280.8,
    paidAmount: 45280.8,
    balanceDue: 0,
    status: 'issued',
    paymentStatus: 'paid'
  },
  {
    id: 'INV-2026-083',
    invoiceNumber: 'INV-2026-083',
    customerId: 'CUST-004',
    customerName: 'Nabil Engineering Workshop',
    issueDate: '2026-04-28T15:40:00Z',
    dueDate: '2026-05-12T15:40:00Z',
    currency: 'EGP',
    lines: [
      {
        id: 'LINE-005',
        productId: 'PRD-006',
        productName: 'Distribution Panel 24 Way Metal',
        sku: 'DB-24WAY-METAL',
        quantity: 4,
        unit: 'piece',
        unitPrice: 2550,
        discountAmount: 0,
        taxRate: 14,
        taxAmount: 1428,
        lineTotal: 11628
      },
      {
        id: 'LINE-006',
        productId: 'PRD-010',
        productName: 'Nylon Cable Ties 300mm Pack',
        sku: 'SUP-CABLE-TIE-300',
        quantity: 20,
        unit: 'pack',
        unitPrice: 90,
        discountAmount: 0,
        taxRate: 14,
        taxAmount: 252,
        lineTotal: 2052
      }
    ],
    subtotal: 12000,
    discountTotal: 0,
    taxTotal: 1680,
    total: 13680,
    paidAmount: 0,
    balanceDue: 13680,
    status: 'overdue',
    paymentStatus: 'unpaid',
    notes: 'Account on hold until overdue balance is settled.'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-2026-091',
    customerId: 'CUST-001',
    amount: 60000,
    currency: 'EGP',
    date: '2026-05-17T13:15:00Z',
    method: 'bank_transfer',
    referenceNumber: 'CIB-TRX-781225',
    notes: 'Advance transfer received after delivery confirmation.'
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-2026-092',
    customerId: 'CUST-002',
    amount: 45280.8,
    currency: 'EGP',
    date: '2026-05-18T14:35:00Z',
    method: 'cheque',
    referenceNumber: 'CHQ-009814'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: 'EXP-001',
    category: 'rent',
    amount: 18000,
    currency: 'EGP',
    date: '2026-05-01T08:00:00Z',
    description: 'Cairo warehouse monthly rent',
    vendorName: 'El Obour Storage Co.',
    recordedBy: 'Mina Adel'
  },
  {
    id: 'EXP-002',
    category: 'logistics',
    amount: 6200,
    currency: 'EGP',
    date: '2026-05-17T16:00:00Z',
    description: 'Truck delivery to 6th of October customer site',
    vendorName: 'Cairo Freight Express',
    recordedBy: 'Mina Adel'
  },
  {
    id: 'EXP-003',
    category: 'utilities',
    amount: 4850,
    currency: 'EGP',
    date: '2026-05-10T10:00:00Z',
    description: 'Warehouse electricity and water',
    vendorName: 'North Cairo Electricity Distribution',
    recordedBy: 'Sara Mostafa'
  },
  {
    id: 'EXP-004',
    category: 'salaries',
    amount: 42000,
    currency: 'EGP',
    date: '2026-05-05T09:00:00Z',
    description: 'Operations and warehouse payroll advance',
    vendorName: 'Megawatt Internal Payroll',
    recordedBy: 'Sara Mostafa'
  }
];

export const mockDashboardMetrics: DashboardMetric[] = [
  {
    id: 'MET-001',
    title: 'May Revenue',
    value: 197516.4,
    currency: 'EGP',
    trendPercent: 11.8,
    trendDirection: 'up',
    timeframe: 'vs April 2026'
  },
  {
    id: 'MET-002',
    title: 'Receivables',
    value: 92235.6,
    currency: 'EGP',
    trendPercent: 4.2,
    trendDirection: 'down',
    timeframe: 'vs April 2026'
  },
  {
    id: 'MET-003',
    title: 'Low Stock Items',
    value: 3,
    unit: 'items',
    trendPercent: 25,
    trendDirection: 'up',
    timeframe: 'requires reorder'
  },
  {
    id: 'MET-004',
    title: 'Gross Margin',
    value: 31.7,
    unit: 'percent',
    trendPercent: 1.6,
    trendDirection: 'up',
    timeframe: 'month to date'
  }
];

export const mockFinanceSummary: FinanceSummary = {
  period: 'May 2026',
  currency: 'EGP',
  revenue: 197516.4,
  cost: 134890,
  grossProfit: 62626.4,
  expenses: 71050,
  netProfit: -8423.6,
  receivables: 92235.6,
  payables: 350500
};
