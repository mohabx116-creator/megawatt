import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLanguage } from 'i18n';

type MobileShellProps = {
  title?: string;
  children: ReactNode;
  showBottomNav?: boolean;
  action?: ReactNode;
};

type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  match: string[];
};

export const MobileShell = ({ title = 'Megawatt', children, showBottomNav = true, action }: MobileShellProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage, isRtl } = useLanguage();

  const navItems: NavItem[] = [
    { label: t('nav.dashboard'), path: '/erp/dashboard', icon: <DashboardOutlinedIcon />, match: ['/erp/dashboard'] },
    { label: t('nav.inventory'), path: '/erp/inventory', icon: <Inventory2OutlinedIcon />, match: ['/erp/inventory', '/erp/products'] },
    { label: t('nav.createQuotation'), path: '/erp/create-quotation', icon: <DescriptionOutlinedIcon />, match: ['/erp/create-quotation'] },
    { label: t('nav.createInvoice'), path: '/erp/create-invoice', icon: <AddCardOutlinedIcon />, match: ['/erp/create-invoice'] },
    { label: t('nav.financeReports'), path: '/erp/finance-reports', icon: <ReceiptLongOutlinedIcon />, match: ['/erp/finance-reports'] }
  ];

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#eef2f6',
        color: 'text.primary',
        direction: isRtl ? 'rtl' : 'ltr',
        overflowX: 'hidden'
      }}
    >
      <Stack
        component="header"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 56,
          px: 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <MenuOutlinedIcon sx={{ color: title === 'Megawatt' ? theme.palette.primary.main : 'text.secondary' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: title === 'Megawatt' ? theme.palette.primary.main : 'text.primary' }}>
            {title}
          </Typography>
        </Stack>
        {action ?? (
          <ButtonBase
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 1.5,
              color: 'text.secondary',
              '&:active': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </Typography>
          </ButtonBase>
        )}
      </Stack>

      <Box component="main" sx={{ px: 2, pt: 2, pb: showBottomNav ? 'calc(96px + env(safe-area-inset-bottom))' : 16 }}>
        {children}
      </Box>

      {showBottomNav && (
        <Stack
          component="nav"
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            height: 'calc(72px + env(safe-area-inset-bottom))',
            pb: 'env(safe-area-inset-bottom)',
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          {navItems.map((item) => {
            const active = item.match.some((path) => location.pathname.startsWith(path));
            return (
              <ButtonBase
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minWidth: 70,
                  height: 56,
                  borderRadius: 2,
                  color: active ? theme.palette.primary.main : 'text.secondary',
                  fontWeight: active ? 800 : 500
                }}
              >
                <Stack alignItems="center" spacing={0.25}>
                  <Box sx={{ fontSize: 22, display: 'flex', '& svg': { fontSize: 22 } }}>{item.icon}</Box>
                  <Typography variant="caption" sx={{ fontSize: 10, fontWeight: active ? 800 : 600, maxWidth: 76 }} noWrap>
                    {item.label}
                  </Typography>
                </Stack>
              </ButtonBase>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export const MobileSurface = ({ children, sx }: { children: ReactNode; sx?: object }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 2px 4px rgba(144, 164, 174, 0.16)',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export const MobileSectionTitle = ({ title, action }: { title: string; action?: ReactNode }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
    <Typography variant="h4" sx={{ fontWeight: 800 }}>
      {title}
    </Typography>
    {action}
  </Stack>
);
