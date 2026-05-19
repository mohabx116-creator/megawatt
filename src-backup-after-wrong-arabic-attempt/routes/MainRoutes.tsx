import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { EquipmentDesignatorDetailsPage } from 'features/equiment_designator';
import {
  DashboardPage,
  ProductsPage,
  InventoryPage,
  CreateInvoicePage,
  FinanceReportsPage,
  PrintPreviewPage
} from 'features/erp';

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    // <AuthGuard>
      <MainLayout />
    // </AuthGuard>
  ),
  children: [
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: 'management-control/equipment-designators/:id',
      element: <EquipmentDesignatorDetailsPage />
    },
    {
      path: '/erp/dashboard',
      element: <DashboardPage />
    },
    {
      path: '/erp/products',
      element: <ProductsPage />
    },
    {
      path: '/erp/inventory',
      element: <InventoryPage />
    },
    {
      path: '/erp/create-invoice',
      element: <CreateInvoicePage />
    },
    {
      path: '/erp/finance-reports',
      element: <FinanceReportsPage />
    },
    {
      path: '/erp/print-preview',
      element: <PrintPreviewPage />
    }
  ]
};

export default MainRoutes;
