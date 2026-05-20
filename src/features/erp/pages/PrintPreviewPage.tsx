import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import GlobalStyles from '@mui/material/GlobalStyles';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockCustomers, mockInvoices } from '../mockData';

import { InvoicePrintDocument, PrintableInvoice } from '../components/print/InvoicePrintDocument';
import { QuotationPrintDocument } from '../components/print/QuotationPrintDocument';

import {
  getGeneratedQuotation,
  clearGeneratedQuotation,
  convertQuotationToInvoiceSnapshot,
  MEGAWATT_LAST_GENERATED_INVOICE
} from '../sales-documents';

import { createFallbackQuotation } from '../utils/documentListData';

const generatedInvoiceStorageKey = 'megawatt:last-generated-invoice';

const isPrintableInvoice = (value: unknown): value is PrintableInvoice => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<PrintableInvoice>;
  return Boolean(candidate.invoiceNumber && candidate.customer && Array.isArray(candidate.lines) && candidate.totals);
};

const getStoredInvoice = (): PrintableInvoice | null => {
  try {
    const rawValue = localStorage.getItem(generatedInvoiceStorageKey);
    if (!rawValue) return null;

    const parsedValue: unknown = JSON.parse(rawValue);
    return isPrintableInvoice(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const getFallbackInvoice = (): PrintableInvoice => {
  const invoice = mockInvoices[0];
  const customer = mockCustomers.find((candidate) => candidate.id === invoice.customerId);

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    paymentTerms: '30',
    paymentStatus: invoice.paymentStatus,
    customer: {
      name: customer?.name ?? invoice.customerName,
      companyName: customer?.companyName ?? invoice.customerName,
      phone: customer?.phone,
      address: customer?.address,
      city: customer?.city,
      taxRegistrationNumber: customer?.taxRegistrationNumber
    },
    lines: invoice.lines.map((line) => ({
      id: line.id,
      productName: line.productName,
      sku: line.sku,
      unit: line.unit,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discountAmount,
      taxRate: line.taxRate,
      taxAmount: line.taxAmount,
      lineTotal: line.lineTotal
    })),
    totals: {
      subtotal: invoice.subtotal,
      lineDiscountTotal: invoice.discountTotal,
      invoiceDiscount: 0,
      vatAmount: invoice.taxTotal,
      grandTotal: invoice.total,
      paidAmount: invoice.paidAmount,
      balanceDue: invoice.balanceDue
    },
    notes: invoice.notes
  };
};

export const PrintPreviewPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, isRtl } = useLanguage();
  const [storageVersion, setStorageVersion] = useState(0);

  // Snackbar Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine active tab from URL query param `type`. Defaults to `invoice`.
  const activeTab = searchParams.get('type') === 'quotation' ? 'quotation' : 'invoice';

  const storedInvoice = useMemo(() => getStoredInvoice(), [storageVersion]);
  const invoice = useMemo(() => storedInvoice ?? getFallbackInvoice(), [storedInvoice]);

  const storedQuotation = useMemo(() => getGeneratedQuotation(), [storageVersion]);
  const quotation = useMemo(() => storedQuotation ?? createFallbackQuotation(), [storedQuotation]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'invoice' | 'quotation') => {
    setSearchParams({ type: newValue });
  };

  const clearInvoice = () => {
    localStorage.removeItem(generatedInvoiceStorageKey);
    setStorageVersion((currentVersion) => currentVersion + 1);
  };

  const clearQuotation = () => {
    clearGeneratedQuotation();
    setStorageVersion((currentVersion) => currentVersion + 1);
  };

  const convertToInvoice = () => {
    if (!quotation) return;
    localStorage.setItem(MEGAWATT_LAST_GENERATED_INVOICE, JSON.stringify(convertQuotationToInvoiceSnapshot(quotation)));
    setStorageVersion((currentVersion) => currentVersion + 1);
    setToastMessage(t('print.convertedToInvoiceSuccessfully'));
    // Redirect to Invoices tab on the same preview hub
    setSearchParams({ type: 'invoice' });
  };

  const printSelector = activeTab === 'invoice' ? '.megawatt-invoice-print-root' : '.megawatt-quotation-print-root';

  return (
    <ErpFullWidthPage>
      {/* Strict CSS isolation in Print Media Query based on the selected tab */}
      <GlobalStyles
        styles={{
          '@media print': {
            '@page': {
              size: 'A4',
              margin: '12mm'
            },
            'html, body': {
              width: '100% !important',
              minWidth: '0 !important',
              margin: '0 !important',
              padding: '0 !important',
              background: '#fff !important'
            },
            'body *': {
              visibility: 'hidden !important'
            },
            [`${printSelector}, ${printSelector} *`]: {
              visibility: 'visible !important'
            },
            [printSelector]: {
              position: 'absolute !important',
              left: '0 !important',
              top: '0 !important',
              width: '100% !important',
              maxWidth: 'none !important',
              margin: '0 !important',
              padding: '0 !important',
              background: '#fff !important'
            },
            '.megawatt-invoice-document, .megawatt-quotation-document': {
              width: '100% !important',
              maxWidth: '100% !important',
              margin: '0 !important',
              padding: '0 !important',
              border: 'none !important',
              boxShadow: 'none !important',
              background: '#fff !important',
              color: '#000 !important'
            },
            '.megawatt-invoice-document table, .megawatt-quotation-document table': {
              width: '100% !important',
              tableLayout: 'auto !important'
            },
            '.megawatt-invoice-document th, .megawatt-invoice-document td, .megawatt-quotation-document th, .megawatt-quotation-document td': {
              padding: '5px 6px !important',
              fontSize: '10px !important',
              lineHeight: '1.35 !important'
            },
            '.no-print': {
              display: 'none !important',
              visibility: 'hidden !important'
            }
          }
        }}
      />

      <Box sx={{ width: '100%' }}>
        <Box className="no-print">
          <ErpPageHeader title={t('print.documentsPreview')} subtitle={t('print.subtitle')} />

          <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ mb: 2 }}>
            {/* Touch friendly and responsive Tab interface */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label={t('print.invoices')} value="invoice" />
              <Tab label={t('print.quotations')} value="quotation" />
            </Tabs>

            {activeTab === 'invoice' ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
                    {t('print.printInvoice')}
                  </Button>
                  <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')}>
                    {t('print.backToCreateInvoice')}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {!storedInvoice && (
                    <Chip label={t('print.showingFallbackDocument')} color="warning" variant="outlined" size="small" />
                  )}
                  {storedInvoice && (
                    <Button color="error" variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />} onClick={clearInvoice}>
                      {t('print.clearGeneratedInvoice')}
                    </Button>
                  )}
                </Stack>
              </Stack>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
                    {t('print.printQuotation')}
                  </Button>
                  <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')}>
                    {t('print.backToCreateQuotation')}
                  </Button>
                  <Button variant="outlined" startIcon={<ReceiptLongOutlinedIcon />} onClick={convertToInvoice}>
                    {t('quotation.convertToInvoice')}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {!storedQuotation && (
                    <Chip label={t('print.showingFallbackDocument')} color="warning" variant="outlined" size="small" />
                  )}
                  {storedQuotation && (
                    <Button color="error" variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />} onClick={clearQuotation}>
                      {t('print.clearGeneratedQuotation')}
                    </Button>
                  )}
                </Stack>
              </Stack>
            )}
          </MainCard>
        </Box>

        {/* Scrollable container for mobile responsiveness */}
        <Box sx={{ overflowX: 'auto', py: 1 }}>
          {activeTab === 'invoice' ? (
            <InvoicePrintDocument invoice={invoice} />
          ) : (
            <QuotationPrintDocument quotation={quotation} />
          )}
        </Box>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={toastMessage !== null}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: isRtl ? 'left' : 'right' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </ErpFullWidthPage>
  );
};
