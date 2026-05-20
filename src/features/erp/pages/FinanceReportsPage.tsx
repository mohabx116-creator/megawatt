import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { SvgIconComponent } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockCustomers, mockExpenses, mockFinanceSummary, mockInvoices, mockPayments } from '../mockData';
import { Expense, Invoice, Payment } from '../types';
import {
  translateExpenseCategory,
  translateExpenseDescription,
  translatePartyName,
  translatePaymentMethod
} from '../utils/displayTranslations';

type FinanceMetric = {
  title: string;
  value: string;
  helper: string;
  icon: SvgIconComponent;
  color: string;
};

const getPaymentStatusColor = (invoice: Invoice): ChipProps['color'] => {
  if (invoice.paymentStatus === 'paid') return 'success';
  if (invoice.paymentStatus === 'partially_paid') return 'warning';
  if (invoice.paymentStatus === 'unpaid' || invoice.status === 'overdue') return 'error';
  return 'default';
};

const getCustomerName = (customerId: string, fallback: string) => {
  const customer = mockCustomers.find((candidate) => candidate.id === customerId);
  return customer?.companyName ?? customer?.name ?? fallback;
};

const sortedInvoices = [...mockInvoices].sort((first, second) => new Date(second.issueDate).getTime() - new Date(first.issueDate).getTime());
const sortedPayments = [...mockPayments].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
const sortedExpenses = [...mockExpenses].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

export const FinanceReportsPage = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();

  const invoiceTotals = mockInvoices.reduce(
    (totals, invoice) => ({
      billed: totals.billed + invoice.total,
      paid: totals.paid + invoice.paidAmount,
      outstanding: totals.outstanding + invoice.balanceDue
    }),
    { billed: 0, paid: 0, outstanding: 0 }
  );

  const paidInvoiceCount = mockInvoices.filter((invoice) => invoice.paymentStatus === 'paid').length;
  const partialInvoiceCount = mockInvoices.filter((invoice) => invoice.paymentStatus === 'partially_paid').length;
  const unpaidOrOverdueCount = mockInvoices.filter((invoice) => invoice.paymentStatus === 'unpaid' || invoice.status === 'overdue').length;
  const collectionRate = invoiceTotals.billed > 0 ? (invoiceTotals.paid / invoiceTotals.billed) * 100 : 0;
  const maxProfitabilityValue = Math.max(mockFinanceSummary.revenue, mockFinanceSummary.cost, mockFinanceSummary.expenses, Math.abs(mockFinanceSummary.netProfit), 1);

  const metrics: FinanceMetric[] = [
    {
      title: t('finance.revenue'),
      value: formatCurrency(mockFinanceSummary.revenue),
      helper: mockFinanceSummary.period,
      icon: AssessmentOutlinedIcon,
      color: theme.palette.primary.main
    },
    {
      title: t('finance.costOfGoods'),
      value: formatCurrency(mockFinanceSummary.cost),
      helper: t('finance.directProductCost'),
      icon: TrendingDownOutlinedIcon,
      color: theme.palette.grey[700]
    },
    {
      title: t('finance.grossProfit'),
      value: formatCurrency(mockFinanceSummary.grossProfit),
      helper: t('finance.margin', { value: formatNumber((mockFinanceSummary.grossProfit / Math.max(mockFinanceSummary.revenue, 1)) * 100) }),
      icon: TrendingUpOutlinedIcon,
      color: theme.palette.success.main
    },
    {
      title: t('finance.operatingExpenses'),
      value: formatCurrency(mockFinanceSummary.expenses),
      helper: t('finance.recordedExpenses', { count: formatNumber(mockExpenses.length) }),
      icon: ReceiptLongOutlinedIcon,
      color: theme.palette.warning.main
    },
    {
      title: t('finance.netProfit'),
      value: formatCurrency(mockFinanceSummary.netProfit),
      helper: mockFinanceSummary.netProfit >= 0 ? t('finance.profitablePeriod') : t('finance.lossMakingPeriod'),
      icon: SavingsOutlinedIcon,
      color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
    },
    {
      title: t('finance.receivables'),
      value: formatCurrency(mockFinanceSummary.receivables),
      helper: t('finance.invoicesTracked', { count: formatNumber(mockInvoices.length) }),
      icon: AccountBalanceOutlinedIcon,
      color: theme.palette.warning.main
    },
    {
      title: t('finance.payables'),
      value: formatCurrency(mockFinanceSummary.payables),
      helper: t('finance.supplierBalances'),
      icon: PaymentsOutlinedIcon,
      color: theme.palette.error.main
    },
    {
      title: t('finance.collectionRate'),
      value: `${formatNumber(collectionRate)}%`,
      helper: t('finance.collected', { amount: formatCurrency(invoiceTotals.paid) }),
      icon: TrendingUpOutlinedIcon,
      color: theme.palette.primary.main
    }
  ];

  const profitabilityRows = [
    { label: t('finance.revenue'), value: mockFinanceSummary.revenue, color: theme.palette.primary.main },
    { label: t('finance.cost'), value: mockFinanceSummary.cost, color: theme.palette.grey[600] },
    { label: t('finance.grossProfit'), value: mockFinanceSummary.grossProfit, color: theme.palette.success.main },
    { label: t('finance.expenses'), value: mockFinanceSummary.expenses, color: theme.palette.warning.main },
    {
      label: t('finance.netProfit'),
      value: mockFinanceSummary.netProfit,
      color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
    }
  ];

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('finance.title')} subtitle={t('finance.subtitle')} />

      <Grid container spacing={2}>
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Grid key={metric.title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ height: '100%' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      {metric.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 1,
                        color: metric.color,
                        backgroundColor: alpha(metric.color, 0.1),
                        border: `1px solid ${alpha(metric.color, 0.2)}`
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                  </Stack>
                  <Typography variant="h3">{metric.value}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.helper}
                  </Typography>
                </Stack>
              </MainCard>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard title={t('finance.profitabilitySummary')} border elevation={0} headerSX={{ py: 1.75 }}>
            <Stack spacing={2.25}>
              {profitabilityRows.map((row) => {
                const progress = Math.min((Math.abs(row.value) / maxProfitabilityValue) * 100, 100);

                return (
                  <Box key={row.label}>
                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(row.value)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 0.5,
                        backgroundColor: alpha(theme.palette.divider, 0.55),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 0.5,
                          backgroundColor: row.color
                        }
                      }}
                    />
                  </Box>
                );
              })}
              <Grid container spacing={1.5} sx={{ pt: 0.75 }}>
                {[
                  [t('finance.grossMargin'), `${formatNumber((mockFinanceSummary.grossProfit / Math.max(mockFinanceSummary.revenue, 1)) * 100)}%`],
                  [t('finance.expenseRatio'), `${formatNumber((mockFinanceSummary.expenses / Math.max(mockFinanceSummary.revenue, 1)) * 100)}%`],
                  [t('finance.cashCollected'), formatCurrency(invoiceTotals.paid)],
                  [t('finance.payables'), formatCurrency(mockFinanceSummary.payables)]
                ].map(([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box
                      sx={{
                        p: 1.25,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03)
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="h4">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title={t('finance.receivablesCashHealth')} border elevation={0} headerSX={{ py: 1.75 }}>
            <Stack spacing={2}>
              {[
                [t('finance.totalReceivables'), formatCurrency(mockFinanceSummary.receivables)],
                [t('finance.outstandingBalance'), formatCurrency(invoiceTotals.outstanding)],
                [t('finance.paidInvoices'), formatNumber(paidInvoiceCount)],
                [t('finance.partiallyPaidInvoices'), formatNumber(partialInvoiceCount)],
                [t('finance.unpaidOverdueInvoices'), formatNumber(unpaidOrOverdueCount)],
                [t('finance.collectionRate'), `${formatNumber(collectionRate)}%`]
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </Stack>
              ))}
              <Box>
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    {t('finance.collectionProgress')}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {formatNumber(collectionRate)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(collectionRate, 100)}
                  sx={{
                    height: 9,
                    borderRadius: 0.5,
                    backgroundColor: alpha(theme.palette.divider, 0.55),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 0.5,
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                />
              </Box>
              <Grid container spacing={1}>
                {[
                  [formatStatus('paid'), paidInvoiceCount, theme.palette.success.main],
                  [t('finance.partial'), partialInvoiceCount, theme.palette.warning.main],
                  [t('finance.risk'), unpaidOrOverdueCount, theme.palette.error.main]
                ].map(([label, value, color]) => (
                  <Grid key={label as string} size={4}>
                    <Box
                      sx={{
                        p: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderLeft: `3px solid ${color}`,
                        borderRadius: 1,
                        backgroundColor: alpha(color as string, 0.06)
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="h4">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  p: 1.25,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.warning.main, 0.07)
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {t('finance.followUpPriority')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('finance.openAcrossInvoices', {
                    amount: formatCurrency(invoiceTotals.outstanding),
                    count: formatNumber(partialInvoiceCount + unpaidOrOverdueCount)
                  })}
                </Typography>
              </Box>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title={t('finance.recentInvoices')} border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="recent invoices" sx={{ minWidth: 820 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>{t('invoice.invoice')}</TableCell>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell>{t('invoice.customer')}</TableCell>
                    <TableCell align="right">{t('common.total')}</TableCell>
                    <TableCell align="right">{formatStatus('paid')}</TableCell>
                    <TableCell align="right">{t('invoice.balanceDue')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedInvoices.map((invoice: Invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{translatePartyName(language, invoice.customerName)}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.paidAmount)}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.balanceDue)}</TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" color={getPaymentStatusColor(invoice)} label={formatStatus(invoice.paymentStatus)} sx={{ borderRadius: 1, fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title={t('finance.payments')} border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="payments" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell>{t('finance.reference')}</TableCell>
                    <TableCell>{t('finance.method')}</TableCell>
                    <TableCell align="right">{t('finance.amount')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPayments.map((payment: Payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {payment.invoiceId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {translatePartyName(language, getCustomerName(payment.customerId, t('common.notAvailable')))}
                        </Typography>
                      </TableCell>
                      <TableCell>{translatePaymentMethod(language, payment.method)}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title={t('finance.expenses')} border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="expenses" sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell>{t('common.category')}</TableCell>
                    <TableCell>{t('finance.description')}</TableCell>
                    <TableCell>{t('finance.vendor')}</TableCell>
                    <TableCell>{t('finance.recordedBy')}</TableCell>
                    <TableCell align="right">{t('finance.amount')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedExpenses.map((expense: Expense) => (
                    <TableRow key={expense.id} hover>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" label={translateExpenseCategory(language, expense.category)} sx={{ borderRadius: 1, fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>{translateExpenseDescription(language, expense.description)}</TableCell>
                      <TableCell>{translatePartyName(language, expense.vendorName)}</TableCell>
                      <TableCell>{expense.recordedBy}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      </Grid>
    </ErpFullWidthPage>
  );
};
