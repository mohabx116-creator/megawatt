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

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockCustomers, mockExpenses, mockFinanceSummary, mockInvoices, mockPayments } from '../mockData';
import { Expense, Invoice, Payment } from '../types';
import { formatDate, formatEgp, formatLabel, formatNumber } from '../utils/formatters';

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

const getCustomerName = (customerId: string) => {
  const customer = mockCustomers.find((candidate) => candidate.id === customerId);
  return customer?.companyName ?? customer?.name ?? 'Unknown customer';
};

const sortedInvoices = [...mockInvoices].sort((first, second) => new Date(second.issueDate).getTime() - new Date(first.issueDate).getTime());
const sortedPayments = [...mockPayments].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
const sortedExpenses = [...mockExpenses].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

export const FinanceReportsPage = () => {
  const theme = useTheme();

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
      title: 'Revenue',
      value: formatEgp(mockFinanceSummary.revenue),
      helper: mockFinanceSummary.period,
      icon: AssessmentOutlinedIcon,
      color: theme.palette.primary.main
    },
    {
      title: 'Cost of Goods',
      value: formatEgp(mockFinanceSummary.cost),
      helper: 'Direct product cost',
      icon: TrendingDownOutlinedIcon,
      color: theme.palette.grey[700]
    },
    {
      title: 'Gross Profit',
      value: formatEgp(mockFinanceSummary.grossProfit),
      helper: `${formatNumber((mockFinanceSummary.grossProfit / Math.max(mockFinanceSummary.revenue, 1)) * 100)}% margin`,
      icon: TrendingUpOutlinedIcon,
      color: theme.palette.success.main
    },
    {
      title: 'Operating Expenses',
      value: formatEgp(mockFinanceSummary.expenses),
      helper: `${mockExpenses.length} recorded expenses`,
      icon: ReceiptLongOutlinedIcon,
      color: theme.palette.warning.main
    },
    {
      title: 'Net Profit',
      value: formatEgp(mockFinanceSummary.netProfit),
      helper: mockFinanceSummary.netProfit >= 0 ? 'Profitable period' : 'Loss-making period',
      icon: SavingsOutlinedIcon,
      color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
    },
    {
      title: 'Receivables',
      value: formatEgp(mockFinanceSummary.receivables),
      helper: `${formatNumber(mockInvoices.length)} invoices tracked`,
      icon: AccountBalanceOutlinedIcon,
      color: theme.palette.warning.main
    },
    {
      title: 'Payables',
      value: formatEgp(mockFinanceSummary.payables),
      helper: 'Supplier balances',
      icon: PaymentsOutlinedIcon,
      color: theme.palette.error.main
    },
    {
      title: 'Collection Rate',
      value: `${formatNumber(collectionRate)}%`,
      helper: `${formatEgp(invoiceTotals.paid)} collected`,
      icon: TrendingUpOutlinedIcon,
      color: theme.palette.primary.main
    }
  ];

  const profitabilityRows = [
    { label: 'Revenue', value: mockFinanceSummary.revenue, color: theme.palette.primary.main },
    { label: 'Cost', value: mockFinanceSummary.cost, color: theme.palette.grey[600] },
    { label: 'Gross Profit', value: mockFinanceSummary.grossProfit, color: theme.palette.success.main },
    { label: 'Expenses', value: mockFinanceSummary.expenses, color: theme.palette.warning.main },
    {
      label: 'Net Profit',
      value: mockFinanceSummary.netProfit,
      color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
    }
  ];

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title="Finance Reports" subtitle="Revenue, expenses, receivables, and profitability overview" />

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
          <MainCard title="Profitability Summary" border elevation={0} headerSX={{ py: 1.75 }}>
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
                        {formatEgp(row.value)}
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
                  ['Gross margin', `${formatNumber((mockFinanceSummary.grossProfit / Math.max(mockFinanceSummary.revenue, 1)) * 100)}%`],
                  ['Expense ratio', `${formatNumber((mockFinanceSummary.expenses / Math.max(mockFinanceSummary.revenue, 1)) * 100)}%`],
                  ['Cash collected', formatEgp(invoiceTotals.paid)],
                  ['Payables', formatEgp(mockFinanceSummary.payables)]
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
          <MainCard title="Receivables & Cash Health" border elevation={0} headerSX={{ py: 1.75 }}>
            <Stack spacing={2}>
              {[
                ['Total receivables', formatEgp(mockFinanceSummary.receivables)],
                ['Outstanding balance', formatEgp(invoiceTotals.outstanding)],
                ['Paid invoices', formatNumber(paidInvoiceCount)],
                ['Partially paid invoices', formatNumber(partialInvoiceCount)],
                ['Unpaid / overdue invoices', formatNumber(unpaidOrOverdueCount)],
                ['Collection rate', `${formatNumber(collectionRate)}%`]
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
                    Collection progress
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
                  ['Paid', paidInvoiceCount, theme.palette.success.main],
                  ['Partial', partialInvoiceCount, theme.palette.warning.main],
                  ['Risk', unpaidOrOverdueCount, theme.palette.error.main]
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
                  Follow-up priority
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatEgp(invoiceTotals.outstanding)} remains open across {formatNumber(partialInvoiceCount + unpaidOrOverdueCount)} invoices.
                </Typography>
              </Box>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title="Recent Invoices" border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="recent invoices" sx={{ minWidth: 820 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Paid</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedInvoices.map((invoice: Invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell align="right">{formatEgp(invoice.total)}</TableCell>
                      <TableCell align="right">{formatEgp(invoice.paidAmount)}</TableCell>
                      <TableCell align="right">{formatEgp(invoice.balanceDue)}</TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" color={getPaymentStatusColor(invoice)} label={formatLabel(invoice.paymentStatus)} sx={{ borderRadius: 1, fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title="Payments" border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="payments" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Amount</TableCell>
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
                          {getCustomerName(payment.customerId)}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatLabel(payment.method)}</TableCell>
                      <TableCell align="right">{formatEgp(payment.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        <Grid size={12}>
          <MainCard title="Expenses" border elevation={0} headerSX={{ py: 1.75 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="expenses" sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Recorded By</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedExpenses.map((expense: Expense) => (
                    <TableRow key={expense.id} hover>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" label={formatLabel(expense.category)} sx={{ borderRadius: 1, fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.vendorName}</TableCell>
                      <TableCell>{expense.recordedBy}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatEgp(expense.amount)}
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
