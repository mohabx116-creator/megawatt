import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

import { useLanguage } from 'i18n';
import { mockProducts, mockInventory } from '../../mockData';

export const MobileProducts = () => {
  const theme = useTheme();
  const { t, formatCurrency, formatNumber } = useLanguage();

  return (
    <Box sx={{ pb: 12, bgcolor: theme.palette.background.default, minHeight: '100vh', position: 'relative' }}>
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
            <SearchOutlinedIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* Search & Filter Bar */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder={t('dashboard.search')}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.5) }
              }
            }}
          />
          <IconButton sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <FilterListOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip label="All" sx={{ bgcolor: theme.palette.primary.main, color: 'white', fontWeight: 700 }} />
          <Chip label="Electrical" variant="outlined" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 700 }} />
          <Chip label="Safety" variant="outlined" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 700 }} />
          <Chip label="Tools" variant="outlined" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 700 }} />
        </Stack>

        {/* Product List */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 2, textTransform: 'uppercase' }}>
            {t('products.title')} ({formatNumber(mockProducts.length)})
          </Typography>

          <Stack spacing={1.5}>
            {mockProducts.slice(0, 10).map((product) => {
              const stockStatus = product.status;
              let tone = theme.palette.primary.main;
              let icon = <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />;
              
              if (stockStatus === 'low_stock') {
                tone = theme.palette.warning.dark;
                icon = <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} />;
              } else if (stockStatus === 'discontinued') {
                tone = theme.palette.error.main;
              }

              return (
                <Box
                  key={product.id}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 1.5,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: 64, height: 64, bgcolor: theme.palette.grey[100], borderRadius: 2, border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <CategoryOutlinedIcon sx={{ color: theme.palette.grey[400] }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          {product.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {product.sku}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>•</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {product.category}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {formatCurrency(product.salePrice)}
                          </Typography>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: alpha(tone, 0.1), border: `1px solid ${alpha(tone, 0.2)}`, borderRadius: 1 }}>
                            {icon}
                            <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: tone, textTransform: 'uppercase' }}>
                              {stockStatus.replace('_', ' ')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
