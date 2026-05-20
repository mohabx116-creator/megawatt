import { mockCustomers, mockInvoices, mockProducts } from '../mockData';
import { Invoice } from '../types';
import {
  calculateQuotationTotals,
  calculateSalesDocumentLine,
  GeneratedQuotationSnapshot,
  getGeneratedQuotation,
  MEGAWATT_LAST_GENERATED_INVOICE
} from '../sales-documents';

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  status: string;
  paymentStatus: string;
  total: number;
  paidAmount: number;
  balanceDue: number;
  isGenerated?: boolean;
};

export type GeneratedInvoiceSnapshot = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms?: string;
  paymentStatus: string;
  customer?: {
    id?: string;
    name?: string;
    companyName?: string;
  };
  totals?: {
    grandTotal?: number;
    paidAmount?: number;
    balanceDue?: number;
  };
};

const isGeneratedInvoiceSnapshot = (value: unknown): value is GeneratedInvoiceSnapshot => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<GeneratedInvoiceSnapshot>;
  return Boolean(candidate.invoiceNumber && candidate.invoiceDate && candidate.dueDate);
};

export const getGeneratedInvoiceSnapshot = (): GeneratedInvoiceSnapshot | null => {
  try {
    const rawValue = localStorage.getItem(MEGAWATT_LAST_GENERATED_INVOICE);
    if (!rawValue) return null;
    const parsedValue: unknown = JSON.parse(rawValue);
    return isGeneratedInvoiceSnapshot(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const mapMockInvoice = (invoice: Invoice): InvoiceListItem => ({
  id: invoice.id,
  invoiceNumber: invoice.invoiceNumber,
  customerId: invoice.customerId,
  customerName: invoice.customerName,
  issueDate: invoice.issueDate,
  dueDate: invoice.dueDate,
  status: invoice.status,
  paymentStatus: invoice.paymentStatus,
  total: invoice.total,
  paidAmount: invoice.paidAmount,
  balanceDue: invoice.balanceDue
});

export const getInvoiceListItems = (): InvoiceListItem[] => {
  const generatedInvoice = getGeneratedInvoiceSnapshot();
  const generatedItem: InvoiceListItem[] = generatedInvoice
    ? [
        {
          id: `generated-${generatedInvoice.invoiceNumber}`,
          invoiceNumber: generatedInvoice.invoiceNumber,
          customerId: generatedInvoice.customer?.id,
          customerName: generatedInvoice.customer?.companyName ?? generatedInvoice.customer?.name ?? '',
          issueDate: generatedInvoice.invoiceDate,
          dueDate: generatedInvoice.dueDate,
          status: 'issued',
          paymentStatus: generatedInvoice.paymentStatus,
          total: generatedInvoice.totals?.grandTotal ?? 0,
          paidAmount: generatedInvoice.totals?.paidAmount ?? 0,
          balanceDue: generatedInvoice.totals?.balanceDue ?? 0,
          isGenerated: true
        }
      ]
    : [];

  return [...generatedItem, ...mockInvoices.map(mapMockInvoice)];
};

export const createFallbackQuotation = (): GeneratedQuotationSnapshot => {
  const customer = mockCustomers[0];
  const products = mockProducts.slice(0, 3);
  const lines = products.map((product, index) =>
    calculateSalesDocumentLine({
      id: `QUOTE-LINE-${index + 1}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      unit: product.unit,
      quantity: index === 0 ? 12 : index === 1 ? 150 : 6,
      unitPrice: product.salePrice,
      discount: index === 1 ? 500 : 0,
      taxRate: product.taxRate
    })
  );
  const totals = calculateQuotationTotals(lines, 750);

  return {
    documentType: 'quotation',
    id: 'QUOTE-FALLBACK',
    quotationNumber: 'QT-2026-014',
    customerId: customer.id,
    customer: {
      id: customer.id,
      name: customer.name,
      companyName: customer.companyName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      taxRegistrationNumber: customer.taxRegistrationNumber
    },
    quotationDate: '2026-05-20',
    validUntil: '2026-06-04',
    status: 'sent',
    lines,
    subtotal: totals.subtotal,
    discountTotal: totals.discountTotal,
    documentDiscount: totals.documentDiscount,
    vatTotal: totals.vatTotal,
    grandTotal: totals.grandTotal,
    terms: 'Prices are valid until the stated date and subject to stock availability.',
    notes: 'Quotation prepared for electrical supplies and factory maintenance requirements.',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z'
  };
};

export const getQuotationListItems = (): GeneratedQuotationSnapshot[] => {
  const generatedQuotation = getGeneratedQuotation();
  const fallbackQuotation = createFallbackQuotation();
  return generatedQuotation ? [generatedQuotation, fallbackQuotation] : [fallbackQuotation];
};
