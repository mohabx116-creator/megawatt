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

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { mockDashboardMetrics, mockFinanceSummary, mockInventory, mockInvoices, mockProducts } from '../mockData';
import { Invoice } from '../types';
import { formatDate, formatEgp, formatLabel } from '../utils/formatters';

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
      title: 'الإيرادات',
      value: formatEgp(mockFinanceSummary.revenue),
      trend: revenueMetric?.trendPercent,
      trendLabel: revenueMetric ? 'مقارنة بالشهر السابق' : mockFinanceSummary.period,
      icon: AssessmentOutlinedIcon,
      accent: 'primary'
    },
    {
      title: 'مجمل الربح',
      value: formatEgp(mockFinanceSummary.grossProfit),
      trend: marginMetric?.trendPercent,
      trendLabel: `${marginMetric?.value ?? 0}% هامش ربح`,
      icon: TrendingUpOutlinedIcon,
      accent: 'success'
    },
    {
      title: 'المصروفات',
      value: formatEgp(mockFinanceSummary.expenses),
      trend: -3.4,
      trendLabel: 'مصروفات تشغيلية تحت المتابعة',
      icon: TrendingDownOutlinedIcon,
      accent: 'warning'
    },
    {
      title: 'مستحقات العملاء',
      value: formatEgp(mockFinanceSummary.receivables),
      trend: receivablesMetric?.trendPercent,
      trendLabel: receivablesMetric ? 'مقارنة بالشهر السابق' : 'أرصدة عملاء مفتوحة',
      icon: AccountBalanceWalletOutlinedIcon,
      accent: 'warning'
    },
    {
      title: 'قيمة المخزون',
      value: formatEgp(totalInventoryValue),
      trend: undefined,
      trendLabel: `${mockInventory.length} أكواد مخزنة`,
      icon: Inventory2OutlinedIcon,
      accent: 'primary'
    },
    {
      title: 'تنبيهات المخزون',
      value: String(lowStockMetric?.value ?? lowStockItems.length),
      trend: lowStockMetric?.trendPercent,
      trendLabel: lowStockMetric ? 'يتطلب متابعة' : 'يتطلب إعادة طلب',
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
      <ErpPageHeader title="لوحة تحكم Megawatt" subtitle={`ملخص المبيعات والمخزون والمالية عن ${mockFinanceSummary.period}`} />

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
            title="الأداء التشغيلي"
            border
            elevation={0}
            contentSX={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
            headerSX={{ py: 1.75 }}
            sx={{ width: '100%', maxWidth: '100%' }}
          >
            <Stack spacing={2.5}>
              {[
                { label: 'إيرادات المبيعات', value: mockFinanceSummary.revenue, color: theme.palette.primary.main },
                { label: 'تكلفة البضاعة', value: mockFinanceSummary.cost, color: theme.palette.grey[600] },
                { label: 'المصروفات التشغيلية', value: mockFinanceSummary.expenses, color: theme.palette.warning.main },
                {
                  label: 'صافي الربح',
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
                        {formatEgp(item.value)}
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
            title="أعلى المخزون"
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
                        {item.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.quantityOnHand.toLocaleString('en-EG')} {item.unit}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatEgp(item.value)}
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
            title="أحدث فواتير المبيعات"
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
                    <TableCell>الفاتورة</TableCell>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>العميل</TableCell>
                    <TableCell align="right">الإجمالي</TableCell>
                    <TableCell>الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedInvoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell align="right">{formatEgp(invoice.total)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={formatLabel(invoice.paymentStatus)}
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
              title="تنبيهات المخزون الحرجة"
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
                        {item.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المتاح {item.quantityOnHand} {item.unit}، حد إعادة الطلب {item.reorderLevel}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </MainCard>

            <MainCard
              title="النشاط الأخير"
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
                        تم إصدار {invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.customerName} - {formatEgp(invoice.total)}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
                <Typography variant="caption" color="text.secondary">
                  يوجد {openInvoices.length} فواتير بها مبالغ متبقية حاليًا.
                </Typography>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </ErpFullWidthPage>
  );
};
