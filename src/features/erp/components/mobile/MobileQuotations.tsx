import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
import { convertQuotationToInvoiceSnapshot, MEGAWATT_LAST_GENERATED_INVOICE } from '../../sales-documents';
import { translatePartyName } from '../../utils/displayTranslations';
import { getQuotationListItems } from '../../utils/documentListData';
import { MobileSectionTitle, MobileShell, MobileSurface } from './MobileShell';

export const MobileQuotations = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, language, formatCurrency, formatDate, formatNumber } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const quotations = useMemo(() => getQuotationListItems(), []);
  const statuses = useMemo(() => ['all', ...Array.from(new Set(quotations.map((quotation) => quotation.status)))], [quotations]);

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
    navigate('/erp/print-preview?type=invoice');
  };

  return (
    <MobileShell title={t('quotations.title')}>
      <Stack spacing={2}>
        <MobileSurface>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {t('quotations.totalQuotations')}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {formatNumber(quotations.length)}
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => navigate('/erp/create-quotation')} sx={{ borderRadius: 999 }}>
              {t('quotation.createTitle')}
            </Button>
          </Stack>
        </MobileSurface>

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

        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {statuses.map((status) => (
            <Chip
              key={status}
              label={status === 'all' ? t('common.allStatuses') : t(`quotation.status.${status}`)}
              color={statusFilter === status ? 'primary' : 'default'}
              variant={statusFilter === status ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter(status)}
              sx={{ flex: '0 0 auto', fontWeight: 700 }}
            />
          ))}
        </Stack>

        <Stack spacing={1.5}>
          <MobileSectionTitle title={t('quotations.title')} />
          {filteredQuotations.map((quotation) => {
            const customerName = quotation.customer?.companyName ?? quotation.customer?.name ?? '';

            return (
              <MobileSurface key={quotation.id}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {quotation.quotationNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {translatePartyName(language, customerName)}
                      </Typography>
                    </Box>
                    <ErpStatusChip status={quotation.status} />
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
                        {t('quotation.quotationDate')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {formatDate(quotation.quotationDate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('quotation.validUntil')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {formatDate(quotation.validUntil)}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {t('invoice.grandTotal')}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                      {formatCurrency(quotation.grandTotal)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="outlined" startIcon={<VisibilityOutlinedIcon />} onClick={() => navigate('/erp/print-preview?type=quotation')}>
                      {t('quotation.viewPreview')}
                    </Button>
                    <Button fullWidth variant="contained" startIcon={<ReceiptLongOutlinedIcon />} onClick={() => convertToInvoice(quotation)}>
                      {t('quotation.convertToInvoice')}
                    </Button>
                  </Stack>
                </Stack>
              </MobileSurface>
            );
          })}
          {filteredQuotations.length === 0 && (
            <MobileSurface>
              <Typography color="text.secondary" align="center">
                {t('quotations.noMatches')}
              </Typography>
            </MobileSurface>
          )}
        </Stack>
      </Stack>
    </MobileShell>
  );
};
