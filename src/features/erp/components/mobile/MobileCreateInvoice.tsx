import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CableOutlinedIcon from '@mui/icons-material/CableOutlined';
import SettingsInputComponentOutlinedIcon from '@mui/icons-material/SettingsInputComponentOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { translatePartyName, translateWarehouse, translateProductName } from '../../utils/displayTranslations';
import { mockCustomers } from '../../mockData';

export const MobileCreateInvoice = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [paymentType, setPaymentType] = useState('CASH');

  return (
    <Box sx={{ pb: 12, bgcolor: theme.palette.background.default, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={() => navigate('/erp/dashboard')}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            {t('invoice.title')}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'grey.300', overflow: 'hidden' }} />
        </Stack>
      </Stack>

      <Box sx={{ px: 2, pt: 3, flexGrow: 1 }}>
        {/* Progress Stepper */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, px: 1 }}>
          <Stack alignItems="center" spacing={0.5}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: theme.palette.primary.main, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>1</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>{t('common.info')}</Typography>
          </Stack>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.divider, mx: 1, mb: 2 }} />
          <Stack alignItems="center" spacing={0.5}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: theme.palette.grey[200], color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>2</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('common.review')}</Typography>
          </Stack>
          <Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.divider, mx: 1, mb: 2 }} />
          <Stack alignItems="center" spacing={0.5}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: theme.palette.grey[200], color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>3</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('common.finalize')}</Typography>
          </Stack>
        </Stack>

        {/* Step 1: Info */}
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
              {t('invoice.customer')}
            </Typography>
            <Select
              fullWidth
              value="none"
              size="small"
              IconComponent={ExpandMoreOutlinedIcon}
              sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2 }}
            >
              <MenuItem value="none">Select Customer</MenuItem>
              {mockCustomers.map((c) => (
                <MenuItem key={c.id} value={c.id}>{translatePartyName(language as any, c.name)}</MenuItem>
              ))}
            </Select>
          </Box>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                {t('common.warehouse')}
              </Typography>
              <Select
                fullWidth
                value="main"
                size="small"
                IconComponent={WarehouseOutlinedIcon}
                sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2 }}
              >
                <MenuItem value="main">{translateWarehouse(language as any, 'Cairo Main Warehouse')}</MenuItem>
              </Select>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                {t('invoice.invoiceDate')}
              </Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                value="2023-11-24"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: theme.palette.background.paper, borderRadius: 2 } }}
              />
            </Box>
          </Stack>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
              {t('invoice.paymentTerms')}
            </Typography>
            <Stack direction="row" spacing={1}>
              {['CASH', 'CREDIT', 'PARTIAL'].map((type) => (
                <Button
                  key={type}
                  variant={paymentType === type ? 'contained' : 'outlined'}
                  color={paymentType === type ? 'secondary' : 'inherit'}
                  onClick={() => setPaymentType(type)}
                  sx={{ flex: 1, borderRadius: 2, fontWeight: 700, boxShadow: 'none', border: paymentType !== type ? `1px solid ${theme.palette.divider}` : undefined }}
                >
                  {t(`status.${type.toLowerCase()}` as any) || type}
                </Button>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Step 2 Preview: Items */}
        <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {t('invoice.lineItems')} (3)
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddOutlinedIcon />}
              sx={{ borderRadius: 4, fontWeight: 700, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, boxShadow: 'none' }}
            >
              {t('invoice.addLine')}
            </Button>
          </Stack>

          <Stack spacing={2}>
            {[
              { name: translateProductName(language as any, 'Schneider MCB 32A 3 Pole'), price: 'EGP 1,200', qty: '5 units · 32A Triple Pole', icon: <BoltOutlinedIcon /> },
              { name: translateProductName(language as any, 'Copper Cable 16mm Single Core Red'), price: 'EGP 8,500', qty: '100m · 4-Core 16mm', icon: <CableOutlinedIcon /> },
              { name: translateProductName(language as any, 'LED Flood Light 200W IP65'), price: 'EGP 3,400', qty: '2 units · Type 2 SPD', icon: <SettingsInputComponentOutlinedIcon /> }
            ].map((item, i) => (
              <MainCard key={i} content={false} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ width: 48, height: 48, bgcolor: theme.palette.grey[100], borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.name}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{item.price}</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{item.qty}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1, py: 0.25, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, color: theme.palette.primary.main }}>TAXABLE</Typography>
                      </Box>
                      <DeleteOutlineOutlinedIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                    </Stack>
                  </Box>
                </Stack>
              </MainCard>
            ))}
          </Stack>
        </Box>

        {/* Summary Section */}
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 3 }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('invoice.subtotalBeforeVat')}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>EGP 13,100.00</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('invoice.vat')} (14%)</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>EGP 1,834.00</Typography>
            </Stack>
            <Box sx={{ height: '1px', bgcolor: theme.palette.divider, my: 1 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{t('invoice.grandTotal').toUpperCase()}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>EGP 14,934.00</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Actions */}
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            startIcon={<QrCode2OutlinedIcon />}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {t('invoice.generateInvoice')} & QR
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            sx={{ fontWeight: 700, borderRadius: 2, borderWidth: 2 }}
          >
            {t('status.draft').toUpperCase()}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
