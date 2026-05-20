import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { mockInventory, mockProducts } from '../../mockData';
import { translateProductName, translateWarehouse } from '../../utils/displayTranslations';

export const MobileInventory = () => {
  const theme = useTheme();
  const { t, language, formatNumber, setLanguage } = useLanguage();

  const totalItems = mockInventory.length;
  const lowStockItems = mockInventory.filter((item) => item.quantityOnHand > 0 && item.quantityOnHand <= item.reorderLevel);
  const outOfStockItems = mockInventory.filter((item) => item.quantityOnHand === 0);

  const getProductDetails = (productId: string) => mockProducts.find((p) => p.id === productId);

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
          <Box 
            onClick={() => setLanguage?.(language === 'en' ? 'ar' : 'en')}
            sx={{ cursor: 'pointer', bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.dark, px: 1, py: 0.5, borderRadius: 1 }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{language === 'en' ? 'AR' : 'EN'}</Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* Warehouse Selector */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
            {t('common.warehouse')}
          </Typography>
          <Select
            fullWidth
            value="main"
            size="small"
            IconComponent={ExpandMoreOutlinedIcon}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              fontWeight: 600,
              color: theme.palette.primary.main,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider }
            }}
          >
            <MenuItem value="main">{translateWarehouse(language as any, 'Cairo Main Warehouse')}</MenuItem>
            <MenuItem value="alex">{translateWarehouse(language as any, 'Alexandria Cable Yard')}</MenuItem>
          </Select>
        </Box>

        {/* Summary Cards Grid */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          <MainCard content={false} sx={{ minWidth: 160, flex: 1, p: 2 }}>
            <Inventory2OutlinedIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase' }}>
              {t('inventory.totalStockedSkus')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              {formatNumber(totalItems)}
            </Typography>
          </MainCard>

          <MainCard content={false} sx={{ minWidth: 160, flex: 1, p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderColor: theme.palette.error.main }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
              <WarningAmberOutlinedIcon sx={{ color: theme.palette.error.main }} />
              <Box sx={{ bgcolor: theme.palette.error.main, color: 'white', px: 1, py: 0.25, borderRadius: 4 }}>
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700 }}>{t('common.actions')}</Typography>
              </Box>
            </Stack>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.error.dark, display: 'block', textTransform: 'uppercase' }}>
              {t('inventory.lowStockItems')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
              {formatNumber(lowStockItems.length)} {t('common.unit')}
            </Typography>
          </MainCard>
        </Stack>

        <MainCard content={false} sx={{ mb: 3, bgcolor: alpha(theme.palette.grey[500], 0.1), p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase' }}>
              {t('inventory.outOfStock')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {formatNumber(outOfStockItems.length)} {t('common.unit')}
            </Typography>
          </Box>
          <ErrorOutlineOutlinedIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
        </MainCard>

        {/* Search & Filter Bar */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t('inventory.search')}
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

        {/* Product List */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {t('dashboard.recentActivity')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: theme.palette.primary.main }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{t('common.viewAll')}</Typography>
              <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            {mockInventory.slice(0, 5).map((item) => {
              const product = getProductDetails(item.productId);
              if (!product) return null;

              const isLowStock = item.quantityOnHand <= item.reorderLevel;
              const isOutOfStock = item.quantityOnHand === 0;

              const stockTone = isOutOfStock ? theme.palette.error.main : isLowStock ? theme.palette.error.main : theme.palette.primary.main;

              return (
                <MainCard key={item.id} content={false} sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: 64, height: 64, bgcolor: theme.palette.grey[100], borderRadius: 2, border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Inventory2OutlinedIcon sx={{ color: theme.palette.grey[400] }} />
                      </Box>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            {translateProductName(language as any, product.name)}
                          </Typography>
                          {isLowStock && !isOutOfStock && (
                            <Box sx={{ px: 0.5, py: 0.25, bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, borderRadius: 1 }}>
                              <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: theme.palette.error.main }}>{t('status.low_stock')}</Typography>
                            </Box>
                          )}
                          {isOutOfStock && (
                            <Box sx={{ px: 0.5, py: 0.25, bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, borderRadius: 1 }}>
                              <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: theme.palette.error.main }}>{t('status.out_of_stock')}</Typography>
                            </Box>
                          )}
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                          {item.sku}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'inline-flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: alpha(stockTone, 0.05), border: `1px solid ${alpha(stockTone, 0.1)}`, borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: stockTone }}>
                            {formatNumber(item.quantityOnHand)} {product.unit}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </Stack>
                </MainCard>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* FAB */}
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          bgcolor: theme.palette.secondary.light,
          color: theme.palette.secondary.dark,
          boxShadow: 4,
          zIndex: 40,
          border: '1px solid rgba(255,255,255,0.2)',
          '&:hover': { bgcolor: theme.palette.secondary.main, color: 'white' }
        }}
      >
        <QrCodeScannerOutlinedIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </Box>
  );
};
