import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type ErpPageHeaderProps = {
  title: string;
  subtitle: string;
};

export const ErpPageHeader = ({ title, subtitle }: ErpPageHeaderProps) => (
  <Stack spacing={0.5} sx={{ mb: 3, width: '100%', maxWidth: '100%', textAlign: 'right' }}>
    <Typography variant="h2">{title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Stack>
);
