import {
  IconDashboard,
  IconBox,
  IconPackage,
  IconFileInvoice,
  IconReportMoney,
  IconPrinter
} from '@tabler/icons-react';

const erp = {
  id: 'megawatt-erp',
  title: 'Megawatt',
  type: 'group',
  children: [
    {
      id: 'erp-dashboard',
      title: 'لوحة التحكم',
      type: 'item',
      url: '/erp/dashboard',
      icon: IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'erp-products',
      title: 'المنتجات',
      type: 'item',
      url: '/erp/products',
      icon: IconBox,
      breadcrumbs: false
    },
    {
      id: 'erp-inventory',
      title: 'المخزون',
      type: 'item',
      url: '/erp/inventory',
      icon: IconPackage,
      breadcrumbs: false
    },
    {
      id: 'erp-create-invoice',
      title: 'إنشاء فاتورة',
      type: 'item',
      url: '/erp/create-invoice',
      icon: IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'erp-finance-reports',
      title: 'التقارير المالية',
      type: 'item',
      url: '/erp/finance-reports',
      icon: IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'erp-print-preview',
      title: 'معاينة الطباعة',
      type: 'item',
      url: '/erp/print-preview',
      icon: IconPrinter,
      breadcrumbs: false
    }
  ]
};

export default erp;
