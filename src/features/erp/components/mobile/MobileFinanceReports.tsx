import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { useLanguage } from 'i18n';

export const MobileFinanceReports = () => {
  const { t } = useLanguage();

  return (
    <MainCard border elevation={0}>
      <Typography variant="h3">{t('finance.title')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('finance.subtitle')}
      </Typography>
    </MainCard>
  );
};
