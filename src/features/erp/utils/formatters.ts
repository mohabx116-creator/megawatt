import { resources, languageStorageKey } from 'i18n/resources';
import { Language } from 'i18n/types';

const getStoredLanguage = (): Language => {
  const language = localStorage.getItem(languageStorageKey);
  return language === 'ar' ? 'ar' : 'en';
};

export const formatEgp = (value = 0) =>
  getStoredLanguage() === 'ar'
    ? `${new Intl.NumberFormat('en-EG', {
        maximumFractionDigits: 0
      }).format(Number.isFinite(value) ? value : 0)} جنيه`
    : `EGP ${new Intl.NumberFormat('en-EG', {
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0)}`;

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat('en-EG', {
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value?: string) => {
  const language = getStoredLanguage();
  if (!value) return resources[language]['common.notAvailable'];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return resources[language]['common.notAvailable'];

  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-EG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const labelMap: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  issued: 'Issued',
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  unpaid: 'Unpaid',
  overdue: 'Overdue',
  refunded: 'Refunded',
  low_stock: 'Low Stock',
  in_stock: 'In Stock',
  out_of_stock: 'Out of Stock',
  discontinued: 'Discontinued',
  cancelled: 'Cancelled',
  credit_hold: 'Credit Hold',
  pending: 'Pending',
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  cheque: 'Cheque',
  instapay: 'Instapay',
  rent: 'Rent',
  utilities: 'Utilities',
  salaries: 'Salaries',
  logistics: 'Logistics',
  maintenance: 'Maintenance',
  office_supplies: 'Office Supplies',
  marketing: 'Marketing',
  miscellaneous: 'Miscellaneous'
};

export const formatLabel = (value: string) => {
  const language = getStoredLanguage();
  return (
    resources[language][`status.${value}`] ??
    labelMap[value] ??
    value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
};
