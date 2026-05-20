import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useLanguage } from 'i18n';

import { ErpStatusChip } from '../ErpStatusChip';
import { mockCustomers } from '../../mockData';
import { Customer } from '../../types';
import { translatePartyName } from '../../utils/displayTranslations';
import { getInvoiceListItems, getQuotationListItems } from '../../utils/documentListData';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileCustomers = () => {
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

  return (
    <MobileShell title={t('customers.title')}>
      <Stack spacing={2}>
        <MobileSurface>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {t('customers.totalCustomers')}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              {formatNumber(mockCustomers.length)}
            </Typography>
          </Stack>
        </MobileSurface>

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

        <Stack spacing={1.5}>
          <MobileSectionTitle title={t('customers.title')} />
          {filteredCustomers.map((customer) => {
            const stats = customerStats.get(customer.id);

            return (
              <MobileSurface key={customer.id}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Stack sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }} noWrap>
                        {translatePartyName(language, customer.companyName)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {customer.name}
                      </Typography>
                    </Stack>
                    <ErpStatusChip status={customer.status} />
                  </Stack>

                  <Stack spacing={0.75}>
                    <Typography variant="body2">{customer.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.address}, {customer.city}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.75}>
                    {[
                      [t('finance.receivables'), formatCurrency(stats?.receivables ?? 0)],
                      [t('invoices.title'), formatNumber(stats?.invoiceCount ?? 0)],
                      [t('quotations.title'), formatNumber(stats?.quotationCount ?? 0)]
                    ].map(([label, value]) => (
                      <Stack key={label} direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          {label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>
                          {value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="outlined" startIcon={<VisibilityOutlinedIcon />} onClick={() => setSelectedCustomer(customer)}>
                      {t('mobile.viewDetails')}
                    </Button>
                    <Button fullWidth variant="contained" startIcon={<DescriptionOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')}>
                      {t('quotation.createTitle')}
                    </Button>
                  </Stack>
                  <Button fullWidth variant="outlined" startIcon={<ReceiptLongOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')}>
                    {t('invoice.title')}
                  </Button>
                </Stack>
              </MobileSurface>
            );
          })}
          {filteredCustomers.length === 0 && (
            <MobileSurface>
              <Typography color="text.secondary" align="center">
                {t('customers.noMatches')}
              </Typography>
            </MobileSurface>
          )}
        </Stack>

        <Dialog open={Boolean(selectedCustomer)} onClose={() => setSelectedCustomer(null)} fullWidth>
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
      </Stack>
    </MobileShell>
  );
};
