import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 3, mt: 'auto' }}>
      <Typography variant="caption">جميع الحقوق محفوظة &copy; Megawatt</Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          بيانات تجريبية داخل الواجهة فقط
        </Typography>
      </Stack>
    </Stack>
  );
}
