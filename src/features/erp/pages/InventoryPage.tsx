import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { MobileInventory } from '../components/mobile/MobileInventory';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { ErpStatusChip } from '../components/ErpStatusChip';
import { mockInventory, mockProducts } from '../mockData';
import { InventoryItem, Product } from '../types';
import { translateCategory, translateProductName, translateUnit, translateWarehouse } from '../utils/displayTranslations';

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

export const InventoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
  const lowStockItems = inventoryRows.filter((item) => item.stockStatus === 'low_stock');
  const outOfStockItems = inventoryRows.filter((item) => item.stockStatus === 'out_of_stock');

  const summaryCards = [
    { label: t('inventory.totalStockedSkus'), value: formatNumber(inventoryRows.length), tone: theme.palette.primary.main },
    { label: t('dashboard.inventoryValue'), value: formatCurrency(totalInventoryValue), tone: theme.palette.primary.main },
    { label: t('inventory.lowStockItems'), value: formatNumber(lowStockItems.length), tone: theme.palette.warning.main },
    { label: t('inventory.outOfStock'), value: formatNumber(outOfStockItems.length), tone: theme.palette.error.main }
  ];

  if (isMobile) {
    return <MobileInventory />;
  }

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('inventory.title')} subtitle={t('inventory.subtitle')} />

      <Grid container spacing={2} sx={{ mb: 2, width: '100%', maxWidth: '100%' }}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ width: '100%', maxWidth: '100%' }}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  {card.label}
                </Typography>
                <Typography variant="h3">{card.value}</Typography>
                <Box sx={{ width: 40, height: 3, backgroundColor: card.tone, borderRadius: 1 }} />
              </Stack>
            </MainCard>
          </Grid>
        ))}
      </Grid>

      <MainCard border elevation={0} contentSX={{ p: 0, '&:last-child': { pb: 0 } }} sx={{ width: '100%', maxWidth: '100%' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
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
          <Typography variant="body2" color="text.secondary">
            {t('inventory.showingRecords', { shown: formatNumber(filteredRows.length), total: formatNumber(inventoryRows.length) })}
          </Typography>
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" aria-label="inventory table" sx={{ minWidth: 1180 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>{t('inventory.productName')}</TableCell>
                <TableCell>{t('inventory.sku')}</TableCell>
                <TableCell>{t('inventory.warehouseLocation')}</TableCell>
                <TableCell align="right">{t('inventory.quantityOnHand')}</TableCell>
                <TableCell align="right">{t('inventory.reserved')}</TableCell>
                <TableCell align="right">{t('inventory.available')}</TableCell>
                <TableCell align="right">{t('inventory.reorderLevel')}</TableCell>
                <TableCell>{t('common.unit')}</TableCell>
                <TableCell>{t('inventory.stockStatus')}</TableCell>
                <TableCell>{t('inventory.lastRestocked')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((item) => {
                const isCritical = item.stockStatus === 'out_of_stock';
                const isLowStock = item.stockStatus === 'low_stock';
                const progressValue = Math.min((item.quantityOnHand / Math.max(item.reorderLevel, 1)) * 100, 100);

                return (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      backgroundColor: isCritical
                        ? alpha(theme.palette.error.main, 0.06)
                        : isLowStock
                          ? alpha(theme.palette.warning.main, 0.06)
                          : 'inherit',
                      '&:hover': {
                        backgroundColor: isCritical
                          ? alpha(theme.palette.error.main, 0.1)
                          : isLowStock
                            ? alpha(theme.palette.warning.main, 0.1)
                            : undefined
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {translateProductName(language, item.productName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.product?.category ? translateCategory(language, item.product.category) : t('inventory.uncategorized')} - {formatCurrency(item.stockValue)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{item.sku}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{translateWarehouse(language, item.warehouseName)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.warehouseId}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack spacing={0.75} alignItems="flex-end">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatNumber(item.quantityOnHand)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{
                            width: 90,
                            height: 6,
                            borderRadius: 0.5,
                            backgroundColor: alpha(theme.palette.divider, 0.55),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 0.5,
                              backgroundColor: isCritical
                                ? theme.palette.error.main
                                : isLowStock
                                  ? theme.palette.warning.main
                                  : theme.palette.primary.main
                            }
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{formatNumber(item.reservedQuantity)}</TableCell>
                    <TableCell align="right">{formatNumber(item.availableQuantity)}</TableCell>
                    <TableCell align="right">{formatNumber(item.reorderLevel)}</TableCell>
                    <TableCell>{translateUnit(language, item.unit)}</TableCell>
                    <TableCell>
                      <ErpStatusChip status={item.stockStatus} />
                    </TableCell>
                    <TableCell>{formatDate(item.lastRestocked)}</TableCell>
                  </TableRow>
                );
              })}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      {t('inventory.noMatches')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </ErpFullWidthPage>
  );
};
