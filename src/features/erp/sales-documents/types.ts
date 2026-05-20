export type SalesDocumentType = 'quotation' | 'invoice';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';

export type SalesDocumentStatus = QuotationStatus | 'issued' | 'overdue' | 'cancelled' | 'paid' | 'partially_paid' | 'unpaid';

export type SalesDocumentLineInput = {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
};

export type SalesDocumentLine = SalesDocumentLineInput & {
  grossAmount: number;
  taxableAmount: number;
  vatAmount: number;
  lineTotal: number;
};

export type SalesDocumentTotals = {
  subtotal: number;
  discountTotal: number;
  documentDiscount: number;
  taxableTotal: number;
  vatTotal: number;
  grandTotal: number;
};

export type SalesDocumentCustomerSnapshot = {
  id: string;
  name: string;
  companyName: string;
  phone?: string;
  address?: string;
  city?: string;
  taxRegistrationNumber?: string;
};

export type QuotationDocument = {
  id: string;
  quotationNumber: string;
  customerId: string;
  customer?: SalesDocumentCustomerSnapshot;
  quotationDate: string;
  validUntil: string;
  status: QuotationStatus;
  lines: SalesDocumentLine[];
  subtotal: number;
  discountTotal: number;
  documentDiscount: number;
  vatTotal: number;
  grandTotal: number;
  notes: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
};

export type GeneratedQuotationSnapshot = QuotationDocument & {
  documentType: 'quotation';
};

export type InvoiceCompatibleSnapshot = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  paymentStatus: string;
  sourceQuotationNumber?: string;
  customer: SalesDocumentCustomerSnapshot;
  lines: {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
  }[];
  totals: {
    subtotal: number;
    lineDiscountTotal: number;
    invoiceDiscount: number;
    vatAmount: number;
    grandTotal: number;
    paidAmount: number;
    balanceDue: number;
  };
  notes?: string;
};
