import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { mockProducts } from '../../mockData';
import { ProductCategory, ProductStatus } from '../../types';
import { translateCategory, translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';

type ProductStatusFilter = ProductStatus | 'all';
type CategoryFilter = ProductCategory | 'all';

const productCategories = Array.from(new Set(mockProducts.map((product) => product.category)));
const productStatuses = Array.from(new Set(mockProducts.map((product) => product.status)));

export const MobileProducts = () => {
  const theme = useTheme();
  const { t, language, formatCurrency, formatStatus } = useLanguage();
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

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h2">{t('products.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('products.subtitle')}
          </Typography>
        </Box>

        <MainCard border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack spacing={1.25}>
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
            <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="mobile-product-category-filter-label">{t('common.category')}</InputLabel>
                <Select
                  labelId="mobile-product-category-filter-label"
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
              <FormControl size="small" fullWidth>
                <InputLabel id="mobile-product-status-filter-label">{t('common.status')}</InputLabel>
                <Select
                  labelId="mobile-product-status-filter-label"
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
          </Stack>
        </MainCard>

        <Stack spacing={1.25}>
          {filteredProducts.map((product) => (
            <MainCard key={product.id} border elevation={0} contentSX={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Stack spacing={1.25}>
                <Stack direction="row" justifyContent="space-between" spacing={1.25} alignItems="flex-start">
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h4" noWrap>
                      {translateProductName(language, product)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sku}
                    </Typography>
                  </Box>
                  <Chip size="small" label={formatStatus(product.status)} color={product.status === 'active' ? 'success' : product.status === 'out_of_stock' ? 'error' : 'warning'} variant="outlined" />
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('common.category')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {translateCategory(language, product.category)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('common.unit')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {translateUnit(language, product.unit)}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('products.brandSupplier')}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {product.brand} / {translatePartyName(language, product.supplierName)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'end', flexShrink: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('products.salePrice')}
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(product.salePrice)}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {t('products.stockReorder', { stock: product.stockQuantity, reorder: product.reorderLevel })}
                </Typography>
              </Stack>
            </MainCard>
          ))}
          {filteredProducts.length === 0 && (
            <MainCard border elevation={0}>
              <Typography variant="body2" color="text.secondary" align="center">
                {t('products.noMatches')}
              </Typography>
            </MainCard>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
