import { Activity, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useLanguage } from 'i18n';
import { ThemeDirection } from 'config';

// assets
import TranslateTwoToneIcon from '@mui/icons-material/TranslateTwoTone';

// types
import { I18n } from 'types/config';

// ==============================|| LOCALIZATION ||============================== //

export default function LocalizationSection() {
  const {
    state: { borderRadius, i18n, themeDirection },
    setField
  } = useConfig();
  const { language, setLanguage } = useLanguage();

  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
    lng: I18n
  ) => {
    setField('i18n', lng);
    if (lng === 'en' || lng === 'ar') {
      setLanguage(lng);
      setField('themeDirection', lng === 'ar' ? ThemeDirection.RTL : ThemeDirection.LTR);
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (i18n !== language) {
      setField('i18n', language);
    }
    const nextDirection = language === 'ar' ? ThemeDirection.RTL : ThemeDirection.LTR;
    if (themeDirection !== nextDirection) {
      setField('themeDirection', nextDirection);
    }
  }, [i18n, language, setField, themeDirection]);

  return (
    <>
      <Box sx={{ ml: { xs: 0, sm: 2 } }}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            color: theme.vars.palette.primary.dark,
            background: theme.vars.palette.primary.light,
            '&:hover, &[aria-controls="menu-list-grow"]': {
              color: theme.vars.palette.primary.light,
              background: theme.vars.palette.primary.main
            },

            ...theme.applyStyles('dark', {
              color: theme.vars.palette.primary.dark,
              background: theme.vars.palette.dark.main,
              '&:hover, &[aria-controls="menu-list-grow"]': {
                color: theme.vars.palette.primary.light,
                background: theme.vars.palette.primary.main
              }
            })
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          alt="language"
          onClick={handleToggle}
        >
          <Activity mode={language !== 'en' ? 'visible' : 'hidden'}>
            <Typography variant="h5" sx={{ textTransform: 'uppercase', color: 'inherit' }}>
              {language}
            </Typography>
          </Activity>

          <Activity mode={language === 'en' ? 'visible' : 'hidden'}>
            <TranslateTwoToneIcon sx={{ fontSize: '1.3rem' }} />
          </Activity>
        </Avatar>
      </Box>

      <Popper
        placement={downMD ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [downMD ? 0 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top-left' : 'top'} in={open} {...TransitionProps}>
              <Paper elevation={16}>
                <Activity mode={open ? 'visible' : 'hidden'}>
                  <List
                    sx={{
                      width: '100%',
                      minWidth: 200,
                      maxWidth: { xs: 250, sm: 280 },
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    <ListItemButton selected={language === 'en'} onClick={(event) => handleListItemClick(event, 'en')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography>English</Typography>
                            <Typography variant="caption" sx={{ ml: '8px' }}>
                              (UK)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={language === 'ar'} onClick={(event) => handleListItemClick(event, 'ar')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography>العربية</Typography>
                            <Typography variant="caption" sx={{ ml: '8px' }}>
                              (Arabic)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Activity>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
