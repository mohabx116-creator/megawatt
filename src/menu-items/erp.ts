import {
  IconDashboard,
  IconBox,
  IconPackage,
  IconFileInvoice,
  IconReportMoney,
  IconPrinter,
  IconFileDescription
} from '@tabler/icons-react';

const erp = {
  id: 'megawatt-erp',
  title: 'Megawatt',
  type: 'group',
  children: [
    {
      id: 'erp-dashboard',
      title: 'nav.dashboard',
      type: 'item',
      url: '/erp/dashboard',
      icon: IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'erp-products',
      title: 'nav.products',
      type: 'item',
      url: '/erp/products',
      icon: IconBox,
      breadcrumbs: false
    },
    {
      id: 'erp-inventory',
      title: 'nav.inventory',
      type: 'item',
      url: '/erp/inventory',
      icon: IconPackage,
      breadcrumbs: false
    },
    {
      id: 'erp-create-invoice',
      title: 'nav.createInvoice',
      type: 'item',
      url: '/erp/create-invoice',
      icon: IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'erp-create-quotation',
      title: 'nav.createQuotation',
      type: 'item',
      url: '/erp/create-quotation',
      icon: IconFileDescription,
      breadcrumbs: false
    },
    {
      id: 'erp-finance-reports',
      title: 'nav.financeReports',
      type: 'item',
      url: '/erp/finance-reports',
      icon: IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'erp-print-preview',
      title: 'nav.printPreview',
      type: 'item',
      url: '/erp/print-preview',
      icon: IconPrinter,
      breadcrumbs: false
    }
  ]
};

export default erp;
