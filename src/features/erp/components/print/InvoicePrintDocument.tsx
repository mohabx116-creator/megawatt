import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';
import { translateExpenseDescription, translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';

export type PrintableInvoiceLine = {
  id: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
};

export type PrintableInvoice = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  paymentStatus: string;
  customer: {
    name: string;
    companyName: string;
    phone?: string;
    address?: string;
    city?: string;
    taxRegistrationNumber?: string;
  };
  lines: PrintableInvoiceLine[];
  totals: {
    subtotal: number;
    lineDiscountTotal: number;
    invoiceDiscount: number;
    vatAmount: number;
    grandTotal: number;
    paidAmount: number;
    balanceDue: number;
  };
  notes?: string;
};

interface InvoicePrintDocumentProps {
  invoice: PrintableInvoice;
}

export const InvoicePrintDocument = ({ invoice }: InvoicePrintDocumentProps) => {
  const theme = useTheme();
  const { t, language, isRtl, formatCurrency, formatDate, formatStatus } = useLanguage();

  const totalDiscounts = invoice.totals.lineDiscountTotal + invoice.totals.invoiceDiscount;

  const formatPaymentTerms = (value: string) => {
    if (value === 'cash') return t('invoice.cash');
    if (value === 'visa') return t('invoice.visa');
    return t('invoice.days', { days: value });
  };

  return (
    <Box
      className="megawatt-invoice-print-root megawatt-invoice-document"
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
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2">Megawatt</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('print.companyTagline')}
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 2 }}>
              <Typography variant="body2">{t('print.cairoEgypt')}</Typography>
              <Typography variant="body2">{t('print.phone')}: +20 2 0000 0000</Typography>
              <Typography variant="body2">{t('print.taxRegistration')}: EG-000-000-000</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography variant="h1" sx={{ color: theme.palette.primary.main }}>
                {t('print.taxInvoice')}
              </Typography>
              <Chip label={formatStatus(invoice.paymentStatus)} variant="outlined" color={invoice.paymentStatus === 'paid' ? 'success' : invoice.paymentStatus === 'unpaid' ? 'error' : 'warning'} />
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {t('print.customerDetails')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translatePartyName(language, invoice.customer.companyName)}
              </Typography>
              <Typography variant="body2">{translatePartyName(language, invoice.customer.name)}</Typography>
              {invoice.customer.phone && <Typography variant="body2">{t('print.phone')}: {invoice.customer.phone}</Typography>}
              {(invoice.customer.address || invoice.customer.city) && (
                <Typography variant="body2">
                  {[invoice.customer.address, invoice.customer.city].filter(Boolean).join(', ')}
                </Typography>
              )}
              {invoice.customer.taxRegistrationNumber && (
                <Typography variant="body2">{t('print.taxRegistration')}: {invoice.customer.taxRegistrationNumber}</Typography>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, backgroundColor: alpha(theme.palette.primary.main, 0.03) }}>
              {[
                [t('print.invoiceNumber'), invoice.invoiceNumber],
                [t('invoice.invoiceDate'), formatDate(invoice.invoiceDate)],
                [t('invoice.dueDate'), formatDate(invoice.dueDate)],
                [t('invoice.paymentTerms'), formatPaymentTerms(invoice.paymentTerms)],
                [t('invoice.paymentStatus'), formatStatus(invoice.paymentStatus)]
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                    {value}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Grid>
        </Grid>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto', border: `1px solid ${theme.palette.divider}` }}>
          <Table size="small" aria-label="print invoice line items">
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.07) }}>
                <TableCell>{t('inventory.sku')}</TableCell>
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
              {invoice.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{line.sku}</TableCell>
                  <TableCell>{translateProductName(language, line.productName)}</TableCell>
                  <TableCell>{translateUnit(language, line.unit)}</TableCell>
                  <TableCell align="right">{line.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(line.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(line.discount)}</TableCell>
                  <TableCell align="right">
                    {line.taxRate}% ({formatCurrency(line.taxAmount)})
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatCurrency(line.lineTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1.25} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
              {[
                ['subtotal', t('invoice.subtotalBeforeVat'), invoice.totals.subtotal],
                ['discounts', t('print.discounts'), -totalDiscounts],
                ['vat', t('invoice.vatAmount'), invoice.totals.vatAmount],
                ['grand', t('invoice.grandTotal'), invoice.totals.grandTotal],
                ['paid', t('invoice.paidAmount'), invoice.totals.paidAmount],
                ['balance', t('invoice.balanceDue'), invoice.totals.balanceDue]
              ].map(([key, label, value]) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={key === 'grand' ? { pt: 1, borderTop: `1px solid ${theme.palette.divider}` } : undefined}
                >
                  <Typography variant={key === 'grand' ? 'h4' : 'body2'}>{label}</Typography>
                  <Typography variant={key === 'grand' ? 'h4' : 'body2'} sx={{ fontWeight: 700 }}>
                    {formatCurrency(value as number)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ pt: 2 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {t('print.notes')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.notes ? translateExpenseDescription(language, invoice.notes) : t('print.defaultNotes')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {t('print.thankYou')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ pt: 6, borderBottom: `1px solid ${theme.palette.text.primary}` }} />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {t('print.authorizedSignature')}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};
