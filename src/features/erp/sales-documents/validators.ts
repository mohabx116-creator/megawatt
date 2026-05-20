import { SalesDocumentLine } from './types';

export type SalesDocumentValidationResult = {
  valid: boolean;
  errors: {
    customerId?: string;
    lines?: string;
  };
};

export const validateSalesDocument = (customerId: string, lines: SalesDocumentLine[]): SalesDocumentValidationResult => {
  const errors: SalesDocumentValidationResult['errors'] = {};

  if (!customerId) errors.customerId = 'quotation.customerRequired';
  if (!lines.some((line) => line.productId && line.quantity > 0 && line.unitPrice >= 0)) {
    errors.lines = 'quotation.lineRequired';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
