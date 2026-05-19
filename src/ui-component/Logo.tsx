// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// assets
import megawattMark from 'assets/images/megawatt-mark.jpg';

// ==============================|| LOGO ||============================== //

export default function Logo() {
  return (
    <Box
      aria-label="Megawatt"
      title="Megawatt"
      sx={{
        height: 42,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'transform 160ms ease, opacity 160ms ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          opacity: 0.92
        }
      }}
    >
      <Box
        component="img"
        src={megawattMark}
        alt=""
        aria-hidden="true"
        sx={{
          width: 34,
          height: 34,
          objectFit: 'contain',
          flexShrink: 0,
          display: 'block'
        }}
      />

      <Typography
        variant="h3"
        component="span"
        sx={{
          color: 'text.primary',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: 0,
          whiteSpace: 'nowrap'
        }}
      >
        Megawatt
      </Typography>
    </Box>
  );
}
