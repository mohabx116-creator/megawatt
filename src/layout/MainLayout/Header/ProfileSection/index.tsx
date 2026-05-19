import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';

// assets
import adminAvatar from 'assets/images/megawatt-admin.jpg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';

const dndStorageKey = 'megawatt:profile:dnd';
const notificationsStorageKey = 'megawatt:profile:notifications';

type ProfileDialog = 'account' | 'social' | null;

type ProfileOption = {
  label: string;
  icon: ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const getStoredBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') return fallback;

  const storedValue = window.localStorage.getItem(key);
  if (storedValue === 'true') return true;
  if (storedValue === 'false') return false;
  return fallback;
};

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(() => getStoredBoolean(dndStorageKey, false));
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(() => getStoredBoolean(notificationsStorageKey, false));
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeDialog, setActiveDialog] = useState<ProfileDialog>(null);
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);
  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const openProfileDialog = (event: React.MouseEvent<HTMLDivElement>, index: number, dialog: Exclude<ProfileDialog, null>) => {
    setSelectedIndex(index);
    handleClose(event);
    setActiveDialog(dialog);
  };

  const handleDndChange = (checked: boolean) => {
    setSdm(checked);
    localStorage.setItem(dndStorageKey, String(checked));
  };

  const handleNotificationChange = async (checked: boolean) => {
    setNotification(checked);
    localStorage.setItem(notificationsStorageKey, String(checked));

    if (!checked) {
      setNotificationMessage('Demo notifications are disabled.');
      return;
    }

    if (!('Notification' in window)) {
      setNotificationMessage('Browser notifications are not available in this browser.');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationMessage(
        permission === 'granted'
          ? 'Browser notification permission granted for this demo.'
          : 'Browser notification permission was not granted. Demo preference was saved.'
      );
      return;
    }

    setNotificationMessage(
      Notification.permission === 'granted'
        ? 'Browser notifications are enabled for this demo.'
        : 'Browser notification permission is denied. Demo preference was saved.'
    );
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const profileOptions: ProfileOption[] = [
    {
      label: 'Account Settings',
      icon: <IconSettings stroke={1.5} size="20px" />,
      onClick: (event) => openProfileDialog(event, 0, 'account')
    },
    {
      label: 'Social Profile',
      icon: <IconUser stroke={1.5} size="20px" />,
      onClick: (event) => openProfileDialog(event, 1, 'social')
    },
    {
      label: 'Logout',
      icon: <IconLogout stroke={1.5} size="20px" />,
      onClick: () => {
        setSelectedIndex(2);
        handleLogout();
      }
    }
  ];

  const normalizedSearch = value.trim().toLowerCase();
  const visibleOptions = profileOptions.filter((option) => !normalizedSearch || option.label.toLowerCase().includes(normalizedSearch));

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
        icon={
          <Avatar
            src={adminAvatar}
            alt="Megawatt admin"
            sx={{ typography: 'mediumAvatar', margin: '8px 0 8px 8px !important', cursor: 'pointer' }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar
                          src={adminAvatar}
                          alt={user?.name ?? 'Demo User'}
                          sx={{
                            width: 48,
                            height: 48,
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: `0 0 0 1px ${theme.palette.divider}`
                          }}
                        />
                        <Stack sx={{ minWidth: 0 }}>
                          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="h4">Good Morning,</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                              {user?.name ?? 'Demo User'}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2" color="text.secondary">
                            Project Admin
                          </Typography>
                        </Stack>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        slotProps={{ input: { 'aria-label': 'Search profile options' } }}
                      />
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <Card sx={{ bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.800' }), my: 2 }}>
                        <CardContent>
                          <Stack sx={{ gap: 2 }}>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="subtitle1">Start DND Mode</Typography>
                                {sdm && (
                                  <Typography variant="caption" color="text.secondary">
                                    Do Not Disturb is active
                                  </Typography>
                                )}
                              </Box>
                              <Switch color="primary" checked={sdm} onChange={(event) => handleDndChange(event.target.checked)} name="sdm" size="small" />
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="subtitle1">Allow Notifications</Typography>
                                {notificationMessage && (
                                  <Typography variant="caption" color="text.secondary">
                                    {notificationMessage}
                                  </Typography>
                                )}
                              </Box>
                              <Switch
                                checked={notification}
                                onChange={(event) => {
                                  handleNotificationChange(event.target.checked);
                                }}
                                name="notifications"
                                size="small"
                              />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        {visibleOptions.map((option, index) => (
                          <ListItemButton
                            key={option.label}
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === profileOptions.findIndex((candidate) => candidate.label === option.label)}
                            onClick={option.onClick}
                          >
                            <ListItemIcon>{option.icon}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {option.label}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        ))}
                        {visibleOptions.length === 0 && (
                          <Box sx={{ px: 1, py: 2 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No options found
                            </Typography>
                          </Box>
                        )}
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <Dialog open={activeDialog === 'account'} onClose={() => setActiveDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Account Settings</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {[
              ['Name', 'Demo User'],
              ['Role', 'Project Admin'],
              ['Company', 'Megawatt'],
              ['Email', 'admin@megawatt.local']
            ].map(([label, fieldValue]) => (
              <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {fieldValue}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={activeDialog === 'social'} onClose={() => setActiveDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Social Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {[
              ['User', 'Demo User'],
              ['Department', 'Operations'],
              ['LinkedIn', 'Not connected'],
              ['Activity', 'Managing Megawatt demo workspace']
            ].map(([label, fieldValue]) => (
              <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                  {fieldValue}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
