import { useMemo, useState } from 'react';

import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { mockInventory, mockProducts } from '../../mockData';
import { InventoryItem } from '../../types';
import { includesTranslatedValue, translateProductName, translateUnit, translateWarehouse } from '../../utils/displayTranslations';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileInventory = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();
  const [warehouse, setWarehouse] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [demoMessage, setDemoMessage] = useState('');

  const warehouses = useMemo(() => Array.from(new Set(mockInventory.map((item) => item.warehouseName))), []);
  const productsById = useMemo(() => new Map(mockProducts.map((product) => [product.id, product])), []);

  const filteredInventory = useMemo(
    () =>
      mockInventory.filter((item) => {
        const product = productsById.get(item.productId);
        const status = item.quantityOnHand === 0 ? 'out_of_stock' : item.quantityOnHand <= item.reorderLevel ? 'low_stock' : 'in_stock';
        const matchesWarehouse = warehouse === 'all' || item.warehouseName === warehouse;
        const matchesSearch = includesTranslatedValue(language, search, [
          item.productName,
          translateProductName(language, item.productName),
          item.sku,
          item.warehouseName,
          translateWarehouse(language, item.warehouseName),
          formatStatus(status),
          product?.category
        ]);

        return matchesWarehouse && matchesSearch;
      }),
    [formatStatus, language, productsById, search, warehouse]
  );

  const inventoryValue = filteredInventory.reduce((sum, item) => {
    const product = productsById.get(item.productId);
    return sum + item.quantityOnHand * (product?.salePrice ?? 0);
  }, 0);
  const lowStockItems = filteredInventory.filter((item) => item.quantityOnHand > 0 && item.quantityOnHand <= item.reorderLevel);
  const outOfStockItems = filteredInventory.filter((item) => item.quantityOnHand === 0);

  const getStatus = (item: InventoryItem) => (item.quantityOnHand === 0 ? 'out_of_stock' : item.quantityOnHand <= item.reorderLevel ? 'low_stock' : 'in_stock');

  return (
    <MobileShell>
      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <Select value={warehouse} onChange={(event) => setWarehouse(event.target.value)} displayEmpty sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <MenuItem value="all">{t('common.all')} - {t('common.warehouse')}</MenuItem>
            {warehouses.map((item) => (
              <MenuItem key={item} value={item}>
                {translateWarehouse(language, item)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 0.25, '&::-webkit-scrollbar': { display: 'none' } }}>
          {[
            { label: t('inventory.totalStockedSkus'), value: formatNumber(filteredInventory.length), icon: <Inventory2OutlinedIcon />, color: theme.palette.primary.main },
            { label: t('common.total'), value: formatCurrency(inventoryValue), icon: <WarehouseOutlinedIcon />, color: theme.palette.info.main },
            { label: t('inventory.lowStockItems'), value: formatNumber(lowStockItems.length), icon: <WarningAmberOutlinedIcon />, color: theme.palette.warning.dark },
            { label: t('inventory.outOfStock'), value: formatNumber(outOfStockItems.length), icon: <ErrorOutlineOutlinedIcon />, color: theme.palette.error.main }
          ].map((card) => (
            <MobileSurface key={card.label} sx={{ minWidth: 144 }}>
              <Stack spacing={0.75}>
                <Box sx={{ color: card.color, display: 'flex' }}>{card.icon}</Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: card.color }}>
                  {card.value}
                </Typography>
              </Stack>
            </MobileSurface>
          ))}
        </Stack>

        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('inventory.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 2 } }}
        />

        <MobileSectionTitle title={t('inventory.productName')} action={<Typography variant="caption" color="text.secondary">{t('inventory.showingRecords', { shown: filteredInventory.length, total: mockInventory.length })}</Typography>} />

        <Stack spacing={1.5}>
          {filteredInventory.map((item) => {
            const product = productsById.get(item.productId);
            const availableQuantity = Math.max(item.quantityOnHand - Math.round(item.quantityOnHand * 0.08), 0);
            const status = getStatus(item);
            const color = status === 'out_of_stock' ? theme.palette.error.main : status === 'low_stock' ? theme.palette.warning.dark : theme.palette.success.main;
            const progress = Math.min((item.quantityOnHand / Math.max(item.reorderLevel * 2, 1)) * 100, 100);

            return (
              <MobileSurface key={item.id}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 900 }} noWrap>
                        {translateProductName(language, item.productName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.sku} · {translateWarehouse(language, item.warehouseName)}
                      </Typography>
                    </Box>
                    <Box sx={{ px: 1, py: 0.5, borderRadius: 999, bgcolor: alpha(color, 0.08), color, border: `1px solid ${alpha(color, 0.35)}` }}>
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        {formatStatus(status)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}`, py: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t('common.total')}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{formatNumber(item.quantityOnHand)}</Typography>
                    </Box>
                    <Box sx={{ px: 1, borderInlineStart: `1px solid ${theme.palette.divider}`, borderInlineEnd: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="caption" color="text.secondary">{t('inventory.reorderLevel')}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{formatNumber(item.reorderLevel)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'end' }}>
                      <Typography variant="caption" color="text.secondary">{t('inventory.available')}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>{formatNumber(availableQuantity)}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                      <Typography variant="caption" color="text.secondary">{t('mobile.stockLevel')}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {formatNumber(item.quantityOnHand)} / {formatNumber(item.reorderLevel)} {translateUnit(language, item.unit)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 6, borderRadius: 999, bgcolor: alpha(color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 999 } }}
                    />
                  </Box>

                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => setSelectedItem(item)}>
                      {t('mobile.viewDetails')}
                    </Button>
                    <Button size="small" variant="contained" onClick={() => setDemoMessage(t('mobile.restockMessage'))}>
                      {t('mobile.restockNow')}
                    </Button>
                  </Stack>
                </Stack>
              </MobileSurface>
            );
          })}
          {filteredInventory.length === 0 && <MobileSurface>{t('inventory.noMatches')}</MobileSurface>}
        </Stack>
      </Stack>

      <Fab
        color="primary"
        onClick={() => setDemoMessage(t('mobile.scannerMessage'))}
        sx={{ position: 'fixed', right: 18, bottom: 'calc(86px + env(safe-area-inset-bottom))', zIndex: 40 }}
        aria-label={t('mobile.scanItem')}
      >
        <QrCodeScannerOutlinedIcon />
      </Fab>

      <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} fullWidth maxWidth="xs">
        <DialogTitle>{t('mobile.inventoryDetails')}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ fontWeight: 900 }}>
                {translateProductName(language, selectedItem.productName)}
              </Typography>
              <Typography variant="body2">{t('inventory.sku')}: {selectedItem.sku}</Typography>
              <Typography variant="body2">{t('common.warehouse')}: {translateWarehouse(language, selectedItem.warehouseName)}</Typography>
              <Typography variant="body2">{t('inventory.quantityOnHand')}: {formatNumber(selectedItem.quantityOnHand)} {translateUnit(language, selectedItem.unit)}</Typography>
              <Typography variant="body2">{t('inventory.lastRestocked')}: {formatDate(selectedItem.lastRestocked)}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(demoMessage)} onClose={() => setDemoMessage('')} fullWidth maxWidth="xs">
        <DialogTitle>{t('common.actions')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {demoMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemoMessage('')}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </MobileShell>
  );
};
