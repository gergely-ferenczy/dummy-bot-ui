import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

const Joystick = (props) => {
  const theme = useTheme();
  const rootRef = useRef();
  const defaultJsPos = { left: `calc(50% - ${props.handleSize/2}px)`, top: `calc(50% - ${props.handleSize/2}px)` };
  const [jsPos, setJsPos] = useState(defaultJsPos);
  
  const handleMove = useCallback((e) => {
    if (e.buttons & 1) {

      const left = e.clientX - rootRef.current.offsetLeft;
      const top = e.clientY - rootRef.current.offsetTop;
      const x = left / (rootRef.current.clientWidth / 2) - 1;
      const y = 1 - top / (rootRef.current.clientHeight / 2);
      const len = Math.sqrt(x*x + y*y);

      if (len <= 1.0) {
        setJsPos({
          left: `calc(${left - props.handleSize/2}px)`,
          top:  `calc(${top - props.handleSize/2}px)`
        });
      }
      else {
        const left = ((x / len) + 1) * (rootRef.current.clientWidth / 2);
        const top = ((y / len) - 1) * -(rootRef.current.clientWidth / 2);

        setJsPos({
          left: `calc(${left - props.handleSize/2}px)`,
          top:  `calc(${top - props.handleSize/2}px)`
        });
      }
    }
  }, []);

  const handleDown = useCallback((e) => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, []);

  const handleUp = useCallback((e) => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
  }, []);

  return (
    <div ref={rootRef} style={{minHeight: '100px', minWidth: '100px', height: '100%', width: '100%', aspectRatio: '1/1', position: 'relative'}}>
      <svg style={{width: '100%', height: '100%'}}>
        <line x1={'0px'} x2={'100%'} y1={'50%'} y2={'50%'}  style={{stroke: theme.palette.primary.light, strokeDasharray: '5, 5'}} />
        <line x1={'50%'} x2={'50%'}  y1={'0px'} y2={'100%'} style={{stroke: theme.palette.primary.light, strokeDasharray: '5, 5'}} />
      </svg>
      <svg width={props.handleSize} height={props.handleSize} style={{position: 'absolute', left: jsPos.left, top: jsPos.top}} onMouseDown={handleDown}>
        <circle cx={props.handleSize/2} cy={props.handleSize/2} r={props.handleSize/2} style={{fill: theme.palette.primary.main}} />
      </svg>
    </div>
  )
};

Joystick.defaultProps = {
  handleSize: 20
};

export default Joystick;
