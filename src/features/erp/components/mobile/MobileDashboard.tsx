import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import FinanceOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { mockFinanceSummary, mockInventory, mockInvoices, mockProducts } from '../../mockData';
import { translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();

  const inventoryValue = useMemo(
    () =>
      mockInventory.reduce((sum, item) => {
        const product = mockProducts.find((candidate) => candidate.id === item.productId);
        return sum + item.quantityOnHand * (product?.salePrice ?? 0);
      }, 0),
    []
  );
  const lowStockItems = mockInventory.filter((item) => item.quantityOnHand <= item.reorderLevel);
  const receivableInvoices = mockInvoices.filter((invoice) => invoice.balanceDue > 0);
  const fulfillmentRate = Math.round(((mockInventory.length - lowStockItems.length) / Math.max(mockInventory.length, 1)) * 100);
  const collectionRate = Math.round(((mockFinanceSummary.revenue - mockFinanceSummary.receivables) / Math.max(mockFinanceSummary.revenue, 1)) * 100);

  const kpis = [
    { label: t('dashboard.revenue'), value: formatCurrency(mockFinanceSummary.revenue), helper: '+12%', tone: theme.palette.primary.main },
    { label: t('dashboard.grossProfit'), value: formatCurrency(mockFinanceSummary.grossProfit), helper: t('dashboard.margin', { value: 32 }), tone: theme.palette.success.main },
    { label: t('dashboard.inventoryValue'), value: formatCurrency(inventoryValue), helper: t('dashboard.stockedSkus', { count: mockInventory.length }), tone: theme.palette.info.main },
    { label: t('dashboard.stockAlerts'), value: `${formatNumber(lowStockItems.length)} ${t('common.unit')}`, helper: t('dashboard.requiresAttention'), tone: theme.palette.error.main }
  ];

  const actions = [
    { label: t('nav.createInvoice'), icon: <NoteAddOutlinedIcon />, path: '/erp/create-invoice', primary: true },
    { label: t('nav.products'), icon: <Inventory2OutlinedIcon />, path: '/erp/products' },
    { label: t('nav.inventory'), icon: <WarehouseOutlinedIcon />, path: '/erp/inventory' },
    { label: t('nav.financeReports'), icon: <FinanceOutlinedIcon />, path: '/erp/finance-reports' }
  ];

  return (
    <MobileShell>
      <Stack spacing={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}>
          {kpis.map((kpi) => (
            <MobileSurface key={kpi.label} sx={{ minHeight: 118 }}>
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: kpi.tone, lineHeight: 1.15 }}>
                  {kpi.value}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: kpi.tone }}>
                  <TrendingUpOutlinedIcon sx={{ fontSize: 15 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    {kpi.helper}
                  </Typography>
                </Stack>
              </Stack>
            </MobileSurface>
          ))}
        </Box>

        <MobileSurface>
          <MobileSectionTitle title={t('dashboard.operationalPerformance')} />
          <Stack spacing={1.5}>
            {[
              { label: t('mobile.fulfillmentRate'), value: fulfillmentRate, color: theme.palette.primary.main },
              { label: t('finance.collectionRate'), value: collectionRate, color: theme.palette.info.main }
            ].map((item) => (
              <Box key={item.label}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    {item.value}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(item.value, 100))}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: alpha(item.color, 0.1),
                    '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 999 }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </MobileSurface>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}>
          {actions.map((action) => (
            <ButtonBase
              key={action.path}
              onClick={() => navigate(action.path)}
              sx={{
                p: 2,
                minHeight: 92,
                borderRadius: 3,
                flexDirection: 'column',
                gap: 1,
                color: action.primary ? theme.palette.primary.contrastText : theme.palette.primary.main,
                bgcolor: action.primary ? theme.palette.primary.main : theme.palette.background.paper,
                border: action.primary ? 'none' : `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 4px rgba(144, 164, 174, 0.16)',
                '&:active': { transform: 'scale(0.98)' }
              }}
            >
              <Box sx={{ display: 'flex', '& svg': { fontSize: 25 } }}>{action.icon}</Box>
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {action.label}
              </Typography>
            </ButtonBase>
          ))}
        </Box>

        <MobileSurface>
          <MobileSectionTitle title={t('dashboard.criticalStockAlerts')} />
          <Stack spacing={1.5}>
            {lowStockItems.slice(0, 3).map((item) => (
              <Stack key={item.id} direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '0 0 auto'
                  }}
                >
                  <WarningAmberOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap>
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
              </Stack>
            ))}
          </Stack>
        </MobileSurface>

        <MobileSurface>
          <MobileSectionTitle title={t('dashboard.latestSalesInvoices')} />
          <Stack spacing={1.5}>
            {mockInvoices.slice(0, 3).map((invoice) => (
              <Stack key={invoice.id} direction="row" justifyContent="space-between" spacing={1.5}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>
                    {invoice.invoiceNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {translatePartyName(language, invoice.customerName)} · {formatDate(invoice.issueDate)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'end', flex: '0 0 auto' }}>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                    {formatCurrency(invoice.total)}
                  </Typography>
                  <Typography variant="caption" color={invoice.balanceDue > 0 ? 'warning.main' : 'success.main'} sx={{ fontWeight: 800 }}>
                    {formatStatus(invoice.paymentStatus)}
                  </Typography>
                </Box>
              </Stack>
            ))}
            {receivableInvoices.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.openInvoices', { count: receivableInvoices.length })}
              </Typography>
            )}
          </Stack>
        </MobileSurface>
      </Stack>
    </MobileShell>
  );
};
