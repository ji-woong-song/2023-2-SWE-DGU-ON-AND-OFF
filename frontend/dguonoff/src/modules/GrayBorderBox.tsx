import React, {ReactNode} from 'react';
import { Paper, SxProps } from '@mui/material';

function GrayBorderBox({ children, style } : { children: ReactNode; style?: SxProps;}) {
  return (
    <Paper
        variant="outlined" 
        square={false} // 'false'로 설정하여 기본적인 테두리 반경을 사용할 수 있게
        sx={{
        my: 2, // 상하 마진
        p: 2, // 내부 패딩
        border: '2px solid #D9D9D9',
        borderRadius: '24px', // 테두리 반경 지정
        ...style, // 추가 스타일 적용
        }}
    >
      {children}
    </Paper>
  );
}

export default GrayBorderBox;