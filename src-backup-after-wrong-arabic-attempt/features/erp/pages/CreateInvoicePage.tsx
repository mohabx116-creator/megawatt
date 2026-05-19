import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
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
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { ErpStatusChip } from '../components/ErpStatusChip';
import { mockCustomers, mockProducts } from '../mockData';
import { Product } from '../types';
import { formatEgp } from '../utils/formatters';

type PaymentTerms = 'cash' | '7' | '15' | '30';

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

type ValidationErrors = {
  customerId?: string;
  lineItems?: string;
  paidAmount?: string;
};

type GeneratedInvoiceSnapshot = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  paymentStatus: string;
  customer: {
    id: string;
    name: string;
    companyName: string;
    phone: string;
    address: string;
    city: string;
    taxRegistrationNumber?: string;
  };
  lines: {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
  }[];
  totals: {
    subtotal: number;
    lineDiscountTotal: number;
    invoiceDiscount: number;
    vatAmount: number;
    grandTotal: number;
    paidAmount: number;
    balanceDue: number;
  };
};

const generatedInvoiceStorageKey = 'megawatt:last-generated-invoice';
const today = new Date().toISOString().slice(0, 10);

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

  const daysToAdd = terms === 'cash' ? 0 : Number(terms);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
};

const clampNumber = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const compactLineCellSx = { px: 0.5, py: 0.75, fontSize: 12 };

const compactLineInputSx = {
  '& .MuiInputBase-root': {
    minHeight: 34,
    fontSize: 12
  },
  '& .MuiInputBase-input': {
    px: 0.75,
    py: 0.65
  },
  '& .MuiInputAdornment-root': {
    mr: 0.25,
    '& .MuiTypography-root': {
      fontSize: 11
    }
  }
};

export const CreateInvoicePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('15');
  const [dueDate, setDueDate] = useState(getDueDate(today, '15'));
  const [lineItems, setLineItems] = useState<InvoiceLineForm[]>([createEmptyLine()]);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState('');

  const selectedCustomer = mockCustomers.find((customer) => customer.id === customerId);

  const lineTotals = useMemo(
    () =>
      lineItems.map((line) => {
        const grossAmount = clampNumber(line.quantity) * clampNumber(line.unitPrice);
        const discount = clampNumber(line.discount, 0, grossAmount);
        const taxableAmount = grossAmount - discount;
        const vatAmount = taxableAmount * (clampNumber(line.taxRate) / 100);

        return {
          id: line.id,
          grossAmount,
          discount,
          taxableAmount,
          vatAmount,
          total: taxableAmount + vatAmount
        };
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

    return {
      subtotal,
      lineDiscountTotal,
      invoiceLevelDiscount,
      vatAmount,
      grandTotal,
      safePaidAmount,
      balanceDue
    };
  }, [invoiceDiscount, lineTotals, paidAmount]);

  const paymentStatus =
    invoiceTotals.grandTotal > 0 && invoiceTotals.safePaidAmount >= invoiceTotals.grandTotal
      ? 'paid'
      : invoiceTotals.safePaidAmount > 0
        ? 'partially_paid'
        : 'unpaid';

  const updateLine = (lineId: string, updates: Partial<InvoiceLineForm>) => {
    setGeneratedInvoiceNumber('');
    setLineItems((currentLines) => currentLines.map((line) => (line.id === lineId ? { ...line, ...updates } : line)));
  };

  const handleProductChange = (lineId: string, productId: string) => {
    const product = mockProducts.find((candidate) => candidate.id === productId);

    updateLine(lineId, {
      productId,
      sku: product?.sku ?? '',
      unit: product?.unit ?? '',
      unitPrice: product?.salePrice ?? 0,
      taxRate: product?.taxRate ?? 14
    });
  };

  const handlePaymentTermsChange = (event: SelectChangeEvent) => {
    const nextTerms = event.target.value as PaymentTerms;
    setPaymentTerms(nextTerms);
    setDueDate(getDueDate(invoiceDate, nextTerms));
    setGeneratedInvoiceNumber('');
  };

  const handleInvoiceDateChange = (value: string) => {
    setInvoiceDate(value);
    setDueDate(getDueDate(value, paymentTerms));
    setGeneratedInvoiceNumber('');
  };

  const addLine = () => {
    setGeneratedInvoiceNumber('');
    setLineItems((currentLines) => [...currentLines, createEmptyLine()]);
  };

  const removeLine = (lineId: string) => {
    setGeneratedInvoiceNumber('');
    setLineItems((currentLines) => (currentLines.length === 1 ? currentLines : currentLines.filter((line) => line.id !== lineId)));
  };

  const resetForm = () => {
    setCustomerId('');
    setInvoiceDate(today);
    setPaymentTerms('15');
    setDueDate(getDueDate(today, '15'));
    setLineItems([createEmptyLine()]);
    setInvoiceDiscount(0);
    setPaidAmount(0);
    setErrors({});
    setGeneratedInvoiceNumber('');
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    const validLines = lineItems.filter((line) => line.productId && line.quantity > 0 && line.unitPrice >= 0);

    if (!customerId) {
      nextErrors.customerId = 'العميل مطلوب.';
    }

    if (validLines.length === 0) {
      nextErrors.lineItems = 'أضف بندًا واحدًا على الأقل بكمية أكبر من صفر.';
    }

    if (paidAmount < 0) {
      nextErrors.paidAmount = 'المبلغ المدفوع لا يمكن أن يكون سالبًا.';
    } else if (paidAmount > invoiceTotals.grandTotal) {
      nextErrors.paidAmount = 'المبلغ المدفوع لا يمكن أن يتجاوز إجمالي الفاتورة.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const generateInvoice = () => {
    if (!validateForm()) return;

    if (!selectedCustomer) return;

    const invoiceNumber = `DRAFT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const snapshot: GeneratedInvoiceSnapshot = {
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
      lines: lineItems
        .filter((line) => line.productId && line.quantity > 0)
        .map((line) => {
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
            discount: totals?.discount ?? line.discount,
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
  };

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title="إنشاء فاتورة" subtitle="إعداد فاتورة مبيعات لعملاء Megawatt" />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <MainCard title="بيانات العميل والفاتورة" border elevation={0} headerSX={{ py: 1.75 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth error={Boolean(errors.customerId)}>
                    <InputLabel id="invoice-customer-label">العميل</InputLabel>
                    <Select
                      labelId="invoice-customer-label"
                    label="العميل"
                      value={customerId}
                      onChange={(event: SelectChangeEvent) => {
                        setCustomerId(event.target.value);
                        setGeneratedInvoiceNumber('');
                      }}
                    >
                      {mockCustomers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.companyName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.customerId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.75 }}>
                        {errors.customerId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField fullWidth label="تاريخ الفاتورة" type="date" value={invoiceDate} onChange={(event) => handleInvoiceDateChange(event.target.value)} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField fullWidth label="تاريخ الاستحقاق" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id="payment-terms-label">شروط السداد</InputLabel>
                    <Select labelId="payment-terms-label" label="شروط السداد" value={paymentTerms} onChange={handlePaymentTermsChange}>
                      <MenuItem value="cash">نقدًا</MenuItem>
                      <MenuItem value="7">7 أيام</MenuItem>
                      <MenuItem value="15">15 يومًا</MenuItem>
                      <MenuItem value="30">30 يومًا</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {selectedCustomer && (
                  <Grid size={12}>
                    <Box
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03)
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                            بيانات التواصل
                          </Typography>
                          <Typography variant="body2">{selectedCustomer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedCustomer.phone}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                            الموقع
                          </Typography>
                          <Typography variant="body2">{selectedCustomer.address}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedCustomer.city}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                            التسجيل الضريبي
                          </Typography>
                          <Typography variant="body2">{selectedCustomer.taxRegistrationNumber ?? 'غير متوفر'}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </MainCard>

            <MainCard
              title="بنود الفاتورة"
              border
              elevation={0}
              headerSX={{ py: 1.75 }}
              secondary={
                <Button size="small" variant="outlined" startIcon={<AddOutlinedIcon />} onClick={addLine}>
                  إضافة بند
                </Button>
              }
              contentSX={{ p: 2, '&:last-child': { pb: 2 } }}
            >
              {errors.lineItems && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.lineItems}
                </Alert>
              )}
              <TableContainer
                component={Box}
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  overflowX: 'auto',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1
                }}
              >
                <Table size="small" aria-label="invoice line items" sx={{ minWidth: 920, tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                      <TableCell sx={{ ...compactLineCellSx, width: 220, minWidth: 220 }}>المنتج</TableCell>
                      <TableCell sx={{ ...compactLineCellSx, width: 115 }}>كود المنتج</TableCell>
                      <TableCell sx={{ ...compactLineCellSx, width: 75 }}>الوحدة</TableCell>
                      <TableCell align="right" sx={{ ...compactLineCellSx, width: 82 }}>
                        الكمية
                      </TableCell>
                      <TableCell align="right" sx={{ ...compactLineCellSx, width: 112 }}>
                        سعر الوحدة
                      </TableCell>
                      <TableCell align="right" sx={{ ...compactLineCellSx, width: 108 }}>
                        الخصم
                      </TableCell>
                      <TableCell align="right" sx={{ ...compactLineCellSx, width: 55 }}>
                        الضريبة
                      </TableCell>
                      <TableCell align="right" sx={{ ...compactLineCellSx, width: 105 }}>
                        إجمالي البند
                      </TableCell>
                      <TableCell align="center" sx={{ ...compactLineCellSx, width: 34 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((line) => {
                      const product = mockProducts.find((candidate: Product) => candidate.id === line.productId);
                      const totals = lineTotals.find((lineTotal) => lineTotal.id === line.id);

                      return (
                        <TableRow key={line.id}>
                          <TableCell sx={{ ...compactLineCellSx, width: 220, minWidth: 220 }}>
                            <FormControl fullWidth size="small" sx={{ minWidth: 0 }}>
                              <InputLabel id={`product-label-${line.id}`}>المنتج</InputLabel>
                              <Select
                                labelId={`product-label-${line.id}`}
                                label="المنتج"
                                value={line.productId}
                                onChange={(event: SelectChangeEvent) => handleProductChange(line.id, event.target.value)}
                                sx={{
                                  width: '100%',
                                  ...compactLineInputSx,
                                  '& .MuiSelect-select': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }
                                }}
                              >
                                {mockProducts.map((candidate) => (
                                  <MenuItem key={candidate.id} value={candidate.id}>
                                    {candidate.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {product && (
                              <Typography variant="caption" color="text.secondary">
                                {product.category}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ ...compactLineCellSx, whiteSpace: 'nowrap', fontWeight: 700 }}>{line.sku || 'غير متاح'}</TableCell>
                          <TableCell sx={compactLineCellSx}>{line.unit || 'غير متاح'}</TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField
                              size="small"
                              type="number"
                              value={line.quantity}
                              onChange={(event) => updateLine(line.id, { quantity: clampNumber(Number(event.target.value)) })}
                              inputProps={{ min: 0, step: 1 }}
                              sx={{ width: 68, ...compactLineInputSx }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField
                              size="small"
                              type="number"
                              value={line.unitPrice}
                              onChange={(event) => updateLine(line.id, { unitPrice: clampNumber(Number(event.target.value)) })}
                              inputProps={{ min: 0, step: 1 }}
                              InputProps={{ startAdornment: <InputAdornment position="start">جنيه</InputAdornment> }}
                              sx={{ width: 100, ...compactLineInputSx }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            <TextField
                              size="small"
                              type="number"
                              value={line.discount}
                              onChange={(event) => updateLine(line.id, { discount: clampNumber(Number(event.target.value)) })}
                              inputProps={{ min: 0, step: 1 }}
                              InputProps={{ startAdornment: <InputAdornment position="start">جنيه</InputAdornment> }}
                              sx={{ width: 96, ...compactLineInputSx }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={compactLineCellSx}>
                            {line.taxRate}%
                          </TableCell>
                          <TableCell align="right" sx={{ ...compactLineCellSx, fontWeight: 700 }}>
                            {formatEgp(totals?.total ?? 0)}
                          </TableCell>
                          <TableCell align="center" sx={{ ...compactLineCellSx, width: 34 }}>
                            <IconButton
                              color="error"
                              disabled={lineItems.length === 1}
                              onClick={() => removeLine(line.id)}
                              aria-label="حذف البند"
                              size="small"
                              sx={{ p: 0.5 }}
                            >
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

            <MainCard title="الإجراءات" border elevation={0} headerSX={{ py: 1.75 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" startIcon={<SendOutlinedIcon />} onClick={generateInvoice}>
                  إصدار الفاتورة
                </Button>
                <Button variant="outlined" startIcon={<RestartAltOutlinedIcon />} onClick={resetForm}>
                  إعادة تعيين
                </Button>
              </Stack>
            </MainCard>

            {generatedInvoiceNumber && (
              <Alert severity="success" variant="outlined">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                  <span>
                    تم إصدار الفاتورة {generatedInvoiceNumber} للعميل {selectedCustomer?.companyName}. الإجمالي {formatEgp(invoiceTotals.grandTotal)} والمتبقي{' '}
                    {formatEgp(invoiceTotals.balanceDue)}.
                  </span>
                  <Button variant="outlined" size="small" onClick={() => navigate('/erp/print-preview')}>
                    معاينة الطباعة
                  </Button>
                </Stack>
              </Alert>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="ملخص الفاتورة" border elevation={0} headerSX={{ py: 1.75 }} sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
            <Stack spacing={2}>
              {[
                ['الإجمالي قبل الضريبة', invoiceTotals.subtotal],
                ['خصومات البنود', -invoiceTotals.lineDiscountTotal],
                ['خصم الفاتورة', -invoiceTotals.invoiceLevelDiscount],
                ['ضريبة القيمة المضافة', invoiceTotals.vatAmount]
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatEgp(value as number)}
                  </Typography>
                </Stack>
              ))}

              <TextField
                fullWidth
                label="خصم على مستوى الفاتورة"
                type="number"
                value={invoiceDiscount}
                onChange={(event) => {
                  setInvoiceDiscount(clampNumber(Number(event.target.value)));
                  setGeneratedInvoiceNumber('');
                }}
                inputProps={{ min: 0, step: 1 }}
                InputProps={{ startAdornment: <InputAdornment position="start">جنيه</InputAdornment> }}
              />

              <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="h4">الإجمالي النهائي</Typography>
                  <Typography variant="h4">{formatEgp(invoiceTotals.grandTotal)}</Typography>
                </Stack>
              </Box>

              <TextField
                fullWidth
                label="المبلغ المدفوع"
                type="number"
                value={paidAmount}
                error={Boolean(errors.paidAmount)}
                helperText={errors.paidAmount}
                onChange={(event) => {
                  setPaidAmount(clampNumber(Number(event.target.value)));
                  setGeneratedInvoiceNumber('');
                }}
                inputProps={{ min: 0, step: 1 }}
                InputProps={{ startAdornment: <InputAdornment position="start">جنيه</InputAdornment> }}
              />

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  المبلغ المتبقي
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatEgp(invoiceTotals.balanceDue)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  حالة السداد
                </Typography>
                <ErpStatusChip status={paymentStatus} />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </ErpFullWidthPage>
  );
};
