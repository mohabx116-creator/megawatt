import {
  GeneratedQuotationSnapshot,
  InvoiceCompatibleSnapshot,
  SalesDocumentLine,
  SalesDocumentLineInput,
  SalesDocumentTotals
} from './types';

export const clampNumber = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const calculateSalesDocumentLine = (input: SalesDocumentLineInput): SalesDocumentLine => {
  const quantity = clampNumber(input.quantity);
  const unitPrice = clampNumber(input.unitPrice);
  const grossAmount = quantity * unitPrice;
  const discount = clampNumber(input.discount, 0, grossAmount);
  const taxableAmount = grossAmount - discount;
  const taxRate = clampNumber(input.taxRate);
  const vatAmount = taxableAmount * (taxRate / 100);

  return {
    ...input,
    quantity,
    unitPrice,
    discount,
    taxRate,
    grossAmount,
    taxableAmount,
    vatAmount,
    lineTotal: taxableAmount + vatAmount
  };
};

export const calculateSalesDocumentTotals = (lines: SalesDocumentLine[], documentDiscount = 0): SalesDocumentTotals => {
  const subtotal = lines.reduce((sum, line) => sum + line.grossAmount, 0);
  const lineDiscountTotal = lines.reduce((sum, line) => sum + line.discount, 0);
  const taxableBeforeDocumentDiscount = lines.reduce((sum, line) => sum + line.taxableAmount, 0);
  const safeDocumentDiscount = clampNumber(documentDiscount, 0, taxableBeforeDocumentDiscount);
  const vatBeforeDocumentDiscount = lines.reduce((sum, line) => sum + line.vatAmount, 0);
  const effectiveTaxRate = taxableBeforeDocumentDiscount > 0 ? vatBeforeDocumentDiscount / taxableBeforeDocumentDiscount : 0;
  const taxableTotal = Math.max(taxableBeforeDocumentDiscount - safeDocumentDiscount, 0);
  const vatTotal = taxableTotal * effectiveTaxRate;
  const grandTotal = taxableTotal + vatTotal;

  return {
    subtotal,
    discountTotal: lineDiscountTotal + safeDocumentDiscount,
    documentDiscount: safeDocumentDiscount,
    taxableTotal,
    vatTotal,
    grandTotal
  };
};

export const calculateQuotationTotals = calculateSalesDocumentTotals;

export const convertQuotationToInvoiceSnapshot = (quotation: GeneratedQuotationSnapshot): InvoiceCompatibleSnapshot => {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  return {
    invoiceNumber,
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    paymentTerms: 'cash',
    paymentStatus: 'unpaid',
    sourceQuotationNumber: quotation.quotationNumber,
    customer: quotation.customer ?? {
      id: quotation.customerId,
      name: quotation.customerId,
      companyName: quotation.customerId
    },
    lines: quotation.lines.map((line) => ({
      id: line.id,
      productId: line.productId,
      productName: line.productName,
      sku: line.sku,
      unit: line.unit,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discount,
      taxRate: line.taxRate,
      taxAmount: line.vatAmount,
      lineTotal: line.lineTotal
    })),
    totals: {
      subtotal: quotation.subtotal,
      lineDiscountTotal: quotation.discountTotal - quotation.documentDiscount,
      invoiceDiscount: quotation.documentDiscount,
      vatAmount: quotation.vatTotal,
      grandTotal: quotation.grandTotal,
      paidAmount: 0,
      balanceDue: quotation.grandTotal
    },
    notes: quotation.notes
  };
};
