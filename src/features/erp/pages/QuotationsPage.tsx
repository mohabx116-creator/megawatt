import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

import { ErpFullWidthPage } from '../components/ErpFullWidthPage';
import { ErpPageHeader } from '../components/ErpPageHeader';
import { ErpStatusChip } from '../components/ErpStatusChip';
import { MobileQuotations } from '../components/mobile';
import { convertQuotationToInvoiceSnapshot, MEGAWATT_LAST_GENERATED_INVOICE } from '../sales-documents';
import { translatePartyName } from '../utils/displayTranslations';
import { getQuotationListItems } from '../utils/documentListData';

type StatusFilter = 'all' | string;

export const QuotationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatDate, formatNumber } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const quotations = useMemo(() => getQuotationListItems(), []);
  const statuses = useMemo(() => Array.from(new Set(quotations.map((quotation) => quotation.status))), [quotations]);

  const filteredQuotations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return quotations.filter((quotation) => {
      const customerName = quotation.customer?.companyName ?? quotation.customer?.name ?? '';
      const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [quotation.quotationNumber, customerName, translatePartyName(language, customerName), quotation.status].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );

      return matchesStatus && matchesSearch;
    });
  }, [language, quotations, searchTerm, statusFilter]);

  const convertToInvoice = (quotation: (typeof quotations)[number]) => {
    localStorage.setItem(MEGAWATT_LAST_GENERATED_INVOICE, JSON.stringify(convertQuotationToInvoiceSnapshot(quotation)));
    navigate('/erp/print-preview');
  };

  const summaryCards = [
    { label: t('quotations.totalQuotations'), value: formatNumber(quotations.length), tone: theme.palette.primary.main },
    { label: t('quotations.openQuotations'), value: formatNumber(quotations.filter((quotation) => quotation.status !== 'converted').length), tone: theme.palette.warning.main },
    { label: t('quotations.convertedQuotations'), value: formatNumber(quotations.filter((quotation) => quotation.status === 'converted').length), tone: theme.palette.success.main },
    { label: t('common.total'), value: formatCurrency(quotations.reduce((sum, quotation) => sum + quotation.grandTotal, 0)), tone: theme.palette.primary.main }
  ];

  if (isMobile) {
    return <MobileQuotations />;
  }

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('quotations.title')} subtitle={t('quotations.subtitle')} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <MainCard border elevation={0} contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  {card.label}
                </Typography>
                <Typography variant="h3">{card.value}</Typography>
                <Box sx={{ width: 40, height: 3, bgcolor: card.tone, borderRadius: 1 }} />
              </Stack>
            </MainCard>
          </Grid>
        ))}
      </Grid>

      <MainCard border elevation={0} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <TextField
            fullWidth
            size="small"
            label={t('quotations.search')}
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
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 } }}>
            <InputLabel>{t('common.status')}</InputLabel>
            <Select label={t('common.status')} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <MenuItem value="all">{t('common.allStatuses')}</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`quotation.status.${status}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')} sx={{ flex: '0 0 auto' }}>
            {t('quotation.createTitle')}
          </Button>
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 980 }} aria-label="quotations table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>{t('quotation.quotationNumber')}</TableCell>
                <TableCell>{t('invoice.customer')}</TableCell>
                <TableCell>{t('quotation.quotationDate')}</TableCell>
                <TableCell>{t('quotation.validUntil')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="right">{t('invoice.grandTotal')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.map((quotation) => {
                const customerName = quotation.customer?.companyName ?? quotation.customer?.name ?? '';
                return (
                  <TableRow key={quotation.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{quotation.quotationNumber}</TableCell>
                    <TableCell>{translatePartyName(language, customerName)}</TableCell>
                    <TableCell>{formatDate(quotation.quotationDate)}</TableCell>
                    <TableCell>{formatDate(quotation.validUntil)}</TableCell>
                    <TableCell>
                      <ErpStatusChip status={quotation.status} />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(quotation.grandTotal)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />} onClick={() => navigate('/erp/quotation-preview')}>
                          {t('quotation.viewPreview')}
                        </Button>
                        <Button size="small" variant="contained" startIcon={<ReceiptLongOutlinedIcon />} onClick={() => convertToInvoice(quotation)}>
                          {t('quotation.convertToInvoice')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredQuotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                      {t('quotations.noMatches')}
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
