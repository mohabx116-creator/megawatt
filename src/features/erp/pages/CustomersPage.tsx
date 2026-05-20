import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
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
import { MobileCustomers } from '../components/mobile';
import { mockCustomers } from '../mockData';
import { Customer } from '../types';
import { translatePartyName } from '../utils/displayTranslations';
import { getInvoiceListItems, getQuotationListItems } from '../utils/documentListData';

export const CustomersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatNumber, formatStatus } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const invoices = useMemo(() => getInvoiceListItems(), []);
  const quotations = useMemo(() => getQuotationListItems(), []);

  const customerStats = useMemo(
    () =>
      new Map(
        mockCustomers.map((customer) => {
          const customerInvoices = invoices.filter((invoice) => invoice.customerId === customer.id || invoice.customerName === customer.companyName);
          const customerQuotations = quotations.filter((quotation) => quotation.customerId === customer.id);
          return [
            customer.id,
            {
              invoiceCount: customerInvoices.length,
              quotationCount: customerQuotations.length,
              receivables: customerInvoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0)
            }
          ];
        })
      ),
    [invoices, quotations]
  );

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockCustomers.filter((customer) => {
      if (!normalizedSearch) return true;
      return [customer.name, customer.companyName, translatePartyName(language, customer.companyName), customer.phone, customer.city, customer.taxRegistrationNumber ?? ''].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [language, searchTerm]);

  const summaryCards = [
    { label: t('customers.totalCustomers'), value: formatNumber(mockCustomers.length), tone: theme.palette.primary.main },
    { label: t('customers.activeCustomers'), value: formatNumber(mockCustomers.filter((customer) => customer.status === 'active').length), tone: theme.palette.success.main },
    { label: t('finance.receivables'), value: formatCurrency(Array.from(customerStats.values()).reduce((sum, item) => sum + item.receivables, 0)), tone: theme.palette.warning.main },
    { label: t('customers.creditHold'), value: formatNumber(mockCustomers.filter((customer) => customer.status === 'credit_hold').length), tone: theme.palette.error.main }
  ];

  if (isMobile) {
    return <MobileCustomers />;
  }

  return (
    <ErpFullWidthPage>
      <ErpPageHeader title={t('customers.title')} subtitle={t('customers.subtitle')} />

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
        <Stack sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            fullWidth
            size="small"
            label={t('customers.search')}
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
        </Stack>

        <TableContainer component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 1080 }} aria-label="customers table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableCell>{t('invoice.customer')}</TableCell>
                <TableCell>{t('invoice.contact')}</TableCell>
                <TableCell>{t('invoice.taxRegistration')}</TableCell>
                <TableCell>{t('invoice.location')}</TableCell>
                <TableCell align="right">{t('finance.receivables')}</TableCell>
                <TableCell align="right">{t('invoices.title')}</TableCell>
                <TableCell align="right">{t('quotations.title')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const stats = customerStats.get(customer.id);
                return (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {translatePartyName(language, customer.companyName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.phone}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{customer.taxRegistrationNumber ?? t('common.notAvailable')}</TableCell>
                    <TableCell>{customer.address}, {customer.city}</TableCell>
                    <TableCell align="right">{formatCurrency(stats?.receivables ?? 0)}</TableCell>
                    <TableCell align="right">{formatNumber(stats?.invoiceCount ?? 0)}</TableCell>
                    <TableCell align="right">{formatNumber(stats?.quotationCount ?? 0)}</TableCell>
                    <TableCell>
                      <ErpStatusChip status={customer.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" startIcon={<VisibilityOutlinedIcon />} onClick={() => setSelectedCustomer(customer)}>
                          {t('mobile.viewDetails')}
                        </Button>
                        <Button size="small" variant="contained" startIcon={<DescriptionOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')}>
                          {t('quotation.createTitle')}
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<ReceiptLongOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')}>
                          {t('invoice.title')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                      {t('customers.noMatches')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      <Dialog open={Boolean(selectedCustomer)} onClose={() => setSelectedCustomer(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t('customers.customerDetails')}</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Stack spacing={1.25} sx={{ mt: 1 }}>
              <Typography variant="h4">{translatePartyName(language, selectedCustomer.companyName)}</Typography>
              <Typography color="text.secondary">{selectedCustomer.name}</Typography>
              <Typography>{t('invoice.contact')}: {selectedCustomer.phone}</Typography>
              <Typography>{t('invoice.location')}: {selectedCustomer.address}, {selectedCustomer.city}</Typography>
              <Typography>{t('invoice.taxRegistration')}: {selectedCustomer.taxRegistrationNumber ?? t('common.notAvailable')}</Typography>
              <Typography>{t('common.status')}: {formatStatus(selectedCustomer.status)}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCustomer(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </ErpFullWidthPage>
  );
};
