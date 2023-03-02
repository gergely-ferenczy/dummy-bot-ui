import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

const Joystick = (props) => {
  const theme = useTheme();
  
  return (
    <div style={{ minHeight: '100px', minWidth: '100px', height: '100%', width: '100%', aspectRatio: '1/1',
                  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={props.handleSize} height={props.handleSize}>
        <circle cx={props.handleSize/2} cy={props.handleSize/2} r={props.handleSize/2} fill={theme.palette.primary.main} />
      </svg>
    </div>
  )
};

Joystick.defaultProps = {
  handleSize: 20
};

export default Joystick;
