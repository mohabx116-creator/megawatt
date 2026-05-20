import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

import { ErpStatusChip } from '../ErpStatusChip';
import { translatePartyName } from '../../utils/displayTranslations';
import { getInvoiceListItems } from '../../utils/documentListData';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileInvoices = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatDate, formatNumber, formatStatus } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invoices = useMemo(() => getInvoiceListItems(), []);
  const statuses = useMemo(() => ['all', ...Array.from(new Set(invoices.map((invoice) => invoice.paymentStatus)))], [invoices]);

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

  return (
    <MobileShell title={t('invoices.title')}>
      <Stack spacing={2}>
        <MobileSurface>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {t('invoices.totalInvoices')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {formatNumber(invoices.length)}
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => navigate('/erp/create-invoice')} sx={{ borderRadius: 999 }}>
              {t('invoice.title')}
            </Button>
          </Stack>
        </MobileSurface>

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

        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {statuses.map((status) => (
            <Chip
              key={status}
              label={status === 'all' ? t('common.allStatuses') : formatStatus(status)}
              color={statusFilter === status ? 'primary' : 'default'}
              variant={statusFilter === status ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter(status)}
              sx={{ flex: '0 0 auto', fontWeight: 700 }}
            />
          ))}
        </Stack>

        <Stack spacing={1.5}>
          <MobileSectionTitle title={t('invoices.title')} />
          {filteredInvoices.map((invoice) => (
            <MobileSurface key={invoice.id}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {translatePartyName(language, invoice.customerName)}
                    </Typography>
                  </Box>
                  <ErpStatusChip status={invoice.paymentStatus} />
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1,
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04)
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('invoice.invoiceDate')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {formatDate(invoice.issueDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('invoice.dueDate')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={0.75}>
                  {[
                    [t('common.total'), formatCurrency(invoice.total)],
                    [t('invoice.paidAmount'), formatCurrency(invoice.paidAmount)],
                    [t('invoice.balanceDue'), formatCurrency(invoice.balanceDue)]
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

                <Button fullWidth variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => navigate('/erp/print-preview?type=invoice')}>
                  {t('invoice.viewPrintPreview')}
                </Button>
              </Stack>
            </MobileSurface>
          ))}
          {filteredInvoices.length === 0 && (
            <MobileSurface>
              <Typography color="text.secondary" align="center">
                {t('invoices.noMatches')}
              </Typography>
            </MobileSurface>
          )}
        </Stack>
      </Stack>
    </MobileShell>
  );
};
