import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

type MobileStatCardProps = {
  label: string;
  value: string;
  accent?: string;
  helper?: string;
};

export const MobileStatCard = ({ label, value, accent, helper }: MobileStatCardProps) => {
  const theme = useTheme();
  const color = accent ?? theme.palette.primary.main;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(color, 0.06),
        minWidth: 0
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        {helper && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {helper}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
