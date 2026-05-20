import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { alpha, useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { ErpStatusChip } from '../components/ErpStatusChip';
import { mockInventory, mockProducts } from '../mockData';
import { ProductCategory, ProductStatus } from '../types';
import { translateCategory, translatePartyName, translateProductName, translateUnit } from '../utils/displayTranslations';

type ProductStatusFilter = ProductStatus | 'all';
type CategoryFilter = ProductCategory | 'all';

const productCategories = Array.from(new Set(mockProducts.map((product) => product.category)));
const productStatuses = Array.from(new Set(mockProducts.map((product) => product.status)));

const getProductInventoryValue = (productId: string, salePrice: number) => {
  const inventoryItem = mockInventory.find((item) => item.productId === productId);
  return (inventoryItem?.quantityOnHand ?? 0) * salePrice;
};

export const ProductsPage = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatNumber, formatStatus } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('all');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          product.name,
          product.sku,
          product.category,
          product.brand,
          product.supplierName,
          translateProductName(language, product),
          translateCategory(language, product.category),
          translatePartyName(language, product.supplierName)
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, language, searchTerm, statusFilter]);

  const totalInventoryValue = mockProducts.reduce((sum, product) => sum + getProductInventoryValue(product.id, product.salePrice), 0);
  const lowStockProducts = mockProducts.filter((product) => product.stockQuantity <= product.reorderLevel || product.status === 'low_stock');

  const summaryCards = [
    { label: t('products.totalProducts'), value: formatNumber(mockProducts.length), tone: theme.palette.primary.main },
    { label: t('products.activeProducts'), value: formatNumber(mockProducts.filter((product) => product.status === 'active').length), tone: theme.palette.success.main },
    { label: t('products.lowStockProducts'), value: formatNumber(lowStockProducts.length), tone: theme.palette.warning.main },
    { label: t('dashboard.inventoryValue'), value: formatCurrency(totalInventoryValue), tone: theme.palette.primary.main }
  ];

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('products.title')} subtitle={t('products.subtitle')} />

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
        >
          <TextField
            fullWidth
            size="small"
            label={t('products.search')}
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
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 190 } }}>
            <InputLabel id="product-category-filter-label">{t('common.category')}</InputLabel>
            <Select
              labelId="product-category-filter-label"
              label={t('common.category')}
              value={categoryFilter}
              onChange={(event: SelectChangeEvent) => setCategoryFilter(event.target.value as CategoryFilter)}
            >
              <MenuItem value="all">{t('common.allCategories')}</MenuItem>
              {productCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {translateCategory(language, category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 } }}>
            <InputLabel id="product-status-filter-label">{t('common.status')}</InputLabel>
            <Select
              labelId="product-status-filter-label"
              label={t('common.status')}
              value={statusFilter}
              onChange={(event: SelectChangeEvent) => setStatusFilter(event.target.value as ProductStatusFilter)}
            >
              <MenuItem value="all">{t('common.allStatuses')}</MenuItem>
              {productStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatStatus(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" aria-label="products table" sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>{t('inventory.sku')}</TableCell>
                <TableCell>{t('products.productName')}</TableCell>
                <TableCell>{t('common.category')}</TableCell>
                <TableCell>{t('products.brandSupplier')}</TableCell>
                <TableCell>{t('common.unit')}</TableCell>
                <TableCell align="right">{t('products.purchasePrice')}</TableCell>
                <TableCell align="right">{t('products.salePrice')}</TableCell>
                <TableCell align="right">{t('invoice.vat')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{product.sku}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {translateProductName(language, product)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('products.stockReorder', { stock: formatNumber(product.stockQuantity), reorder: formatNumber(product.reorderLevel) })}
                    </Typography>
                  </TableCell>
                  <TableCell>{translateCategory(language, product.category)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.brand}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {translatePartyName(language, product.supplierName)}
                    </Typography>
                  </TableCell>
                  <TableCell>{translateUnit(language, product.unit)}</TableCell>
                  <TableCell align="right">{formatCurrency(product.purchasePrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(product.salePrice)}</TableCell>
                  <TableCell align="right">{product.taxRate}%</TableCell>
                  <TableCell>
                    <ErpStatusChip status={product.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      {t('products.noMatches')}
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
