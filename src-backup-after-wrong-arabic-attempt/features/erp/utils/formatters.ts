export const formatEgp = (value = 0) =>
  `${new Intl.NumberFormat('en-EG', {
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0)} جنيه`;

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat('en-EG', {
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value?: string) => {
  if (!value) return 'غير متاح';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير متاح';

  return new Intl.DateTimeFormat('en-EG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const labelMap: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  issued: 'صادرة',
  paid: 'مدفوعة',
  partially_paid: 'مدفوعة جزئيًا',
  unpaid: 'غير مدفوعة',
  overdue: 'متأخرة',
  refunded: 'مستردة',
  low_stock: 'مخزون منخفض',
  in_stock: 'متوفر',
  out_of_stock: 'نفد المخزون',
  discontinued: 'متوقف',
  cancelled: 'ملغاة',
  credit_hold: 'إيقاف ائتماني',
  pending: 'قيد الانتظار',
  cash: 'نقدًا',
  bank_transfer: 'تحويل بنكي',
  cheque: 'شيك',
  instapay: 'إنستاباي',
  rent: 'إيجار',
  utilities: 'مرافق',
  salaries: 'رواتب',
  logistics: 'نقل وشحن',
  maintenance: 'صيانة',
  office_supplies: 'مستلزمات مكتبية',
  marketing: 'تسويق',
  miscellaneous: 'متنوع'
};

export const formatLabel = (value: string) =>
  labelMap[value] ??
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
