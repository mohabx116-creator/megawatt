import { Language } from 'i18n/types';

type ProductLike = {
  name?: string;
  productName?: string;
  sku?: string;
};

const translate = (language: Language, value: string | undefined, dictionary: Record<string, string>) => {
  if (!value || language !== 'ar') return value ?? '';
  return dictionary[value] ?? value;
};

const productNames: Record<string, string> = {
  'Copper Cable 16mm Single Core Red': 'كابل نحاس أحمر 16 مم مفرد',
  'Schneider MCB 32A 3 Pole': 'قاطع شنايدر 32 أمبير ثلاثي',
  'Contactor 40A 220V Coil': 'كونتاكتور 40 أمبير بملف 220 فولت',
  'One Gang Wall Switch White': 'مفتاح حائط أبيض مفرد',
  'Industrial Socket 16A 2P+E': 'بريزة صناعية 16 أمبير 2P+E',
  'Distribution Panel 24 Way Metal': 'لوحة توزيع معدنية 24 خط',
  'LED Flood Light 200W IP65': 'كشاف ليد 200 وات IP65',
  'Galvanized Cable Tray 200x50mm': 'حاملة كابلات مجلفنة 200×50 مم',
  'Industrial Plug 32A 5 Pin IP44': 'فيشة صناعية 32 أمبير 5 بن IP44',
  'Nylon Cable Ties 300mm Pack': 'عبوة أربطة كابلات نايلون 300 مم'
};

const categories: Record<string, string> = {
  Cables: 'كابلات',
  'Circuit Breakers': 'قواطع كهربائية',
  Contactors: 'كونتاكتورات',
  Switches: 'مفاتيح',
  Sockets: 'برايز',
  'Distribution Panels': 'لوحات توزيع',
  'LED Flood Lights': 'كشافات ليد',
  'Cable Trays': 'حوامل كابلات',
  'Industrial Plugs': 'فيش صناعية',
  'Factory Supplies': 'مستلزمات مصانع'
};

const units: Record<string, string> = {
  meter: 'متر',
  piece: 'قطعة',
  '3m length': 'طول 3 متر',
  pack: 'عبوة',
  items: 'عنصر',
  percent: 'نسبة'
};

const warehouses: Record<string, string> = {
  'Cairo Main Warehouse': 'مخزن القاهرة الرئيسي',
  'Alexandria Cable Yard': 'ساحة كابلات الإسكندرية'
};

const parties: Record<string, string> = {
  'Delta Food Industries': 'دلتا للصناعات الغذائية',
  'Hassan Electrical Contracting': 'حسن للمقاولات الكهربائية',
  'Nabil Engineering Workshop': 'ورشة نبيل الهندسية',
  'El Sewedy': 'السويدي',
  'El Sewedy Electric': 'السويدي إليكتريك',
  'Schneider Electric': 'شنايدر إليكتريك',
  'Schneider Electric Egypt': 'شنايدر إليكتريك مصر',
  'Schneider Electric Egypt and North East Africa': 'شنايدر إليكتريك مصر وشمال شرق أفريقيا',
  'El Nasr Electrical Supplies': 'النصر للتوريدات الكهربائية',
  'Alex Metal': 'أليكس ميتال',
  'Alex Cable Trays': 'أليكس لحوامل الكابلات',
  'Megawatt Internal Payroll': 'رواتب ميجاوات الداخلية',
  'Cairo Freight Express': 'القاهرة للشحن السريع',
  'North Cairo Electricity Distribution': 'شمال القاهرة لتوزيع الكهرباء',
  'El Obour Storage Co.': 'العبور للتخزين'
};

const paymentMethods: Record<string, string> = {
  cash: 'نقدي',
  Cash: 'نقدي',
  cheque: 'شيك',
  Cheque: 'شيك',
  bank_transfer: 'تحويل بنكي',
  'Bank Transfer': 'تحويل بنكي',
  card: 'بطاقة',
  Card: 'بطاقة'
};

const expenseCategories: Record<string, string> = {
  logistics: 'نقل وشحن',
  Logistics: 'نقل وشحن',
  utilities: 'مرافق',
  Utilities: 'مرافق',
  salaries: 'رواتب',
  Salaries: 'رواتب',
  rent: 'إيجار',
  Rent: 'إيجار'
};

const expenseDescriptions: Record<string, string> = {
  'Truck delivery to 6th of October customer site': 'نقل شحنة إلى موقع عميل بمدينة 6 أكتوبر',
  'Warehouse electricity and water': 'كهرباء ومياه المخزن',
  'Operations and warehouse payroll advance': 'دفعة رواتب مقدمة للتشغيل والمخزن',
  'Cairo warehouse monthly rent': 'إيجار مخزن القاهرة الشهري',
  'Advance transfer received after delivery confirmation.': 'تم استلام التحويل المقدم بعد تأكيد التسليم.',
  'Account on hold until overdue balance is settled.': 'الحساب موقوف لحين سداد الرصيد المتأخر.'
};

export const translateProductName = (language: Language, product: ProductLike | string | undefined) => {
  const value = typeof product === 'string' ? product : product?.name ?? product?.productName;
  return translate(language, value, productNames);
};

export const translateCategory = (language: Language, category: string | undefined) => translate(language, category, categories);

export const translateUnit = (language: Language, unit: string | undefined) => translate(language, unit, units);

export const translateWarehouse = (language: Language, warehouse: string | undefined) => translate(language, warehouse, warehouses);

export const translatePartyName = (language: Language, name: string | undefined) => translate(language, name, parties);

export const translatePaymentMethod = (language: Language, method: string | undefined) =>
  translate(language, method, paymentMethods);

export const translateExpenseCategory = (language: Language, category: string | undefined) =>
  translate(language, category, expenseCategories);

export const translateExpenseDescription = (language: Language, description: string | undefined) =>
  translate(language, description, expenseDescriptions);

export const includesTranslatedValue = (language: Language, search: string, values: Array<string | undefined>) => {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return values.some((value) => value?.toLowerCase().includes(normalizedSearch));
};
