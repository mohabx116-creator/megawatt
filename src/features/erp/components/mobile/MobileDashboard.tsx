import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { mockFinanceSummary, mockInventory, mockInvoices, mockProducts } from '../../mockData';
import { translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';
import { MobileStatCard } from './MobileStatCard';

const sortedInvoices = [...mockInvoices].sort(
  (first, second) => new Date(second.issueDate).getTime() - new Date(first.issueDate).getTime()
);

export const MobileDashboard = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();

  const lowStockItems = mockInventory.filter((item) => item.quantityOnHand <= item.reorderLevel).slice(0, 3);
  const inventoryValue = mockInventory.reduce((sum, item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
    return sum + item.quantityOnHand * (product?.salePrice ?? 0);
  }, 0);

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

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h2">{t('dashboard.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.subtitle', { period: mockFinanceSummary.period })}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 1.25
          }}
        >
          <MobileStatCard label={t('dashboard.revenue')} value={formatCurrency(mockFinanceSummary.revenue)} accent={theme.palette.primary.main} />
          <MobileStatCard label={t('dashboard.netProfit')} value={formatCurrency(mockFinanceSummary.netProfit)} accent={theme.palette.error.main} />
          <MobileStatCard label={t('dashboard.inventoryValue')} value={formatCurrency(inventoryValue)} accent={theme.palette.success.main} />
          <MobileStatCard label={t('dashboard.stockAlerts')} value={formatNumber(lowStockItems.length)} accent={theme.palette.warning.main} />
        </Box>

        <MainCard title={t('dashboard.criticalStockAlerts')} border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.25}>
            {lowStockItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.25,
                  borderRadius: 1.5,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.warning.main, 0.06)
                }}
              >
                <Stack direction="row" spacing={1.25} justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                      {translateProductName(language, item.productName)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('dashboard.availableReorder', {
                        quantity: formatNumber(item.quantityOnHand),
                        unit: translateUnit(language, item.unit),
                        reorder: formatNumber(item.reorderLevel)
                      })}
                    </Typography>
                  </Box>
                  <Chip size="small" color={item.quantityOnHand === 0 ? 'error' : 'warning'} variant="outlined" label={formatStatus(item.quantityOnHand === 0 ? 'out_of_stock' : 'low_stock')} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </MainCard>

        <MainCard title={t('dashboard.topInventory')} border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.5}>
            {topInventory.map((item) => (
              <Box key={item.id}>
                <Stack direction="row" justifyContent="space-between" spacing={1.5} sx={{ mb: 0.75 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                      {translateProductName(language, item.productName)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(item.quantityOnHand)} {translateUnit(language, item.unit)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(item.value)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / maxInventoryValue) * 100}
                  sx={{
                    height: 7,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.divider, 0.55)
                  }}
                />
              </Box>
            ))}
          </Stack>
        </MainCard>

        <MainCard title={t('dashboard.latestSalesInvoices')} border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.25}>
            {sortedInvoices.slice(0, 3).map((invoice) => (
              <Box key={invoice.id} sx={{ p: 1.25, borderRadius: 1.5, border: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {translatePartyName(language, invoice.customerName)} - {formatDate(invoice.issueDate)}
                    </Typography>
                  </Box>
                  <Stack spacing={0.75} alignItems="flex-end">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(invoice.total)}
                    </Typography>
                    <Chip size="small" label={formatStatus(invoice.paymentStatus)} color={invoice.paymentStatus === 'paid' ? 'success' : invoice.paymentStatus === 'unpaid' ? 'error' : 'warning'} variant="outlined" />
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </MainCard>
      </Stack>
    </Box>
  );
};
