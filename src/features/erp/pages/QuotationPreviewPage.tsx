import { Navigate } from 'react-router-dom';

export const QuotationPreviewPage = () => {
  return <Navigate to="/erp/print-preview?type=quotation" replace />;
};
