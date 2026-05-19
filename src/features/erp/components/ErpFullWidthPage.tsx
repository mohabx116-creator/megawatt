import { ReactNode } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

type ErpFullWidthPageProps = {
  children: ReactNode;
  sx?: BoxProps['sx'];
};

export const ErpFullWidthPage = ({ children, sx }: ErpFullWidthPageProps) => (
  <>
    <GlobalStyles
      styles={{
        '.MuiContainer-root:has(> .erp-full-width-page)': {
          width: '100%',
          maxWidth: 'none',
          marginLeft: 0,
          marginRight: 0
        }
      }}
    />
    <Box className="erp-full-width-page" sx={{ width: '100%', maxWidth: 'none', margin: 0, alignSelf: 'stretch', minWidth: 0, ...sx }}>
      {children}
    </Box>
  </>
);
