import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

function GrayCircle({ radius, imgUrl, imgDescription, style } : { radius: number; imgUrl?: string; imgDescription?: string, style?: SxProps;}) {
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
        <img 
          src = {imgUrl} // 이미지 주소
          alt= {imgDescription} // 이미지에 대한 간단한 설명
          style={{ height: '100%' }} // 이미지의 높이를 조정하여 원 안에 맞게 조절.
        />
      </Box>
    );
  }
  
  export default GrayCircle;