import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLanguage } from 'i18n';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 3, mt: 'auto' }}>
      <Typography variant="caption">{t('footer.rights')}</Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {t('footer.mockData')}
        </Typography>
      </Stack>
    </Stack>
  );
}
