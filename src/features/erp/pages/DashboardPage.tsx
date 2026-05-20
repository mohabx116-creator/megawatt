import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import { alpha, useTheme } from '@mui/material/styles';
import { SvgIconComponent } from '@mui/icons-material';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockDashboardMetrics, mockFinanceSummary, mockInventory, mockInvoices, mockProducts } from '../mockData';
import { Invoice } from '../types';
import { translatePartyName, translateProductName, translateUnit } from '../utils/displayTranslations';

type KpiCard = {
  title: string;
  value: string;
  trend?: number;
  trendLabel: string;
  icon: SvgIconComponent;
  accent: 'primary' | 'warning' | 'success' | 'error';
};

const getPaymentChipColor = (invoice: Invoice): 'success' | 'warning' | 'error' | 'default' => {
  if (invoice.paymentStatus === 'paid') return 'success';
  if (invoice.paymentStatus === 'partially_paid') return 'warning';
  if (invoice.status === 'overdue' || invoice.paymentStatus === 'unpaid') return 'error';
  return 'default';
};

const sortedInvoices = [...mockInvoices].sort(
  (first, second) => new Date(second.issueDate).getTime() - new Date(first.issueDate).getTime()
);

export const DashboardPage = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatStatus, formatNumber } = useLanguage();

  const lowStockItems = mockInventory.filter((item) => item.quantityOnHand <= item.reorderLevel);
  const openInvoices = mockInvoices.filter((invoice) => invoice.balanceDue > 0);
  const totalInventoryValue = mockInventory.reduce((sum, item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
    return sum + item.quantityOnHand * (product?.salePrice ?? 0);
  }, 0);

  const revenueMetric = mockDashboardMetrics.find((metric) => metric.title.toLowerCase().includes('revenue'));
  const receivablesMetric = mockDashboardMetrics.find((metric) => metric.title.toLowerCase().includes('receivables'));
  const lowStockMetric = mockDashboardMetrics.find((metric) => metric.title.toLowerCase().includes('low stock'));
  const marginMetric = mockDashboardMetrics.find((metric) => metric.title.toLowerCase().includes('margin'));

  const kpiCards: KpiCard[] = [
    {
      title: t('dashboard.revenue'),
      value: formatCurrency(mockFinanceSummary.revenue),
      trend: revenueMetric?.trendPercent,
      trendLabel: revenueMetric ? t('dashboard.comparedPreviousMonth') : mockFinanceSummary.period,
      icon: AssessmentOutlinedIcon,
      accent: 'primary'
    },
    {
      title: t('dashboard.grossProfit'),
      value: formatCurrency(mockFinanceSummary.grossProfit),
      trend: marginMetric?.trendPercent,
      trendLabel: t('dashboard.margin', { value: marginMetric?.value ?? 0 }),
      icon: TrendingUpOutlinedIcon,
      accent: 'success'
    },
    {
      title: t('dashboard.expenses'),
      value: formatCurrency(mockFinanceSummary.expenses),
      trend: -3.4,
      trendLabel: t('dashboard.operatingExpensesUnderReview'),
      icon: TrendingDownOutlinedIcon,
      accent: 'warning'
    },
    {
      title: t('dashboard.receivables'),
      value: formatCurrency(mockFinanceSummary.receivables),
      trend: receivablesMetric?.trendPercent,
      trendLabel: receivablesMetric ? t('dashboard.comparedPreviousMonth') : t('dashboard.openCustomerBalances'),
      icon: AccountBalanceWalletOutlinedIcon,
      accent: 'warning'
    },
    {
      title: t('dashboard.inventoryValue'),
      value: formatCurrency(totalInventoryValue),
      trend: undefined,
      trendLabel: t('dashboard.stockedSkus', { count: mockInventory.length }),
      icon: Inventory2OutlinedIcon,
      accent: 'primary'
    },
    {
      title: t('dashboard.stockAlerts'),
      value: String(lowStockMetric?.value ?? lowStockItems.length),
      trend: lowStockMetric?.trendPercent,
      trendLabel: lowStockMetric ? t('dashboard.requiresAttention') : t('dashboard.requiresReorder'),
      icon: ReportProblemOutlinedIcon,
      accent: 'error'
    }
  ];

  const topInventory = [...mockInventory]
    .map((item) => {
      const product = mockProducts.find((candidate) => candidate.id === item.productId);
      return {
        ...item,
        value: item.quantityOnHand * (product?.salePrice ?? 0)
      };
    })
    .sort((first, second) => second.value - first.value)
    .slice(0, 3);

  const maxInventoryValue = Math.max(...topInventory.map((item) => item.value), 1);
  const performanceMax = Math.max(mockFinanceSummary.revenue, mockFinanceSummary.expenses, 1);

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle', { period: mockFinanceSummary.period })} />

      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%' }}>
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const accentColor =
            card.accent === 'primary'
              ? theme.palette.primary.main
              : card.accent === 'warning'
                ? theme.palette.warning.main
                : card.accent === 'success'
                  ? theme.palette.success.main
                  : theme.palette.error.main;

          return (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MainCard
                border
                elevation={0}
                contentSX={{ p: 2, '&:last-child': { pb: 2 } }}
                sx={{ height: '100%', width: '100%', maxWidth: '100%', backgroundColor: theme.palette.background.paper }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      {card.title}
                    </Typography>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 1,
                        color: accentColor,
                        backgroundColor: alpha(accentColor, 0.1),
                        border: `1px solid ${alpha(accentColor, 0.2)}`
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                  </Stack>
                  <Typography variant="h3" sx={{ lineHeight: 1.2 }}>
                    {card.value}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    {typeof card.trend === 'number' && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: card.trend >= 0 ? theme.palette.success.main : theme.palette.error.main
                        }}
                      >
                        {card.trend >= 0 ? '+' : ''}
                        {card.trend}%
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {card.trendLabel}
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
          );
        })}

        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard
            title={t('dashboard.operationalPerformance')}
            border
            elevation={0}
            contentSX={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
            headerSX={{ py: 1.75 }}
            sx={{ width: '100%', maxWidth: '100%' }}
          >
            <Stack spacing={2.5}>
              {[
                { label: t('dashboard.salesRevenue'), value: mockFinanceSummary.revenue, color: theme.palette.primary.main },
                { label: t('dashboard.costOfGoods'), value: mockFinanceSummary.cost, color: theme.palette.grey[600] },
                { label: t('dashboard.operatingExpenses'), value: mockFinanceSummary.expenses, color: theme.palette.warning.main },
                {
                  label: t('dashboard.netProfit'),
                  value: mockFinanceSummary.netProfit,
                  color: mockFinanceSummary.netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
                }
              ].map((item) => {
                const progress = Math.min(Math.abs(item.value) / performanceMax, 1) * 100;

                return (
                  <Box key={item.label}>
                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(item.value)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 0.5,
                        backgroundColor: alpha(theme.palette.divider, 0.5),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 0.5,
                          backgroundColor: item.color
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard
            title={t('dashboard.topInventory')}
            border
            elevation={0}
            contentSX={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
            headerSX={{ py: 1.75 }}
            sx={{ width: '100%', maxWidth: '100%' }}
          >
            <Stack spacing={2.25}>
              {topInventory.map((item) => (
                <Box key={item.id}>
                  <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 0.75 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                        {translateProductName(language, item.productName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatNumber(item.quantityOnHand)} {translateUnit(language, item.unit)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(item.value)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / maxInventoryValue) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 0.5,
                      backgroundColor: alpha(theme.palette.divider, 0.55),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 0.5,
                        backgroundColor: theme.palette.primary.main
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard
            title={t('dashboard.latestSalesInvoices')}
            border
            elevation={0}
            contentSX={{ p: 0, '&:last-child': { pb: 0 } }}
            headerSX={{ py: 1.75 }}
            sx={{ width: '100%', maxWidth: '100%' }}
          >
            <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" aria-label="latest sales invoices">
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell>{t('invoice.invoice')}</TableCell>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell>{t('invoice.customer')}</TableCell>
                    <TableCell align="right">{t('common.total')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedInvoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{translatePartyName(language, invoice.customerName)}</TableCell>
                      <TableCell align="right">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={formatStatus(invoice.paymentStatus)}
                          color={getPaymentChipColor(invoice)}
                          variant="outlined"
                          sx={{ borderRadius: 1, fontWeight: 700 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <MainCard
              title={t('dashboard.criticalStockAlerts')}
              border
              elevation={0}
              contentSX={{ p: 2, '&:last-child': { pb: 2 } }}
              headerSX={{ py: 1.75 }}
              sx={{ width: '100%', maxWidth: '100%' }}
            >
              <Stack spacing={1.5}>
                {lowStockItems.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      p: 1.25,
                      border: `1px solid ${theme.palette.divider}`,
                      borderLeft: `3px solid ${theme.palette.warning.main}`,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.warning.main, 0.05)
                    }}
                  >
                    <ReportProblemOutlinedIcon fontSize="small" sx={{ color: theme.palette.warning.main, mt: 0.25 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                        {translateProductName(language, item.productName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('dashboard.availableReorder', { quantity: item.quantityOnHand, unit: translateUnit(language, item.unit), reorder: item.reorderLevel })}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </MainCard>

            <MainCard
              title={t('dashboard.recentActivity')}
              border
              elevation={0}
              contentSX={{ p: 2, '&:last-child': { pb: 2 } }}
              headerSX={{ py: 1.75 }}
              sx={{ width: '100%', maxWidth: '100%' }}
            >
              <Stack spacing={1.75}>
                {sortedInvoices.slice(0, 3).map((invoice) => (
                  <Stack key={invoice.id} direction="row" spacing={1.5}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'grid',
                        flexShrink: 0,
                        placeItems: 'center',
                        borderRadius: 1,
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      }}
                    >
                      <ReceiptLongOutlinedIcon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                        {t('dashboard.issuedInvoice', { invoice: invoice.invoiceNumber })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {translatePartyName(language, invoice.customerName)} - {formatCurrency(invoice.total)}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
                <Typography variant="caption" color="text.secondary">
                  {t('dashboard.openInvoices', { count: openInvoices.length })}
                </Typography>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </ErpFullWidthPage>
  );
};
