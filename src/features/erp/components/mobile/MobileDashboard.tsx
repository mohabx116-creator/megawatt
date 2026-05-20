import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { translatePartyName, translateProductName } from '../../utils/displayTranslations';
import { mockFinanceSummary, mockInvoices, mockInventory } from '../../mockData';

export const MobileDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatNumber } = useLanguage();

  const lowStockItems = mockInventory.filter((item) => item.quantityOnHand <= item.reorderLevel);
  const unpaidInvoices = mockInvoices.filter((inv) => inv.paymentStatus !== 'paid');

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Top App Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          height: 64,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>M</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            MegaWatt ERP
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton size="small">
            <NotificationsOutlinedIcon />
          </IconButton>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'grey.300', overflow: 'hidden' }}>
            <PersonOutlinedIcon sx={{ mt: 0.5, ml: 0.5, color: 'grey.600' }} />
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* KPI Grid */}
        <Grid container spacing={2}>
          {/* Revenue */}
          <Grid size={{ xs: 6 }}>
            <MainCard content={false} sx={{ p: 2, height: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {t('dashboard.revenue')}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700, color: 'text.primary' }}>
                {formatCurrency(mockFinanceSummary.revenue)}
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 4 }}>
                <TrendingUpOutlinedIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.success.main }}>+12%</Typography>
              </Box>
            </MainCard>
          </Grid>
          {/* Gross Profit */}
          <Grid size={{ xs: 6 }}>
            <MainCard content={false} sx={{ p: 2, height: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {t('dashboard.grossProfit')}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700, color: theme.palette.success.main }}>
                {formatCurrency(mockFinanceSummary.grossProfit)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {t('dashboard.margin', { value: 25 })}
              </Typography>
            </MainCard>
          </Grid>
          {/* Unpaid Invoices */}
          <Grid size={{ xs: 6 }}>
            <MainCard content={false} sx={{ p: 2, height: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {t('dashboard.receivables')}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700, color: theme.palette.error.main }}>
                {formatNumber(unpaidInvoices.length)}
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.error.main }}>{t('common.highRisk')}</Typography>
              </Box>
            </MainCard>
          </Grid>
          {/* Low Stock */}
          <Grid size={{ xs: 6 }}>
            <MainCard content={false} sx={{ p: 2, height: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {t('dashboard.stockAlerts')}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700, color: theme.palette.warning.dark }}>
                {formatNumber(lowStockItems.length)}
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: alpha(theme.palette.warning.main, 0.2), borderRadius: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.warning.dark }}>{t('common.critical')}</Typography>
              </Box>
            </MainCard>
          </Grid>
        </Grid>

        {/* Mini Chart Section */}
        <MainCard content={false} sx={{ mt: 2, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {t('dashboard.salesRevenue')}
            </Typography>
            <IconButton size="small">
              <MoreVertOutlinedIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="flex-end" spacing={0.5} sx={{ height: 120, px: 1 }}>
            {[40, 60, 45, 70, 85, 100, 90].map((val, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${val}%`,
                  bgcolor: i === 5 ? theme.palette.warning.main : alpha(theme.palette.primary.main, val / 100),
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4
                }}
              />
            ))}
          </Stack>
        </MainCard>

        {/* Quick Actions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>
            {t('common.quickActions')}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {[
              { icon: <ReceiptLongOutlinedIcon />, label: t('invoice.invoice'), bg: theme.palette.primary.main, color: 'white', route: '/erp/create-invoice' },
              { icon: <PersonAddOutlinedIcon />, label: t('invoice.customer'), bg: theme.palette.warning.light, color: theme.palette.warning.dark, route: '/erp/dashboard' },
              { icon: <Inventory2OutlinedIcon />, label: t('invoice.product'), bg: alpha(theme.palette.info.main, 0.2), color: theme.palette.info.dark, route: '/erp/products' },
              { icon: <PaymentsOutlinedIcon />, label: t('finance.expenses'), bg: theme.palette.background.paper, color: theme.palette.primary.main, border: true, route: '/erp/finance-reports' }
            ].map((action, i) => (
              <Stack key={i} alignItems="center" spacing={1} sx={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate(action.route)}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: action.bg,
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: action.border ? 1 : 3,
                    border: action.border ? `1px solid ${theme.palette.divider}` : 'none',
                    transition: 'transform 0.2s',
                    '&:active': { transform: 'scale(0.95)' }
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{action.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ mt: 3, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {t('dashboard.recentActivity')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700, cursor: 'pointer' }}>
              {t('common.viewAll')}
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {[
              { title: t('dashboard.issuedInvoice', { invoice: '#1024' }), subtitle: '2 mins ago', icon: <DescriptionOutlinedIcon />, color: theme.palette.warning.main },
              { title: translatePartyName(language as any, 'Schneider Electric Egypt'), subtitle: '45 mins ago', icon: <PersonOutlinedIcon />, color: theme.palette.primary.main },
              { title: translateProductName(language as any, 'Copper Cable 16mm Single Core Red'), subtitle: '1 hour ago', icon: <WarningAmberOutlinedIcon />, color: theme.palette.error.main }
            ].map((activity, i) => (
              <MainCard key={i} content={false} sx={{ p: 2, cursor: 'pointer', '&:active': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(activity.color, 0.1), color: activity.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activity.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{activity.subtitle}</Typography>
                  </Box>
                  <ChevronRightOutlinedIcon sx={{ color: 'text.secondary' }} />
                </Stack>
              </MainCard>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
