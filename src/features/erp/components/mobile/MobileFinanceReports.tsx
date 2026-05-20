import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { mockFinanceSummary, mockInvoices } from '../../mockData';

export const MobileFinanceReports = () => {
  const theme = useTheme();
  const { t, formatCurrency, formatDate, formatStatus, formatNumber } = useLanguage();

  const sortedInvoices = [...mockInvoices].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );

  return (
    <Box sx={{ pb: 10, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
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
              borderRadius: '50%',
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
        <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
          <AnalyticsOutlinedIcon />
        </IconButton>
      </Stack>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* Search & Actions */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t('common.search') || 'Search'}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: theme.palette.background.paper }
              }
            }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Chip
              icon={<CalendarTodayOutlinedIcon fontSize="small" />}
              label={t('common.date')}
              sx={{ bgcolor: theme.palette.primary.main, color: 'white', fontWeight: 700, '& .MuiChip-icon': { color: 'white' } }}
            />
            <Chip
              icon={<FilterListOutlinedIcon fontSize="small" />}
              label={t('common.status')}
              variant="outlined"
              sx={{ bgcolor: theme.palette.background.paper, fontWeight: 700 }}
            />
            <Chip
              icon={<PaymentsOutlinedIcon fontSize="small" />}
              label={t('invoice.paymentStatus')}
              variant="outlined"
              sx={{ bgcolor: theme.palette.background.paper, fontWeight: 700 }}
            />
          </Stack>
        </Box>

        {/* Stats Overview */}
        <MainCard content={false} sx={{ mb: 3, p: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
            {t('finance.profitabilitySummary')}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              84%
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 0.5 }}>
              {formatCurrency(mockFinanceSummary.revenue)} / {formatCurrency(mockFinanceSummary.revenue * 1.2)}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 8, bgcolor: theme.palette.grey[200], borderRadius: 4, mt: 2, overflow: 'hidden' }}>
            <Box sx={{ width: '84%', height: '100%', bgcolor: theme.palette.primary.main }} />
          </Box>
        </MainCard>

        {/* Invoice List */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>
              {t('finance.recentInvoices')}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {t('common.viewAll')}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            {sortedInvoices.map((invoice) => {
              const getPaymentTone = () => {
                if (invoice.paymentStatus === 'paid') return theme.palette.success.main;
                if (invoice.paymentStatus === 'partially_paid') return theme.palette.warning.main;
                return theme.palette.error.main;
              };
              const tone = getPaymentTone();

              return (
                <MainCard key={invoice.id} content={false} sx={{ p: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        #{invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                        {invoice.customerName}
                      </Typography>
                    </Box>
                    <Box sx={{ px: 1, py: 0.5, bgcolor: alpha(tone, 0.1), borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: tone, fontSize: 10, textTransform: 'uppercase' }}>
                        {formatStatus(invoice.paymentStatus)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Grid container spacing={1} sx={{ py: 1.5, borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{t('common.total')}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {formatNumber(invoice.total)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{t('invoice.paidAmount')}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                        {formatNumber(invoice.total - invoice.balanceDue)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{t('invoice.balanceDue')}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: invoice.balanceDue > 0 ? theme.palette.error.main : 'text.disabled' }}>
                        {formatNumber(invoice.balanceDue)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                      <ScheduleOutlinedIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{formatDate(invoice.issueDate)}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: theme.palette.primary.main }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{t('common.viewAll')}</Typography>
                      <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
                    </Stack>
                  </Stack>
                </MainCard>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
