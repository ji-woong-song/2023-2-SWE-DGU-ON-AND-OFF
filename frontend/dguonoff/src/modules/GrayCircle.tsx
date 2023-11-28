import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

function GrayCircle({ radius, icon, style } : { radius: number; icon : React.ReactElement; style?: SxProps;}) {
    return (
      <Box
        sx={{
          backgroundColor: '#D9D9D9',
          opacity: 0.4,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          ...style
        }}
      >
         {icon} 
      </Box>
    );
  }
  
  export default GrayCircle;