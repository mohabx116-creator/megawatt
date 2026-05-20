import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockCustomers, mockProducts } from '../mockData';
import {
  calculateQuotationTotals,
  calculateSalesDocumentLine,
  clearGeneratedQuotation,
  convertQuotationToInvoiceSnapshot,
  GeneratedQuotationSnapshot,
  getGeneratedQuotation,
  MEGAWATT_LAST_GENERATED_INVOICE
} from '../sales-documents';
import { translatePartyName, translateProductName, translateUnit } from '../utils/displayTranslations';

const createFallbackQuotation = (): GeneratedQuotationSnapshot => {
  const customer = mockCustomers[0];
  const products = mockProducts.slice(0, 3);
  const lines = products.map((product, index) =>
    calculateSalesDocumentLine({
      id: `QUOTE-LINE-${index + 1}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      unit: product.unit,
      quantity: index === 0 ? 12 : index === 1 ? 150 : 6,
      unitPrice: product.salePrice,
      discount: index === 1 ? 500 : 0,
      taxRate: product.taxRate
    })
  );
  const totals = calculateQuotationTotals(lines, 750);

  return {
    documentType: 'quotation',
    id: 'QUOTE-FALLBACK',
    quotationNumber: 'QT-2026-014',
    customerId: customer.id,
    customer: {
      id: customer.id,
      name: customer.name,
      companyName: customer.companyName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      taxRegistrationNumber: customer.taxRegistrationNumber
    },
    quotationDate: '2026-05-20',
    validUntil: '2026-06-04',
    status: 'sent',
    lines,
    subtotal: totals.subtotal,
    discountTotal: totals.discountTotal,
    documentDiscount: totals.documentDiscount,
    vatTotal: totals.vatTotal,
    grandTotal: totals.grandTotal,
    terms: 'Prices are valid until the stated date and subject to stock availability.',
    notes: 'Quotation prepared for electrical supplies and factory maintenance requirements.',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z'
  };
};

export const QuotationPreviewPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, isRtl, formatCurrency, formatDate } = useLanguage();
  const [storageVersion, setStorageVersion] = useState(0);
  const storedQuotation = useMemo(() => getGeneratedQuotation(), [storageVersion]);
  const quotation = useMemo(() => storedQuotation ?? createFallbackQuotation(), [storedQuotation]);
  const customer = quotation.customer;

  const clearQuotation = () => {
    clearGeneratedQuotation();
    setStorageVersion((currentVersion) => currentVersion + 1);
  };

  const convertToInvoice = () => {
    localStorage.setItem(MEGAWATT_LAST_GENERATED_INVOICE, JSON.stringify(convertQuotationToInvoiceSnapshot(quotation)));
    navigate('/erp/print-preview');
  };

  return (
    <ErpFullWidthPage>
      <GlobalStyles
        styles={{
          '@media print': {
            '@page': { size: 'A4', margin: '12mm' },
            'html, body': { width: '100% !important', margin: '0 !important', padding: '0 !important', background: '#fff !important' },
            'body *': { visibility: 'hidden !important' },
            '.megawatt-quotation-print-root, .megawatt-quotation-print-root *': { visibility: 'visible !important' },
            '.megawatt-quotation-print-root': {
              position: 'absolute !important',
              left: '0 !important',
              top: '0 !important',
              width: '100% !important',
              margin: '0 !important',
              padding: '0 !important',
              background: '#fff !important'
            },
            '.megawatt-quotation-document': {
              width: '100% !important',
              maxWidth: '100% !important',
              margin: '0 !important',
              padding: '0 !important',
              border: 'none !important',
              boxShadow: 'none !important',
              background: '#fff !important',
              color: '#000 !important'
            },
            '.no-print': { display: 'none !important', visibility: 'hidden !important' }
          }
        }}
      />

      <Box className="no-print">
        <ErpPageHeader title={t('quotation.previewTitle')} subtitle={t('quotation.previewSubtitle')} />
        <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
                {t('common.print')}
              </Button>
              <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')}>
                {t('quotation.backToCreate')}
              </Button>
              <Button variant="outlined" startIcon={<ReceiptLongOutlinedIcon />} onClick={convertToInvoice}>
                {t('quotation.convertToInvoice')}
              </Button>
            </Stack>
            {storedQuotation && (
              <Button color="error" variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />} onClick={clearQuotation}>
                {t('quotation.clearGenerated')}
              </Button>
            )}
          </Stack>
        </MainCard>
      </Box>

      <Box
        className="megawatt-quotation-print-root megawatt-quotation-document"
        sx={{
          width: '100%',
          maxWidth: 980,
          mx: 'auto',
          p: { xs: 2, md: 4 },
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left'
        }}
      >
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h2">Megawatt</Typography>
              <Typography variant="body2" color="text.secondary">{t('print.companyTagline')}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>{t('print.cairoEgypt')}</Typography>
              <Typography variant="body2">{t('print.phone')}: +20 2 0000 0000</Typography>
              <Typography variant="body2">{t('print.taxRegistration')}: EG-000-000-000</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                <Typography variant="h2">{t('quotation.priceOffer')}</Typography>
                <Chip label={t(`quotation.status.${quotation.status}`)} color="primary" variant="outlined" />
                <Typography variant="body2">{t('quotation.quotationNumber')}: {quotation.quotationNumber}</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MainCard title={t('print.customerDetails')} border elevation={0}>
                <Typography variant="subtitle1">{translatePartyName(language, customer?.companyName)}</Typography>
                <Typography variant="body2" color="text.secondary">{customer?.name}</Typography>
                <Typography variant="body2">{customer?.phone}</Typography>
                <Typography variant="body2">{customer?.address}, {customer?.city}</Typography>
                {customer?.taxRegistrationNumber && <Typography variant="body2">{t('print.taxRegistration')}: {customer.taxRegistrationNumber}</Typography>}
              </MainCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MainCard title={t('quotation.details')} border elevation={0}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{t('quotation.quotationDate')}</Typography>
                    <Typography>{formatDate(quotation.quotationDate)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{t('quotation.validUntil')}</Typography>
                    <Typography>{formatDate(quotation.validUntil)}</Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
          </Grid>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('invoice.sku')}</TableCell>
                  <TableCell>{t('invoice.product')}</TableCell>
                  <TableCell>{t('common.unit')}</TableCell>
                  <TableCell align="right">{t('common.quantity')}</TableCell>
                  <TableCell align="right">{t('invoice.unitPrice')}</TableCell>
                  <TableCell align="right">{t('invoice.discount')}</TableCell>
                  <TableCell align="right">{t('invoice.vat')}</TableCell>
                  <TableCell align="right">{t('invoice.lineTotal')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotation.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>{line.sku}</TableCell>
                    <TableCell>{translateProductName(language, line.productName)}</TableCell>
                    <TableCell>{translateUnit(language, line.unit)}</TableCell>
                    <TableCell align="right">{line.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(line.unitPrice)}</TableCell>
                    <TableCell align="right">{formatCurrency(line.discount)}</TableCell>
                    <TableCell align="right">{line.taxRate}%</TableCell>
                    <TableCell align="right">{formatCurrency(line.lineTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1}>
                {[
                  [t('invoice.subtotalBeforeVat'), formatCurrency(quotation.subtotal)],
                  [t('print.discounts'), formatCurrency(quotation.discountTotal)],
                  [t('invoice.vatAmount'), formatCurrency(quotation.vatTotal)]
                ].map(([label, value]) => (
                  <Stack key={label} direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{label}</Typography>
                    <Typography>{value}</Typography>
                  </Stack>
                ))}
                <Stack direction="row" justifyContent="space-between" sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
                  <Typography variant="h4">{t('invoice.grandTotal')}</Typography>
                  <Typography variant="h4">{formatCurrency(quotation.grandTotal)}</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5">{t('quotation.terms')}</Typography>
              <Typography variant="body2" color="text.secondary">{quotation.terms}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5">{t('quotation.notes')}</Typography>
              <Typography variant="body2" color="text.secondary">{quotation.notes}</Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </ErpFullWidthPage>
  );
};
