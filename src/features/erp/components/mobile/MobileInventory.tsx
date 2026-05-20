import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpStatusChip } from '../ErpStatusChip';
import { mockInventory, mockProducts } from '../../mockData';
import { InventoryItem, Product } from '../../types';
import { translateCategory, translateProductName, translateUnit, translateWarehouse } from '../../utils/displayTranslations';
import { MobileStatCard } from './MobileStatCard';

type InventoryRow = InventoryItem & {
  product?: Product;
  reservedQuantity: number;
  availableQuantity: number;
  stockValue: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const getInventoryRows = (): InventoryRow[] =>
  mockInventory.map((item) => {
    const product = mockProducts.find((candidate) => candidate.id === item.productId);
    const reservedQuantity = 0;
    const availableQuantity = Math.max(item.quantityOnHand - reservedQuantity, 0);
    const stockStatus = item.quantityOnHand === 0 ? 'out_of_stock' : item.quantityOnHand <= item.reorderLevel ? 'low_stock' : 'in_stock';

    return {
      ...item,
      product,
      reservedQuantity,
      availableQuantity,
      stockValue: item.quantityOnHand * (product?.salePrice ?? 0),
      stockStatus
    };
  });

export const MobileInventory = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatDate, formatNumber } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const inventoryRows = useMemo(() => getInventoryRows(), []);
  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return inventoryRows.filter((item) => {
      if (!normalizedSearch) return true;

      return [
        item.productName,
        item.sku,
        item.warehouseName,
        item.warehouseId,
        item.product?.category ?? '',
        translateProductName(language, item.productName),
        translateWarehouse(language, item.warehouseName),
        translateCategory(language, item.product?.category)
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [inventoryRows, language, searchTerm]);

  const totalInventoryValue = inventoryRows.reduce((sum, item) => sum + item.stockValue, 0);
  const lowStockCount = inventoryRows.filter((item) => item.stockStatus === 'low_stock').length;
  const outOfStockCount = inventoryRows.filter((item) => item.stockStatus === 'out_of_stock').length;

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h2">{t('inventory.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('inventory.subtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25 }}>
          <MobileStatCard label={t('inventory.totalStockedSkus')} value={formatNumber(inventoryRows.length)} accent={theme.palette.primary.main} />
          <MobileStatCard label={t('dashboard.inventoryValue')} value={formatCurrency(totalInventoryValue)} accent={theme.palette.success.main} />
          <MobileStatCard label={t('inventory.lowStockItems')} value={formatNumber(lowStockCount)} accent={theme.palette.warning.main} />
          <MobileStatCard label={t('inventory.outOfStock')} value={formatNumber(outOfStockCount)} accent={theme.palette.error.main} />
        </Box>

        <MainCard border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <TextField
            fullWidth
            size="small"
            label={t('inventory.search')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        </MainCard>

        <Stack spacing={1.25}>
          {filteredRows.map((item) => {
            const isCritical = item.stockStatus === 'out_of_stock';
            const isLowStock = item.stockStatus === 'low_stock';
            const progressValue = Math.min((item.quantityOnHand / Math.max(item.reorderLevel, 1)) * 100, 100);

            return (
              <MainCard
                key={item.id}
                border
                elevation={0}
                contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}
                sx={{
                  backgroundColor: isCritical
                    ? alpha(theme.palette.error.main, 0.05)
                    : isLowStock
                      ? alpha(theme.palette.warning.main, 0.05)
                      : theme.palette.background.paper
                }}
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.25} alignItems="flex-start">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" noWrap>
                        {translateProductName(language, item.productName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.sku}
                      </Typography>
                    </Box>
                    <ErpStatusChip status={item.stockStatus} />
                  </Stack>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {translateWarehouse(language, item.warehouseName)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.product?.category ? translateCategory(language, item.product.category) : t('inventory.uncategorized')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('inventory.quantityOnHand')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatNumber(item.quantityOnHand)} {translateUnit(language, item.unit)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('inventory.available')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatNumber(item.availableQuantity)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('inventory.reorderLevel')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatNumber(item.reorderLevel)}
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 7,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.divider, 0.55),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isCritical
                          ? theme.palette.error.main
                          : isLowStock
                            ? theme.palette.warning.main
                            : theme.palette.primary.main
                      }
                    }}
                  />

                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <Typography variant="caption" color="text.secondary">
                      {t('inventory.lastRestocked')}: {formatDate(item.lastRestocked)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(item.stockValue)}
                    </Typography>
                  </Stack>
                </Stack>
              </MainCard>
            );
          })}
          {filteredRows.length === 0 && (
            <MainCard border elevation={0}>
              <Typography variant="body2" color="text.secondary" align="center">
                {t('inventory.noMatches')}
              </Typography>
            </MainCard>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
