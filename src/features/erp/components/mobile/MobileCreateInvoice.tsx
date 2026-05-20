import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { mockCustomers, mockProducts } from '../../mockData';
import { translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

type PaymentTerms = 'cash' | 'visa' | '7' | '15' | '30';

type InvoiceLineForm = {
  id: string;
  productId: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
};

const generatedInvoiceStorageKey = 'megawatt:last-generated-invoice';
const today = new Date().toISOString().slice(0, 10);

const clampNumber = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const createEmptyLine = (): InvoiceLineForm => ({
  id: crypto.randomUUID(),
  productId: '',
  sku: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  taxRate: 14
});

const getDueDate = (invoiceDate: string, terms: PaymentTerms) => {
  const date = new Date(invoiceDate);
  if (Number.isNaN(date.getTime())) return invoiceDate;

  date.setDate(date.getDate() + (terms === 'cash' || terms === 'visa' ? 0 : Number(terms)));
  return date.toISOString().slice(0, 10);
};

export const MobileCreateInvoice = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatStatus } = useLanguage();
  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('cash');
  const [dueDate, setDueDate] = useState(getDueDate(today, 'cash'));
  const [lineItems, setLineItems] = useState<InvoiceLineForm[]>([]);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [draftLine, setDraftLine] = useState<InvoiceLineForm>(createEmptyLine());
  const [error, setError] = useState('');
  const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState('');

  const selectedCustomer = mockCustomers.find((customer) => customer.id === customerId);

  const lineTotals = useMemo(
    () =>
      lineItems.map((line) => {
        const grossAmount = clampNumber(line.quantity) * clampNumber(line.unitPrice);
        const discount = clampNumber(line.discount, 0, grossAmount);
        const taxableAmount = grossAmount - discount;
        const vatAmount = taxableAmount * (clampNumber(line.taxRate) / 100);

        return { id: line.id, grossAmount, discount, taxableAmount, vatAmount, total: taxableAmount + vatAmount };
      }),
    [lineItems]
  );

  const invoiceTotals = useMemo(() => {
    const subtotal = lineTotals.reduce((sum, line) => sum + line.grossAmount, 0);
    const lineDiscountTotal = lineTotals.reduce((sum, line) => sum + line.discount, 0);
    const taxableBeforeInvoiceDiscount = lineTotals.reduce((sum, line) => sum + line.taxableAmount, 0);
    const invoiceLevelDiscount = clampNumber(invoiceDiscount, 0, taxableBeforeInvoiceDiscount);
    const vatBeforeInvoiceDiscount = lineTotals.reduce((sum, line) => sum + line.vatAmount, 0);
    const effectiveTaxRate = taxableBeforeInvoiceDiscount > 0 ? vatBeforeInvoiceDiscount / taxableBeforeInvoiceDiscount : 0;
    const taxableAfterInvoiceDiscount = Math.max(taxableBeforeInvoiceDiscount - invoiceLevelDiscount, 0);
    const vatAmount = taxableAfterInvoiceDiscount * effectiveTaxRate;
    const grandTotal = taxableAfterInvoiceDiscount + vatAmount;
    const safePaidAmount = clampNumber(paidAmount, 0, grandTotal);
    const balanceDue = Math.max(grandTotal - safePaidAmount, 0);

    return { subtotal, lineDiscountTotal, invoiceLevelDiscount, vatAmount, grandTotal, safePaidAmount, balanceDue };
  }, [invoiceDiscount, lineTotals, paidAmount]);

  const paymentStatus =
    invoiceTotals.grandTotal > 0 && invoiceTotals.safePaidAmount >= invoiceTotals.grandTotal
      ? 'paid'
      : invoiceTotals.safePaidAmount > 0
        ? 'partially_paid'
        : 'unpaid';

  const handleTermsChange = (terms: PaymentTerms) => {
    setPaymentTerms(terms);
    setDueDate(getDueDate(invoiceDate, terms));
    setGeneratedInvoiceNumber('');
  };

  const handleInvoiceDateChange = (value: string) => {
    setInvoiceDate(value);
    setDueDate(getDueDate(value, paymentTerms));
    setGeneratedInvoiceNumber('');
  };

  const handleDraftProductChange = (productId: string) => {
    const product = mockProducts.find((candidate) => candidate.id === productId);
    setDraftLine((current) => ({
      ...current,
      productId,
      sku: product?.sku ?? '',
      unit: product?.unit ?? '',
      unitPrice: product?.salePrice ?? 0,
      taxRate: product?.taxRate ?? 14
    }));
  };

  const addLine = () => {
    if (!draftLine.productId || draftLine.quantity <= 0) {
      setError(t('invoice.lineRequired'));
      return;
    }
    setLineItems((current) => [...current, { ...draftLine, discount: clampNumber(draftLine.discount, 0, draftLine.quantity * draftLine.unitPrice) }]);
    setDraftLine(createEmptyLine());
    setAddItemOpen(false);
    setError('');
    setGeneratedInvoiceNumber('');
    setStep(1);
  };

  const removeLine = (lineId: string) => {
    setLineItems((current) => current.filter((line) => line.id !== lineId));
    setGeneratedInvoiceNumber('');
  };

  const generateInvoice = () => {
    if (!selectedCustomer) {
      setError(t('invoice.customerRequired'));
      setStep(0);
      return;
    }
    if (lineItems.length === 0 || lineItems.every((line) => !line.productId || line.quantity <= 0)) {
      setError(t('invoice.lineRequired'));
      setStep(1);
      return;
    }

    const invoiceNumber = `DRAFT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const snapshot = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      paymentTerms,
      paymentStatus,
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        companyName: selectedCustomer.companyName,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
        city: selectedCustomer.city,
        taxRegistrationNumber: selectedCustomer.taxRegistrationNumber
      },
      lines: lineItems.map((line) => {
        const product = mockProducts.find((candidate) => candidate.id === line.productId);
        const totals = lineTotals.find((lineTotal) => lineTotal.id === line.id);

        return {
          id: line.id,
          productId: line.productId,
          productName: product?.name ?? 'Unknown product',
          sku: line.sku,
          unit: line.unit,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          discount: line.discount,
          taxRate: line.taxRate,
          taxAmount: totals?.vatAmount ?? 0,
          lineTotal: totals?.total ?? 0
        };
      }),
      totals: {
        subtotal: invoiceTotals.subtotal,
        lineDiscountTotal: invoiceTotals.lineDiscountTotal,
        invoiceDiscount: invoiceTotals.invoiceLevelDiscount,
        vatAmount: invoiceTotals.vatAmount,
        grandTotal: invoiceTotals.grandTotal,
        paidAmount: invoiceTotals.safePaidAmount,
        balanceDue: invoiceTotals.balanceDue
      }
    };

    localStorage.setItem(generatedInvoiceStorageKey, JSON.stringify(snapshot));
    setGeneratedInvoiceNumber(invoiceNumber);
    setError('');
    setStep(2);
  };

  const stepLabels = [t('common.info'), t('common.review'), t('common.finalize')];

  return (
    <MobileShell
      title={t('invoice.title')}
      showBottomNav={false}
      action={
        <IconButton size="small" onClick={() => navigate('/erp/dashboard')}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" sx={{ px: 0.5 }}>
          {stepLabels.map((label, index) => (
            <Stack key={label} direction="row" alignItems="center" sx={{ flex: index === stepLabels.length - 1 ? '0 0 auto' : 1 }}>
              <Stack alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: index <= step ? theme.palette.primary.main : theme.palette.grey[200],
                    color: index <= step ? theme.palette.primary.contrastText : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="caption" sx={{ color: index <= step ? theme.palette.primary.main : 'text.secondary', fontWeight: 800 }}>
                  {label}
                </Typography>
              </Stack>
              {index < stepLabels.length - 1 && <Box sx={{ flex: 1, height: 1, bgcolor: theme.palette.divider, mx: 1, mb: 2.5 }} />}
            </Stack>
          ))}
        </Stack>

        {error && <Alert severity="warning" variant="outlined">{error}</Alert>}

        <MobileSurface>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
            {t('invoice.customerDetails')}
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('invoice.customer')}</InputLabel>
              <Select label={t('invoice.customer')} value={customerId} onChange={(event) => { setCustomerId(event.target.value); setGeneratedInvoiceNumber(''); }}>
                {mockCustomers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {translatePartyName(language, customer.companyName)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.25}>
              <TextField fullWidth size="small" type="date" label={t('invoice.invoiceDate')} value={invoiceDate} onChange={(event) => handleInvoiceDateChange(event.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth size="small" type="date" label={t('invoice.dueDate')} value={dueDate} onChange={(event) => { setDueDate(event.target.value); setGeneratedInvoiceNumber(''); }} InputLabelProps={{ shrink: true }} />
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel>{t('invoice.paymentTerms')}</InputLabel>
              <Select label={t('invoice.paymentTerms')} value={paymentTerms} onChange={(event) => handleTermsChange(event.target.value as PaymentTerms)}>
                <MenuItem value="cash">{t('invoice.cash')}</MenuItem>
                <MenuItem value="visa">{t('invoice.visa')}</MenuItem>
                <MenuItem value="7">{t('invoice.days', { days: 7 })}</MenuItem>
                <MenuItem value="15">{t('invoice.days', { days: 15 })}</MenuItem>
                <MenuItem value="30">{t('invoice.days', { days: 30 })}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </MobileSurface>

        <Box>
          <MobileSectionTitle title={`${t('invoice.lineItems')} (${lineItems.length})`} />
          <Stack spacing={1.5}>
            {lineItems.map((line) => {
              const product = mockProducts.find((candidate) => candidate.id === line.productId);
              const totals = lineTotals.find((lineTotal) => lineTotal.id === line.id);

              return (
                <MobileSurface key={line.id}>
                  <Stack direction="row" spacing={1.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap>
                          {translateProductName(language, product?.name)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.primary.main, flex: '0 0 auto' }}>
                          {formatCurrency(totals?.total ?? 0)}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {line.sku} · {line.quantity} {translateUnit(language, line.unit)}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('invoice.discount')}: {formatCurrency(line.discount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('invoice.vat')}: {line.taxRate}%
                        </Typography>
                      </Stack>
                    </Box>
                    <IconButton color="error" onClick={() => removeLine(line.id)}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Stack>
                </MobileSurface>
              );
            })}
            <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={() => setAddItemOpen(true)} sx={{ borderStyle: 'dashed', borderWidth: 2, borderRadius: 3, py: 1.4 }}>
              {t('invoice.addLine')}
            </Button>
          </Stack>
        </Box>

        <MobileSurface sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
          <MobileSectionTitle title={t('invoice.summary')} />
          <Stack spacing={1}>
            {[
              [t('invoice.subtotalBeforeVat'), formatCurrency(invoiceTotals.subtotal)],
              [t('invoice.lineDiscounts'), formatCurrency(invoiceTotals.lineDiscountTotal)],
              [t('invoice.invoiceDiscount'), formatCurrency(invoiceTotals.invoiceLevelDiscount)],
              [t('invoice.vatAmount'), formatCurrency(invoiceTotals.vatAmount)]
            ].map(([label, value]) => (
              <Stack key={label} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Stack>
            ))}
            <TextField
              size="small"
              type="number"
              label={t('invoice.invoiceDiscount')}
              value={invoiceDiscount}
              onChange={(event) => { setInvoiceDiscount(clampNumber(Number(event.target.value))); setGeneratedInvoiceNumber(''); }}
              inputProps={{ min: 0 }}
            />
            <TextField
              size="small"
              type="number"
              label={t('invoice.paidAmount')}
              value={paidAmount}
              onChange={(event) => { setPaidAmount(clampNumber(Number(event.target.value))); setGeneratedInvoiceNumber(''); }}
              inputProps={{ min: 0 }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>{t('invoice.grandTotal')}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>{formatCurrency(invoiceTotals.grandTotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">{t('invoice.balanceDue')}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(invoiceTotals.balanceDue)}</Typography>
            </Stack>
            <Typography variant="caption" sx={{ fontWeight: 900, color: paymentStatus === 'paid' ? theme.palette.success.main : theme.palette.warning.dark }}>
              {t('invoice.paymentStatus')}: {formatStatus(paymentStatus)}
            </Typography>
          </Stack>
        </MobileSurface>

        <Stack spacing={1.25}>
          <Button variant="contained" size="large" startIcon={<SendOutlinedIcon />} onClick={generateInvoice} sx={{ borderRadius: 999, py: 1.25, fontWeight: 900 }}>
            {t('invoice.generateInvoice')}
          </Button>
          {generatedInvoiceNumber && (
            <Alert
              severity="success"
              action={
                <Button color="inherit" size="small" startIcon={<PrintOutlinedIcon />} onClick={() => navigate('/erp/print-preview?type=invoice')}>
                  {t('invoice.viewPrintPreview')}
                </Button>
              }
            >
              {t('invoice.generatedMessage', {
                invoice: generatedInvoiceNumber,
                customer: translatePartyName(language, selectedCustomer?.companyName),
                total: formatCurrency(invoiceTotals.grandTotal),
                balance: formatCurrency(invoiceTotals.balanceDue)
              })}
            </Alert>
          )}
        </Stack>
      </Stack>

      <Dialog open={addItemOpen} onClose={() => setAddItemOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('invoice.addLine')}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('invoice.product')}</InputLabel>
              <Select label={t('invoice.product')} value={draftLine.productId} onChange={(event) => handleDraftProductChange(event.target.value)}>
                {mockProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {translateProductName(language, product.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.25}>
              <TextField fullWidth size="small" type="number" label={t('common.quantity')} value={draftLine.quantity} onChange={(event) => setDraftLine((current) => ({ ...current, quantity: clampNumber(Number(event.target.value), 1) }))} inputProps={{ min: 1 }} />
              <TextField fullWidth size="small" type="number" label={t('invoice.discount')} value={draftLine.discount} onChange={(event) => setDraftLine((current) => ({ ...current, discount: clampNumber(Number(event.target.value)) }))} inputProps={{ min: 0 }} />
            </Stack>
            <TextField fullWidth size="small" type="number" label={t('invoice.unitPrice')} value={draftLine.unitPrice} onChange={(event) => setDraftLine((current) => ({ ...current, unitPrice: clampNumber(Number(event.target.value)) }))} inputProps={{ min: 0 }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemOpen(false)}>{t('common.close')}</Button>
          <Button variant="contained" onClick={addLine}>{t('invoice.addLine')}</Button>
        </DialogActions>
      </Dialog>
    </MobileShell>
  );
};
