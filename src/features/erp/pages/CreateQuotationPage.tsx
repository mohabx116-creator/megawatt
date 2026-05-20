import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { MobileCreateQuotation } from '../components/mobile';
import { mockCustomers, mockProducts } from '../mockData';
import { Product } from '../types';
import {
  calculateQuotationTotals,
  calculateSalesDocumentLine,
  clampNumber,
  GeneratedQuotationSnapshot,
  QuotationStatus,
  SalesDocumentLineInput,
  saveGeneratedQuotation,
  validateSalesDocument
} from '../sales-documents';
import { translateCategory, translatePartyName, translateProductName, translateUnit } from '../utils/displayTranslations';

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

const compactLineCellSx = { px: 0.75, py: 0.75, fontSize: 12 };

export const CreateQuotationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t, language, formatCurrency } = useLanguage();
  const currencyAdornment = language === 'ar' ? 'جنيه' : 'EGP';
  const [customerId, setCustomerId] = useState('');
  const [quotationDate, setQuotationDate] = useState(today);
  const [validUntil, setValidUntil] = useState(getDefaultValidUntil());
  const [status, setStatus] = useState<QuotationStatus>('draft');
  const [terms, setTerms] = useState(t('quotation.defaultTerms'));
  const [notes, setNotes] = useState(t('quotation.defaultNotes'));
  const [documentDiscount, setDocumentDiscount] = useState(0);
  const [lineItems, setLineItems] = useState<QuotationLineForm[]>([createEmptyLine()]);
  const [generatedQuotationNumber, setGeneratedQuotationNumber] = useState('');
  const [errors, setErrors] = useState<{ customerId?: string; lines?: string }>({});

  const selectedCustomer = mockCustomers.find((customer) => customer.id === customerId);
  const calculatedLines = useMemo(() => lineItems.map(calculateSalesDocumentLine), [lineItems]);
  const totals = useMemo(() => calculateQuotationTotals(calculatedLines, documentDiscount), [calculatedLines, documentDiscount]);

  if (isMobile) {
    return <MobileCreateQuotation />;
  }

  const updateLine = (lineId: string, updates: Partial<QuotationLineForm>) => {
    setGeneratedQuotationNumber('');
    setLineItems((currentLines) => currentLines.map((line) => (line.id === lineId ? { ...line, ...updates } : line)));
  };

  const handleProductChange = (lineId: string, productId: string) => {
    const product = mockProducts.find((candidate) => candidate.id === productId);
    updateLine(lineId, {
      productId,
      sku: product?.sku ?? '',
      productName: product?.name ?? '',
      unit: product?.unit ?? '',
      unitPrice: product?.salePrice ?? 0,
      taxRate: product?.taxRate ?? 14
    });
  };

  const resetForm = () => {
    setCustomerId('');
    setQuotationDate(today);
    setValidUntil(getDefaultValidUntil());
    setStatus('draft');
    setTerms(t('quotation.defaultTerms'));
    setNotes(t('quotation.defaultNotes'));
    setDocumentDiscount(0);
    setLineItems([createEmptyLine()]);
    setGeneratedQuotationNumber('');
    setErrors({});
  };

  const generateQuotation = () => {
    const validation = validateSalesDocument(customerId, calculatedLines);
    if (!validation.valid) {
      setErrors({
        customerId: validation.errors.customerId ? t(validation.errors.customerId) : undefined,
        lines: validation.errors.lines ? t(validation.errors.lines) : undefined
      });
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
    setErrors({});
  };

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('quotation.createTitle')} subtitle={t('quotation.createSubtitle')} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <MainCard title={t('quotation.details')} border elevation={0}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth error={Boolean(errors.customerId)}>
                    <InputLabel>{t('invoice.customer')}</InputLabel>
                    <Select
                      label={t('invoice.customer')}
                      value={customerId}
                      onChange={(event: SelectChangeEvent) => {
                        setCustomerId(event.target.value);
                        setGeneratedQuotationNumber('');
                      }}
                    >
                      {mockCustomers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {translatePartyName(language, customer.companyName)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.customerId && (
                    <Typography variant="caption" color="error">
                      {errors.customerId}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('quotation.quotationDate')}
                    value={quotationDate}
                    onChange={(event) => {
                      setQuotationDate(event.target.value);
                      setGeneratedQuotationNumber('');
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('quotation.validUntil')}
                    value={validUntil}
                    onChange={(event) => {
                      setValidUntil(event.target.value);
                      setGeneratedQuotationNumber('');
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>{t('common.status')}</InputLabel>
                    <Select label={t('common.status')} value={status} onChange={(event) => setStatus(event.target.value as QuotationStatus)}>
                      {['draft', 'sent', 'accepted', 'rejected', 'expired'].map((item) => (
                        <MenuItem key={item} value={item}>
                          {t(`quotation.status.${item}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline minRows={2} label={t('quotation.terms')} value={terms} onChange={(event) => setTerms(event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline minRows={2} label={t('quotation.notes')} value={notes} onChange={(event) => setNotes(event.target.value)} />
                </Grid>
              </Grid>
            </MainCard>

            <MainCard
              title={t('invoice.lineItems')}
              border
              elevation={0}
              secondary={
                <Button size="small" startIcon={<AddOutlinedIcon />} onClick={() => setLineItems((currentLines) => [...currentLines, createEmptyLine()])}>
                  {t('invoice.addLine')}
                </Button>
              }
            >
              {errors.lines && (
                <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                  {errors.lines}
                </Alert>
              )}
              <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 980 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...compactLineCellSx, minWidth: 230 }}>{t('invoice.product')}</TableCell>
                      <TableCell sx={compactLineCellSx}>{t('invoice.sku')}</TableCell>
                      <TableCell sx={compactLineCellSx}>{t('common.unit')}</TableCell>
                      <TableCell align="right" sx={compactLineCellSx}>{t('common.quantity')}</TableCell>
                      <TableCell align="right" sx={compactLineCellSx}>{t('invoice.unitPrice')}</TableCell>
                      <TableCell align="right" sx={compactLineCellSx}>{t('invoice.discount')}</TableCell>
                      <TableCell align="right" sx={compactLineCellSx}>{t('invoice.vat')}</TableCell>
                      <TableCell align="right" sx={compactLineCellSx}>{t('invoice.lineTotal')}</TableCell>
                      <TableCell align="center" sx={compactLineCellSx} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((line) => {
                      const totalsLine = calculatedLines.find((candidate) => candidate.id === line.id);
                      return (
                        <TableRow key={line.id}>
                          <TableCell sx={compactLineCellSx}>
                            <FormControl fullWidth size="small">
                              <Select value={line.productId} displayEmpty onChange={(event) => handleProductChange(line.id, event.target.value)}>
                                <MenuItem value="">{t('invoice.product')}</MenuItem>
                                {mockProducts.map((product: Product) => (
                                  <MenuItem key={product.id} value={product.id}>
                                    {translateProductName(language, product.name)}
                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      {translateCategory(language, product.category)}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={compactLineCellSx}>{line.sku || '-'}</TableCell>
                          <TableCell sx={compactLineCellSx}>{translateUnit(language, line.unit) || '-'}</TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField size="small" type="number" value={line.quantity} onChange={(event) => updateLine(line.id, { quantity: clampNumber(Number(event.target.value), 1) })} inputProps={{ min: 1 }} sx={{ width: 86 }} />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField size="small" type="number" value={line.unitPrice} onChange={(event) => updateLine(line.id, { unitPrice: clampNumber(Number(event.target.value)) })} InputProps={{ startAdornment: <InputAdornment position="start">{currencyAdornment}</InputAdornment> }} sx={{ width: 130 }} />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField size="small" type="number" value={line.discount} onChange={(event) => updateLine(line.id, { discount: clampNumber(Number(event.target.value)) })} InputProps={{ startAdornment: <InputAdornment position="start">{currencyAdornment}</InputAdornment> }} sx={{ width: 120 }} />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>{line.taxRate}%</TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(totalsLine?.lineTotal ?? 0)}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={compactLineCellSx}>
                            <IconButton color="error" size="small" onClick={() => setLineItems((currentLines) => (currentLines.length === 1 ? currentLines : currentLines.filter((candidate) => candidate.id !== line.id)))}>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>

            <MainCard title={t('common.actions')} border elevation={0}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" startIcon={<SendOutlinedIcon />} onClick={generateQuotation}>
                  {t('quotation.generate')}
                </Button>
                <Button variant="outlined" startIcon={<RestartAltOutlinedIcon />} onClick={resetForm}>
                  {t('common.reset')}
                </Button>
              </Stack>
            </MainCard>

            {generatedQuotationNumber && (
              <Alert severity="success" variant="outlined">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <span>{t('quotation.generatedSuccess', { quotation: generatedQuotationNumber })}</span>
                  <Button variant="contained" size="small" startIcon={<VisibilityOutlinedIcon />} onClick={() => navigate('/erp/quotation-preview')}>
                    {t('quotation.viewPreview')}
                  </Button>
                </Stack>
              </Alert>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title={t('invoice.summary')} border elevation={0} sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
            <Stack spacing={1.5}>
              {[
                [t('invoice.subtotalBeforeVat'), formatCurrency(totals.subtotal)],
                [t('invoice.lineDiscounts'), formatCurrency(totals.discountTotal - totals.documentDiscount)],
                [t('quotation.documentDiscount'), formatCurrency(totals.documentDiscount)],
                [t('invoice.vatAmount'), formatCurrency(totals.vatTotal)]
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
                </Stack>
              ))}
              <TextField
                fullWidth
                type="number"
                label={t('quotation.documentDiscount')}
                value={documentDiscount}
                onChange={(event) => {
                  setDocumentDiscount(clampNumber(Number(event.target.value)));
                  setGeneratedQuotationNumber('');
                }}
                inputProps={{ min: 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start">{currencyAdornment}</InputAdornment> }}
              />
              <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{t('invoice.grandTotal')}</Typography>
                  <Typography variant="h3">{formatCurrency(totals.grandTotal)}</Typography>
                </Stack>
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </ErpFullWidthPage>
  );
};
