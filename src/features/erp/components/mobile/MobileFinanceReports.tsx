import { useMemo, useState } from 'react';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { mockExpenses, mockFinanceSummary, mockInvoices, mockPayments } from '../../mockData';
import { Invoice } from '../../types';
import { includesTranslatedValue, translateExpenseCategory, translateExpenseDescription, translatePartyName, translatePaymentMethod } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileFinanceReports = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const collectionRate = Math.round(((mockFinanceSummary.revenue - mockFinanceSummary.receivables) / Math.max(mockFinanceSummary.revenue, 1)) * 100);
  const sortedInvoices = useMemo(() => [...mockInvoices].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()), []);
  const filteredInvoices = sortedInvoices.filter((invoice) => {
    const matchesStatus = status === 'all' || invoice.paymentStatus === status;
    const matchesSearch = includesTranslatedValue(language, search, [
      invoice.invoiceNumber,
      invoice.customerName,
      translatePartyName(language, invoice.customerName),
      formatStatus(invoice.paymentStatus)
    ]);
    return matchesStatus && matchesSearch;
  });
  const visibleInvoices = showAll ? filteredInvoices : filteredInvoices.slice(0, 3);

  return (
    <MobileShell>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>{t('mobile.executiveSummary')}</Typography>
            <Typography variant="caption" color="text.secondary">{mockFinanceSummary.period}</Typography>
          </Box>
          <Chip icon={<CalendarTodayOutlinedIcon />} label={mockFinanceSummary.period} variant="outlined" />
        </Stack>

        <MobileSurface sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
            {t('finance.netProfit')}
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.75, fontWeight: 900, color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
            {formatCurrency(mockFinanceSummary.netProfit)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('finance.revenue')}: {formatCurrency(mockFinanceSummary.revenue)}
          </Typography>
        </MobileSurface>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}>
          {[
            [t('finance.grossProfit'), formatCurrency(mockFinanceSummary.grossProfit), theme.palette.success.main],
            [t('finance.operatingExpenses'), formatCurrency(mockFinanceSummary.expenses), theme.palette.warning.dark],
            [t('finance.receivables'), formatCurrency(mockFinanceSummary.receivables), theme.palette.info.main],
            [t('finance.payables'), formatCurrency(mockFinanceSummary.payables), theme.palette.error.main]
          ].map(([label, value, color]) => (
            <MobileSurface key={label as string}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                {label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.75, fontWeight: 900, color }}>
                {value}
              </Typography>
            </MobileSurface>
          ))}
        </Box>

        <MobileSurface>
          <MobileSectionTitle title={t('finance.profitabilitySummary')} />
          <Stack spacing={1.5}>
            {[
              [t('finance.revenue'), mockFinanceSummary.revenue, theme.palette.primary.main],
              [t('finance.costOfGoods'), mockFinanceSummary.cost, theme.palette.grey[700]],
              [t('finance.operatingExpenses'), mockFinanceSummary.expenses, theme.palette.warning.main],
              [t('finance.collectionRate'), collectionRate, theme.palette.info.main]
            ].map(([label, value, color]) => {
              const percent = typeof value === 'number' && label === t('finance.collectionRate') ? value : (Number(value) / Math.max(mockFinanceSummary.revenue, 1)) * 100;
              return (
                <Box key={label as string}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>
                      {label === t('finance.collectionRate') ? `${value}%` : formatCurrency(Number(value))}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(percent, 100))}
                    sx={{ height: 6, borderRadius: 999, bgcolor: alpha(color as string, 0.12), '& .MuiLinearProgress-bar': { bgcolor: color as string, borderRadius: 999 } }}
                  />
                </Box>
              );
            })}
          </Stack>
        </MobileSurface>

        <Box>
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('common.search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 2 } }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.25, '&::-webkit-scrollbar': { display: 'none' } }}>
            {[
              ['all', t('common.all')],
              ['paid', formatStatus('paid')],
              ['partially_paid', formatStatus('partially_paid')],
              ['unpaid', formatStatus('unpaid')]
            ].map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                onClick={() => setStatus(value)}
                color={status === value ? 'primary' : 'default'}
                variant={status === value ? 'filled' : 'outlined'}
              />
            ))}
            <Chip icon={<FilterListOutlinedIcon />} label={t('common.filter')} variant="outlined" />
          </Stack>
        </Box>

        <Box>
          <MobileSectionTitle
            title={t('finance.recentInvoices')}
            action={
              <Button size="small" onClick={() => setShowAll((current) => !current)}>
                {showAll ? t('mobile.showLess') : t('common.viewAll')}
              </Button>
            }
          />
          <Stack spacing={1.5}>
            {visibleInvoices.map((invoice) => {
              const tone = invoice.paymentStatus === 'paid' ? theme.palette.success.main : invoice.paymentStatus === 'partially_paid' ? theme.palette.warning.dark : theme.palette.error.main;
              return (
                <MobileSurface key={invoice.id}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 900 }}>
                          {invoice.invoiceNumber}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap>
                          {translatePartyName(language, invoice.customerName)}
                        </Typography>
                      </Box>
                      <Box sx={{ px: 1, py: 0.5, borderRadius: 1.5, color: tone, bgcolor: alpha(tone, 0.08), border: `1px solid ${alpha(tone, 0.35)}`, flex: '0 0 auto' }}>
                        <Typography variant="caption" sx={{ fontWeight: 900 }}>{formatStatus(invoice.paymentStatus)}</Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('common.total')}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(invoice.total)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('invoice.paidAmount')}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(invoice.paidAmount)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('invoice.balanceDue')}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: invoice.balanceDue > 0 ? theme.palette.error.main : 'text.primary' }}>{formatCurrency(invoice.balanceDue)}</Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(invoice.issueDate)}
                      </Typography>
                      <Button size="small" onClick={() => setSelectedInvoice(invoice)}>
                        {t('mobile.details')}
                      </Button>
                    </Stack>
                  </Stack>
                </MobileSurface>
              );
            })}
          </Stack>
        </Box>

        <MobileSurface>
          <MobileSectionTitle title={t('finance.payments')} />
          <Stack spacing={1.25}>
            {mockPayments.map((payment) => (
              <Stack key={payment.id} direction="row" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>{payment.referenceNumber ?? payment.invoiceId}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {translatePaymentMethod(language, payment.method)} · {formatDate(payment.date)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.success.main, flex: '0 0 auto' }}>
                  {formatCurrency(payment.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </MobileSurface>

        <MobileSurface>
          <MobileSectionTitle title={t('finance.expenses')} />
          <Stack spacing={1.25}>
            {mockExpenses.slice(0, 3).map((expense) => (
              <Stack key={expense.id} direction="row" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>{translateExpenseCategory(language, expense.category)}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {translateExpenseDescription(language, expense.description)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.error.main, flex: '0 0 auto' }}>
                  {formatCurrency(expense.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </MobileSurface>
      </Stack>

      <Dialog open={Boolean(selectedInvoice)} onClose={() => setSelectedInvoice(null)} fullWidth maxWidth="xs">
        <DialogTitle>{t('mobile.invoiceDetails')}</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>{selectedInvoice.invoiceNumber}</Typography>
              <Typography variant="body2">{t('invoice.customer')}: {translatePartyName(language, selectedInvoice.customerName)}</Typography>
              <Typography variant="body2">{t('common.total')}: {formatCurrency(selectedInvoice.total)}</Typography>
              <Typography variant="body2">{t('invoice.balanceDue')}: {formatCurrency(selectedInvoice.balanceDue)}</Typography>
              <Typography variant="body2">{t('invoice.paymentStatus')}: {formatStatus(selectedInvoice.paymentStatus)}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedInvoice(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </MobileShell>
  );
};
