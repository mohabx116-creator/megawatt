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

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { ErpStatusChip } from '../components/ErpStatusChip';
import { mockInventory, mockProducts } from '../mockData';
import { ProductCategory, ProductStatus } from '../types';
import { formatEgp, formatLabel, formatNumber } from '../utils/formatters';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('all');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.sku, product.category, product.brand, product.supplierName].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, searchTerm, statusFilter]);

  const totalInventoryValue = mockProducts.reduce((sum, product) => sum + getProductInventoryValue(product.id, product.salePrice), 0);
  const lowStockProducts = mockProducts.filter((product) => product.stockQuantity <= product.reorderLevel || product.status === 'low_stock');

  const summaryCards = [
    { label: 'Total Products', value: formatNumber(mockProducts.length), tone: theme.palette.primary.main },
    { label: 'Active Products', value: formatNumber(mockProducts.filter((product) => product.status === 'active').length), tone: theme.palette.success.main },
    { label: 'Low Stock Products', value: formatNumber(lowStockProducts.length), tone: theme.palette.warning.main },
    { label: 'Inventory Value', value: formatEgp(totalInventoryValue), tone: theme.palette.primary.main }
  ];

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title="Products" subtitle="Manage Megawatt electrical supplies catalog" />

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
            label="Search products"
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
            <InputLabel id="product-category-filter-label">Category</InputLabel>
            <Select
              labelId="product-category-filter-label"
              label="Category"
              value={categoryFilter}
              onChange={(event: SelectChangeEvent) => setCategoryFilter(event.target.value as CategoryFilter)}
            >
              <MenuItem value="all">All categories</MenuItem>
              {productCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 } }}>
            <InputLabel id="product-status-filter-label">Status</InputLabel>
            <Select
              labelId="product-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(event: SelectChangeEvent) => setStatusFilter(event.target.value as ProductStatusFilter)}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {productStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" aria-label="products table" sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>SKU</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand / Supplier</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Purchase Price</TableCell>
                <TableCell align="right">Sale Price</TableCell>
                <TableCell align="right">VAT</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{product.sku}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock {formatNumber(product.stockQuantity)} / reorder {formatNumber(product.reorderLevel)}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.brand}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.supplierName}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell align="right">{formatEgp(product.purchasePrice)}</TableCell>
                  <TableCell align="right">{formatEgp(product.salePrice)}</TableCell>
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
                      No products match the current filters.
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
