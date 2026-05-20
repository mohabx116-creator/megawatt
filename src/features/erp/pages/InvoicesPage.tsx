import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
import { MobileInvoices } from '../components/mobile';
import { translatePartyName } from '../utils/displayTranslations';
import { getInvoiceListItems } from '../utils/documentListData';

type StatusFilter = 'all' | string;

export const InvoicesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const invoices = useMemo(() => getInvoiceListItems(), []);
  const statuses = useMemo(() => Array.from(new Set(invoices.map((invoice) => invoice.paymentStatus))), [invoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [invoice.invoiceNumber, invoice.customerName, translatePartyName(language, invoice.customerName), invoice.paymentStatus].some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );

      return matchesStatus && matchesSearch;
    });
  }, [invoices, language, searchTerm, statusFilter]);

  const summaryCards = [
    { label: t('invoices.totalInvoices'), value: formatNumber(invoices.length), tone: theme.palette.primary.main },
    { label: t('status.paid'), value: formatNumber(invoices.filter((invoice) => invoice.paymentStatus === 'paid').length), tone: theme.palette.success.main },
    { label: t('status.unpaid'), value: formatNumber(invoices.filter((invoice) => invoice.paymentStatus === 'unpaid').length), tone: theme.palette.error.main },
    { label: t('finance.outstandingBalance'), value: formatCurrency(invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0)), tone: theme.palette.warning.main }
  ];

  if (isMobile) {
    return <MobileInvoices />;
  }

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('invoices.title')} subtitle={t('invoices.subtitle')} />

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
            label={t('invoices.search')}
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
            <InputLabel>{t('invoice.paymentStatus')}</InputLabel>
            <Select label={t('invoice.paymentStatus')} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <MenuItem value="all">{t('common.allStatuses')}</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatStatus(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')} sx={{ flex: '0 0 auto' }}>
            {t('invoice.title')}
          </Button>
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 1080 }} aria-label="invoices table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>{t('print.invoiceNumber')}</TableCell>
                <TableCell>{t('invoice.customer')}</TableCell>
                <TableCell>{t('invoice.invoiceDate')}</TableCell>
                <TableCell>{t('invoice.dueDate')}</TableCell>
                <TableCell>{t('invoice.paymentStatus')}</TableCell>
                <TableCell align="right">{t('common.total')}</TableCell>
                <TableCell align="right">{t('invoice.paidAmount')}</TableCell>
                <TableCell align="right">{t('invoice.balanceDue')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{translatePartyName(language, invoice.customerName)}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <ErpStatusChip status={invoice.paymentStatus} />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell align="right">{formatCurrency(invoice.paidAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(invoice.balanceDue)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => navigate('/erp/print-preview?type=invoice')}>
                      {t('invoice.viewPrintPreview')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                      {t('invoices.noMatches')}
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
