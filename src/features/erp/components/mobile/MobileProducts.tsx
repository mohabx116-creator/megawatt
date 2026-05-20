import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { mockInventory, mockProducts } from '../../mockData';
import { Product } from '../../types';
import { includesTranslatedValue, translateCategory, translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileProducts = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatNumber, formatStatus } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);

  const categories = useMemo(() => Array.from(new Set(mockProducts.map((product) => product.category))), []);
  const inventoryByProduct = useMemo(() => new Map(mockInventory.map((item) => [item.productId, item])), []);

  const filteredProducts = useMemo(
    () =>
      mockProducts.filter((product) => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = includesTranslatedValue(language, search, [
          product.name,
          translateProductName(language, product.name),
          product.sku,
          product.category,
          translateCategory(language, product.category),
          product.brand,
          product.supplierName
        ]);

        return matchesCategory && matchesSearch;
      }),
    [category, language, search]
  );

  const getStockStatus = (product: Product) => {
    const item = inventoryByProduct.get(product.id);
    if (!item || item.quantityOnHand === 0) return 'out_of_stock';
    if (item.quantityOnHand <= item.reorderLevel) return 'low_stock';
    return product.status === 'active' ? 'in_stock' : product.status;
  };

  const showDemoAction = (title: string) =>
    setDialog({
      title,
      message: t('mobile.demoActionMessage')
    });

  return (
    <MobileShell>
      <Stack spacing={2}>
        <MobileSurface sx={{ position: 'sticky', top: 72, zIndex: 10 }}>
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('products.search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.25, '&::-webkit-scrollbar': { display: 'none' } }}>
            <Chip
              label={t('common.all')}
              onClick={() => setCategory('all')}
              color={category === 'all' ? 'primary' : 'default'}
              variant={category === 'all' ? 'filled' : 'outlined'}
            />
            {categories.map((item) => (
              <Chip
                key={item}
                label={translateCategory(language, item)}
                onClick={() => setCategory(item)}
                color={category === item ? 'primary' : 'default'}
                variant={category === item ? 'filled' : 'outlined'}
              />
            ))}
            <Chip icon={<TuneOutlinedIcon />} label={t('common.filter')} variant="outlined" onClick={() => showDemoAction(t('common.filter'))} />
          </Stack>
        </MobileSurface>

        <MobileSectionTitle
          title={`${t('products.title')} (${formatNumber(filteredProducts.length)})`}
          action={
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {t('inventory.totalStockedSkus')}: {formatNumber(mockInventory.length)}
            </Typography>
          }
        />

        <Stack spacing={1.5}>
          {filteredProducts.map((product) => {
            const inventory = inventoryByProduct.get(product.id);
            const status = getStockStatus(product);
            const statusColor = status === 'out_of_stock' ? theme.palette.error.main : status === 'low_stock' ? theme.palette.warning.dark : theme.palette.success.main;

            return (
              <MobileSurface key={product.id}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.25}>
                    <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: '0 0 auto'
                        }}
                      >
                        <Inventory2OutlinedIcon />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
                          {product.sku}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 900 }} noWrap>
                          {translateProductName(language, product.name)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        border: `1px solid ${alpha(statusColor, 0.45)}`,
                        bgcolor: alpha(statusColor, 0.08),
                        color: statusColor,
                        flex: '0 0 auto'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        {formatStatus(status)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', rowGap: 1, columnGap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('common.category')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {translateCategory(language, product.category)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'end' }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('products.salePrice')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                        {formatCurrency(product.salePrice)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('common.supplier')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                        {translatePartyName(language, product.supplierName)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'end' }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('inventory.quantityOnHand')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>
                        {formatNumber(inventory?.quantityOnHand ?? product.stockQuantity)} {translateUnit(language, product.unit)}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button size="small" variant="outlined" onClick={() => showDemoAction(t('mobile.adjustStock'))}>
                      {t('mobile.adjustStock')}
                    </Button>
                    <Button size="small" variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => showDemoAction(t('mobile.editDetails'))}>
                      {t('mobile.editDetails')}
                    </Button>
                  </Stack>
                </Stack>
              </MobileSurface>
            );
          })}
          {filteredProducts.length === 0 && <MobileSurface>{t('products.noMatches')}</MobileSurface>}
        </Stack>
      </Stack>

      <Fab
        color="primary"
        onClick={() => navigate('/erp/create-invoice')}
        sx={{ position: 'fixed', right: 18, bottom: 'calc(86px + env(safe-area-inset-bottom))', zIndex: 40 }}
        aria-label={t('nav.createInvoice')}
      >
        <AddOutlinedIcon />
      </Fab>

      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>{dialog?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {dialog?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </MobileShell>
  );
};
