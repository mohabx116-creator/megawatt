import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

export const MobileCreateInvoice = () => {
  const { t } = useLanguage();

  return (
    <MainCard border elevation={0}>
      <Typography variant="h3">{t('invoice.title')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('invoice.subtitle')}
      </Typography>
    </MainCard>
  );
};
