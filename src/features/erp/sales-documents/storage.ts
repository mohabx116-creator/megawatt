import { MEGAWATT_LAST_GENERATED_QUOTATION, MEGAWATT_QUOTATION_DRAFT } from './constants';
import { GeneratedQuotationSnapshot, QuotationDocument } from './types';

const readJson = <T>(key: string, guard: (value: unknown) => value is T): T | null => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    const parsedValue: unknown = JSON.parse(rawValue);
    return guard(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const isQuotationDocument = (value: unknown): value is QuotationDocument => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<QuotationDocument>;
  return Boolean(candidate.quotationNumber && candidate.customerId && Array.isArray(candidate.lines));
};

const isGeneratedQuotationSnapshot = (value: unknown): value is GeneratedQuotationSnapshot =>
  isQuotationDocument(value) && (value as Partial<GeneratedQuotationSnapshot>).documentType === 'quotation';

export const saveGeneratedQuotation = (snapshot: GeneratedQuotationSnapshot) => {
  localStorage.setItem(MEGAWATT_LAST_GENERATED_QUOTATION, JSON.stringify(snapshot));
};

export const getGeneratedQuotation = () => readJson(MEGAWATT_LAST_GENERATED_QUOTATION, isGeneratedQuotationSnapshot);

export const clearGeneratedQuotation = () => {
  localStorage.removeItem(MEGAWATT_LAST_GENERATED_QUOTATION);
};

export const saveQuotationDraft = (draft: QuotationDocument) => {
  localStorage.setItem(MEGAWATT_QUOTATION_DRAFT, JSON.stringify(draft));
};

export const getQuotationDraft = () => readJson(MEGAWATT_QUOTATION_DRAFT, isQuotationDocument);

export const clearQuotationDraft = () => {
  localStorage.removeItem(MEGAWATT_QUOTATION_DRAFT);
};
