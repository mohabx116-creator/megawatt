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
import {
  calculateQuotationTotals,
  calculateSalesDocumentLine,
  clampNumber,
  GeneratedQuotationSnapshot,
  QuotationStatus,
  SalesDocumentLineInput,
  saveGeneratedQuotation,
  validateSalesDocument
} from '../../sales-documents';
import { translateCategory, translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

type QuotationLineForm = SalesDocumentLineInput;

const today = new Date().toISOString().slice(0, 10);

const getDefaultValidUntil = () => {
  const date = new Date(today);
  date.setDate(date.getDate() + 15);
  return date.toISOString().slice(0, 10);
};

const createEmptyLine = (): QuotationLineForm => ({
  id: crypto.randomUUID(),
  productId: '',
  sku: '',
  productName: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  taxRate: 14
});

export const MobileCreateQuotation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency } = useLanguage();
  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [quotationDate, setQuotationDate] = useState(today);
  const [validUntil, setValidUntil] = useState(getDefaultValidUntil());
  const [status, setStatus] = useState<QuotationStatus>('draft');
  const [terms, setTerms] = useState(t('quotation.defaultTerms'));
  const [notes, setNotes] = useState(t('quotation.defaultNotes'));
  const [documentDiscount, setDocumentDiscount] = useState(0);
  const [lineItems, setLineItems] = useState<QuotationLineForm[]>([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [draftLine, setDraftLine] = useState<QuotationLineForm>(createEmptyLine());
  const [error, setError] = useState('');
  const [generatedQuotationNumber, setGeneratedQuotationNumber] = useState('');

  const selectedCustomer = mockCustomers.find((customer) => customer.id === customerId);
  const calculatedLines = useMemo(() => lineItems.map(calculateSalesDocumentLine), [lineItems]);
  const totals = useMemo(() => calculateQuotationTotals(calculatedLines, documentDiscount), [calculatedLines, documentDiscount]);
  const draftCalculatedLine = useMemo(() => calculateSalesDocumentLine(draftLine), [draftLine]);

  const stepLabels = [t('common.info'), t('common.review'), t('common.finalize')];

  const handleDraftProductChange = (productId: string) => {
    const product = mockProducts.find((candidate) => candidate.id === productId);
    setDraftLine((current) => ({
      ...current,
      productId,
      sku: product?.sku ?? '',
      productName: product?.name ?? '',
      unit: product?.unit ?? '',
      unitPrice: product?.salePrice ?? 0,
      taxRate: product?.taxRate ?? 14
    }));
  };

  const resetGeneratedState = () => {
    setGeneratedQuotationNumber('');
    setError('');
  };

  const addLine = () => {
    const safeLine = calculateSalesDocumentLine(draftLine);
    if (!safeLine.productId || safeLine.quantity <= 0) {
      setError(t('quotation.lineRequired'));
      return;
    }

    setLineItems((current) => [
      ...current,
      {
        ...draftLine,
        quantity: safeLine.quantity,
        unitPrice: safeLine.unitPrice,
        discount: safeLine.discount,
        taxRate: safeLine.taxRate
      }
    ]);
    setDraftLine(createEmptyLine());
    setAddItemOpen(false);
    setStep(1);
    resetGeneratedState();
  };

  const removeLine = (lineId: string) => {
    setLineItems((current) => current.filter((line) => line.id !== lineId));
    resetGeneratedState();
  };

  const resetForm = () => {
    setStep(0);
    setCustomerId('');
    setQuotationDate(today);
    setValidUntil(getDefaultValidUntil());
    setStatus('draft');
    setTerms(t('quotation.defaultTerms'));
    setNotes(t('quotation.defaultNotes'));
    setDocumentDiscount(0);
    setLineItems([]);
    setDraftLine(createEmptyLine());
    setAddItemOpen(false);
    setError('');
    setGeneratedQuotationNumber('');
  };

  const generateQuotation = () => {
    const validation = validateSalesDocument(customerId, calculatedLines);
    if (!validation.valid) {
      setError(validation.errors.customerId ? t(validation.errors.customerId) : t(validation.errors.lines ?? 'quotation.lineRequired'));
      setStep(validation.errors.customerId ? 0 : 1);
      return;
    }
    if (!selectedCustomer) return;

    const quotationNumber = `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const now = new Date().toISOString();
    const snapshot: GeneratedQuotationSnapshot = {
      documentType: 'quotation',
      id: `QUOTE-${Date.now()}`,
      quotationNumber,
      customerId: selectedCustomer.id,
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        companyName: selectedCustomer.companyName,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
        city: selectedCustomer.city,
        taxRegistrationNumber: selectedCustomer.taxRegistrationNumber
      },
      quotationDate,
      validUntil,
      status,
      lines: calculatedLines.filter((line) => line.productId),
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      documentDiscount: totals.documentDiscount,
      vatTotal: totals.vatTotal,
      grandTotal: totals.grandTotal,
      terms,
      notes,
      createdAt: now,
      updatedAt: now
    };

    saveGeneratedQuotation(snapshot);
    setGeneratedQuotationNumber(quotationNumber);
    setError('');
    setStep(2);
  };

  return (
    <MobileShell
      title={t('quotation.createTitle')}
      showBottomNav={false}
      action={
        <IconButton size="small" onClick={() => navigate('/erp/dashboard')} aria-label={t('common.back')}>
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
            {t('quotation.details')}
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('invoice.customer')}</InputLabel>
              <Select
                label={t('invoice.customer')}
                value={customerId}
                onChange={(event) => {
                  setCustomerId(event.target.value);
                  resetGeneratedState();
                }}
              >
                {mockCustomers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {translatePartyName(language, customer.companyName)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.25}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label={t('quotation.quotationDate')}
                value={quotationDate}
                onChange={(event) => {
                  setQuotationDate(event.target.value);
                  resetGeneratedState();
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                size="small"
                type="date"
                label={t('quotation.validUntil')}
                value={validUntil}
                onChange={(event) => {
                  setValidUntil(event.target.value);
                  resetGeneratedState();
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel>{t('common.status')}</InputLabel>
              <Select label={t('common.status')} value={status} onChange={(event) => setStatus(event.target.value as QuotationStatus)}>
                {['draft', 'sent', 'accepted', 'rejected', 'expired'].map((item) => (
                  <MenuItem key={item} value={item}>
                    {t(`quotation.status.${item}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </MobileSurface>

        <Box>
          <MobileSectionTitle title={`${t('invoice.lineItems')} (${lineItems.length})`} />
          <Stack spacing={1.5}>
            {lineItems.map((line) => {
              const totalsLine = calculatedLines.find((candidate) => candidate.id === line.id);
              return (
                <MobileSurface key={line.id}>
                  <Stack direction="row" spacing={1.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap>
                          {translateProductName(language, line.productName)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.primary.main, flex: '0 0 auto' }}>
                          {formatCurrency(totalsLine?.lineTotal ?? 0)}
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
                    <IconButton color="error" onClick={() => removeLine(line.id)} aria-label={t('common.remove')}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Stack>
                </MobileSurface>
              );
            })}
            <Button
              variant="outlined"
              startIcon={<AddOutlinedIcon />}
              onClick={() => setAddItemOpen(true)}
              sx={{ borderStyle: 'dashed', borderWidth: 2, borderRadius: 3, py: 1.4 }}
            >
              {t('invoice.addLine')}
            </Button>
          </Stack>
        </Box>

        <MobileSurface sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
          <MobileSectionTitle title={t('invoice.summary')} />
          <Stack spacing={1}>
            {[
              [t('invoice.subtotalBeforeVat'), formatCurrency(totals.subtotal)],
              [t('invoice.lineDiscounts'), formatCurrency(totals.discountTotal - totals.documentDiscount)],
              [t('quotation.documentDiscount'), formatCurrency(totals.documentDiscount)],
              [t('invoice.vatAmount'), formatCurrency(totals.vatTotal)]
            ].map(([label, value]) => (
              <Stack key={label} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Stack>
            ))}
            <TextField
              size="small"
              type="number"
              label={t('quotation.documentDiscount')}
              value={documentDiscount}
              onChange={(event) => {
                setDocumentDiscount(clampNumber(Number(event.target.value)));
                resetGeneratedState();
              }}
              inputProps={{ min: 0 }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                {t('invoice.grandTotal')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                {formatCurrency(totals.grandTotal)}
              </Typography>
            </Stack>
          </Stack>
        </MobileSurface>

        <MobileSurface>
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label={t('quotation.terms')}
              value={terms}
              onChange={(event) => setTerms(event.target.value)}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label={t('quotation.notes')}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Stack>
        </MobileSurface>

        <Stack spacing={1.25}>
          <Button variant="contained" size="large" startIcon={<SendOutlinedIcon />} onClick={generateQuotation} sx={{ borderRadius: 999, py: 1.25, fontWeight: 900 }}>
            {t('quotation.generate')}
          </Button>
          <Button variant="outlined" onClick={resetForm} sx={{ borderRadius: 999, py: 1.1, fontWeight: 800 }}>
            {t('common.reset')}
          </Button>
          {generatedQuotationNumber && (
            <Alert
              severity="success"
              action={
                <Button color="inherit" size="small" startIcon={<PrintOutlinedIcon />} onClick={() => navigate('/erp/print-preview?type=quotation')}>
                  {t('quotation.viewPreview')}
                </Button>
              }
            >
              {t('quotation.generatedSuccess', { quotation: generatedQuotationNumber })}
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
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{translateProductName(language, product.name)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.sku} · {translateCategory(language, product.category)}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1.25}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label={t('common.quantity')}
                value={draftLine.quantity}
                onChange={(event) => setDraftLine((current) => ({ ...current, quantity: clampNumber(Number(event.target.value), 1) }))}
                inputProps={{ min: 1 }}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label={t('invoice.discount')}
                value={draftLine.discount}
                onChange={(event) => setDraftLine((current) => ({ ...current, discount: clampNumber(Number(event.target.value)) }))}
                inputProps={{ min: 0 }}
              />
            </Stack>
            <Stack direction="row" spacing={1.25}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label={t('invoice.unitPrice')}
                value={draftLine.unitPrice}
                onChange={(event) => setDraftLine((current) => ({ ...current, unitPrice: clampNumber(Number(event.target.value)) }))}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label={t('invoice.vat')}
                value={draftLine.taxRate}
                onChange={(event) => setDraftLine((current) => ({ ...current, taxRate: clampNumber(Number(event.target.value)) }))}
                inputProps={{ min: 0 }}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">{t('invoice.lineTotal')}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(draftCalculatedLine.lineTotal)}</Typography>
            </Stack>
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
