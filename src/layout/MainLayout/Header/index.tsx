import { Activity } from 'react';

// material-ui
import { useTheme, useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import FullScreenSection from './FullScreenSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import { IconMenu2, IconSun, IconMoon } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const {
    state: { menuOrientation }
  } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Activity mode={!isHorizontal ? 'visible' : 'hidden'}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              color: theme.vars.palette.secondary.dark,
              background: theme.vars.palette.secondary.light,
              '&:hover': {
                color: theme.vars.palette.secondary.light,
                background: theme.vars.palette.secondary.dark
              },
              ...theme.applyStyles('dark', {
                color: theme.vars.palette.secondary.main,
                background: theme.vars.palette.dark.main,
                '&:hover': {
                  color: theme.vars.palette.secondary.light,
                  background: theme.vars.palette.secondary.main
                }
              })
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        </Activity>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* mega-menu */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MegaMenuSection />
      </Box>

      {/* live customization & localization */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <LocalizationSection />
      </Box>

      {/* mode toggler */}
      <Box sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
        <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: mode === 'dark' ? theme.vars.palette.dark.main : theme.vars.palette.secondary.light,
              color: mode === 'dark' ? theme.vars.palette.warning.dark : theme.vars.palette.secondary.dark,
              '&:hover': {
                background: mode === 'dark' ? theme.vars.palette.warning.dark : theme.vars.palette.secondary.dark,
                color: mode === 'dark' ? theme.vars.palette.grey[800] : theme.vars.palette.secondary.light
              }
            }}
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          >
            {mode === 'dark' ? <IconSun stroke={1.5} size="20px" /> : <IconMoon stroke={1.5} size="20px" />}
          </Avatar>
        </Tooltip>
      </Box>

      {/* notification */}
      <NotificationSection />

      {/* full sceen toggler */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <FullScreenSection />
      </Box>

      {/* profile */}
      <ProfileSection />

      {/* mobile header */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      </Box>
    </>
  );
}
