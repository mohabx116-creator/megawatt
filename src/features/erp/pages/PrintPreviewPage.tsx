import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
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
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockCustomers, mockInvoices } from '../mockData';
import { formatDate, formatEgp, formatLabel } from '../utils/formatters';

type PrintableInvoiceLine = {
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

type PrintableInvoice = {
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

const formatPaymentTerms = (value: string) => (value === 'cash' ? 'Cash' : `${value} Days`);

export const PrintPreviewPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [storageVersion, setStorageVersion] = useState(0);

  const storedInvoice = useMemo(() => getStoredInvoice(), [storageVersion]);
  const invoice = useMemo(() => storedInvoice ?? getFallbackInvoice(), [storedInvoice]);
  const totalDiscounts = invoice.totals.lineDiscountTotal + invoice.totals.invoiceDiscount;

  const clearGeneratedInvoice = () => {
    localStorage.removeItem(generatedInvoiceStorageKey);
    setStorageVersion((currentVersion) => currentVersion + 1);
  };

  return (
    <ErpFullWidthPage>
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
            '.megawatt-print-root, .megawatt-print-root *': {
              visibility: 'visible !important'
            },
            '.megawatt-print-root': {
              position: 'absolute !important',
              left: '0 !important',
              top: '0 !important',
              width: '100% !important',
              maxWidth: 'none !important',
              margin: '0 !important',
              padding: '0 !important',
              background: '#fff !important'
            },
            '.megawatt-invoice-document': {
              width: '100% !important',
              maxWidth: '100% !important',
              margin: '0 !important',
              padding: '0 !important',
              border: 'none !important',
              boxShadow: 'none !important',
              background: '#fff !important',
              color: '#000 !important'
            },
            '.megawatt-invoice-document table': {
              width: '100% !important',
              tableLayout: 'auto !important'
            },
            '.megawatt-invoice-document th, .megawatt-invoice-document td': {
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

      <Box>
        <Box className="no-print">
          <ErpPageHeader title="Print Preview" subtitle="Review and print Megawatt sales invoice" />

          <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')}>
                  Back to Create Invoice
                </Button>
              </Stack>
              {storedInvoice && (
                <Button color="error" variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />} onClick={clearGeneratedInvoice}>
                  Clear Generated Invoice
                </Button>
              )}
            </Stack>
          </MainCard>
        </Box>

        <Box
          className="megawatt-print-root megawatt-invoice-document"
          sx={{
            width: '100%',
            maxWidth: 980,
            mx: 'auto',
            p: { xs: 2, md: 4 },
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          <Stack spacing={3}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h2">Megawatt</Typography>
                <Typography variant="body2" color="text.secondary">
                  Industrial Electrical Tools & Factory Supplies
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 2 }}>
                  <Typography variant="body2">Cairo, Egypt</Typography>
                  <Typography variant="body2">Phone: +20 2 0000 0000</Typography>
                  <Typography variant="body2">Tax Registration: EG-000-000-000</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Typography variant="h1" sx={{ color: theme.palette.primary.main }}>
                    TAX INVOICE
                  </Typography>
                  <Chip label={formatLabel(invoice.paymentStatus)} variant="outlined" color={invoice.paymentStatus === 'paid' ? 'success' : invoice.paymentStatus === 'unpaid' ? 'error' : 'warning'} />
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    Customer Details
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {invoice.customer.companyName}
                  </Typography>
                  <Typography variant="body2">{invoice.customer.name}</Typography>
                  {invoice.customer.phone && <Typography variant="body2">Phone: {invoice.customer.phone}</Typography>}
                  {(invoice.customer.address || invoice.customer.city) && (
                    <Typography variant="body2">
                      {[invoice.customer.address, invoice.customer.city].filter(Boolean).join(', ')}
                    </Typography>
                  )}
                  {invoice.customer.taxRegistrationNumber && (
                    <Typography variant="body2">Tax Registration: {invoice.customer.taxRegistrationNumber}</Typography>
                  )}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, backgroundColor: alpha(theme.palette.primary.main, 0.03) }}>
                  {[
                    ['Invoice Number', invoice.invoiceNumber],
                    ['Invoice Date', formatDate(invoice.invoiceDate)],
                    ['Due Date', formatDate(invoice.dueDate)],
                    ['Payment Terms', formatPaymentTerms(invoice.paymentTerms)],
                    ['Payment Status', formatLabel(invoice.paymentStatus)]
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
                    <TableCell>SKU</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">VAT</TableCell>
                    <TableCell align="right">Line Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{line.sku}</TableCell>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell>{line.unit}</TableCell>
                      <TableCell align="right">{line.quantity}</TableCell>
                      <TableCell align="right">{formatEgp(line.unitPrice)}</TableCell>
                      <TableCell align="right">{formatEgp(line.discount)}</TableCell>
                      <TableCell align="right">
                        {line.taxRate}% ({formatEgp(line.taxAmount)})
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatEgp(line.lineTotal)}
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
                    ['Subtotal before VAT', invoice.totals.subtotal],
                    ['Discounts', -totalDiscounts],
                    ['VAT amount', invoice.totals.vatAmount],
                    ['Grand total', invoice.totals.grandTotal],
                    ['Paid amount', invoice.totals.paidAmount],
                    ['Balance due', invoice.totals.balanceDue]
                  ].map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      sx={label === 'Grand total' ? { pt: 1, borderTop: `1px solid ${theme.palette.divider}` } : undefined}
                    >
                      <Typography variant={label === 'Grand total' ? 'h4' : 'body2'}>{label}</Typography>
                      <Typography variant={label === 'Grand total' ? 'h4' : 'body2'} sx={{ fontWeight: 700 }}>
                        {formatEgp(value as number)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {invoice.notes ?? 'Sold goods are subject to Megawatt warranty and return policies. Please reference the invoice number when making payment.'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Thank you for choosing Megawatt.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ pt: 6, borderBottom: `1px solid ${theme.palette.text.primary}` }} />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Authorized Signature
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
    </ErpFullWidthPage>
  );
};
