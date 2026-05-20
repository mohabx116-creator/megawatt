import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';
import { GeneratedQuotationSnapshot } from '../../sales-documents';
import { translatePartyName, translateProductName, translateUnit } from '../../utils/displayTranslations';

interface QuotationPrintDocumentProps {
  quotation: GeneratedQuotationSnapshot;
}

export const QuotationPrintDocument = ({ quotation }: QuotationPrintDocumentProps) => {
  const theme = useTheme();
  const { t, language, isRtl, formatCurrency, formatDate } = useLanguage();
  const customer = quotation.customer;

  return (
    <Box
      className="megawatt-quotation-print-root megawatt-quotation-document"
      sx={{
        width: '100%',
        maxWidth: 980,
        mx: 'auto',
        p: { xs: 2, md: 4 },
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        direction: isRtl ? 'rtl' : 'ltr',
        textAlign: isRtl ? 'right' : 'left'
      }}
    >
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2">Megawatt</Typography>
            <Typography variant="body2" color="text.secondary">{t('print.companyTagline')}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>{t('print.cairoEgypt')}</Typography>
            <Typography variant="body2">{t('print.phone')}: +20 2 0000 0000</Typography>
            <Typography variant="body2">{t('print.taxRegistration')}: EG-000-000-000</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography variant="h2">{t('quotation.priceOffer')}</Typography>
              <Chip label={t(`quotation.status.${quotation.status}`)} color="primary" variant="outlined" />
              <Typography variant="body2">{t('quotation.quotationNumber')}: {quotation.quotationNumber}</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MainCard title={t('print.customerDetails')} border elevation={0}>
              <Typography variant="subtitle1">{translatePartyName(language, customer?.companyName)}</Typography>
              <Typography variant="body2" color="text.secondary">{customer?.name}</Typography>
              <Typography variant="body2">{customer?.phone}</Typography>
              <Typography variant="body2">{customer?.address}, {customer?.city}</Typography>
              {customer?.taxRegistrationNumber && <Typography variant="body2">{t('print.taxRegistration')}: {customer.taxRegistrationNumber}</Typography>}
            </MainCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <MainCard title={t('quotation.details')} border elevation={0}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{t('quotation.quotationDate')}</Typography>
                  <Typography>{formatDate(quotation.quotationDate)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{t('quotation.validUntil')}</Typography>
                  <Typography>{formatDate(quotation.validUntil)}</Typography>
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('invoice.sku')}</TableCell>
                <TableCell>{t('invoice.product')}</TableCell>
                <TableCell>{t('common.unit')}</TableCell>
                <TableCell align="right">{t('common.quantity')}</TableCell>
                <TableCell align="right">{t('invoice.unitPrice')}</TableCell>
                <TableCell align="right">{t('invoice.discount')}</TableCell>
                <TableCell align="right">{t('invoice.vat')}</TableCell>
                <TableCell align="right">{t('invoice.lineTotal')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotation.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.sku}</TableCell>
                  <TableCell>{translateProductName(language, line.productName)}</TableCell>
                  <TableCell>{translateUnit(language, line.unit)}</TableCell>
                  <TableCell align="right">{line.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(line.unitPrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(line.discount)}</TableCell>
                  <TableCell align="right">{line.taxRate}%</TableCell>
                  <TableCell align="right">{formatCurrency(line.lineTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={1}>
              {[
                [t('invoice.subtotalBeforeVat'), formatCurrency(quotation.subtotal)],
                [t('print.discounts'), formatCurrency(quotation.discountTotal)],
                [t('invoice.vatAmount'), formatCurrency(quotation.vatTotal)]
              ].map(([label, value]) => (
                <Stack key={label} direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{label}</Typography>
                  <Typography>{value}</Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
                <Typography variant="h4">{t('invoice.grandTotal')}</Typography>
                <Typography variant="h4">{formatCurrency(quotation.grandTotal)}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5">{t('quotation.terms')}</Typography>
            <Typography variant="body2" color="text.secondary">{quotation.terms}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5">{t('quotation.notes')}</Typography>
            <Typography variant="body2" color="text.secondary">{quotation.notes}</Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};
