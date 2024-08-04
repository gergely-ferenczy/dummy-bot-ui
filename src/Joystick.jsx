import React, { useState, useRef, useCallback } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { alpha } from '@mui/system';
import getOverlayAlpha from '@mui/material/styles/getOverlayAlpha';

const JoystickRoot = styled('div', {
  name: 'Joystick',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  height: `${ownerState.size}px`,
  width: `${ownerState.size}px`,
  position: 'relative',
  borderRadius: '50%',
  boxShadow: theme.shadows[ownerState.elevation],
  ...(theme.palette.mode === 'dark' && {
    backgroundImage: `linear-gradient(${alpha(
      '#fff',
      getOverlayAlpha(ownerState.elevation)
    )}, ${alpha('#fff', getOverlayAlpha(ownerState.elevation))})`
  })
}));

const JoystickHandle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'ownerState' && prop !== 'position',
  name: 'Joystick',
  slot: 'Handle'
})(({ theme, ownerState, position }) => ({
  position: 'absolute',
  left: (position.x + 1) * (ownerState.size / 2) - ownerState.handleSize / 2,
  top: (position.y - 1) * -(ownerState.size / 2) - ownerState.handleSize / 2,
  width: ownerState.handleSize,
  height: ownerState.handleSize,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  boxShadow: theme.shadows[ownerState.elevation],
  ...(position.x == 0.0 &&
    position.y == 0.0 && {
      transition: theme.transitions.create(['top', 'left'], {
        duration: theme.transitions.duration.short
      })
    })
}));

const Joystick = (props) => {
  const theme = useTheme();
  const rootRef = useRef();
  const [position, setPosition] = useState({ x: 0.0, y: 0.0 });

  const {
    elevation = 1,
    handleSize = 40,
    size = 100,
    stickyHandle = false,
    stickyAxis = 0.5,
    centerReturn = false,
    onPositionChange
  } = props;

  const ownerState = {
    ...props,
    elevation,
    handleSize,
    size
  };

  const calculateJoystickPosition = useCallback((e) => {
    if (e.buttons & 1) {
      const left = e.pageX - rootRef.current.offsetLeft;
      const top = e.pageY - rootRef.current.offsetTop;
      let x = left / (size / 2) - 1;
      let y = 1 - top / (size / 2);

      const axisPull = (() => {
        if (stickyAxis === true) {
          return 1.5;
        } else if (typeof stickyAxis === 'number') {
          return Math.max(Math.min(stickyAxis + 1.0, 2.0), 1.0);
        } else {
          return false;
        }
      })();

      if (axisPull) {
        if (x >= 0.0) {
          x = Math.pow(x, axisPull);
        } else {
          x = -Math.pow(-x, axisPull);
        }
        if (y >= 0.0) {
          y = Math.pow(y, axisPull);
        } else {
          y = -Math.pow(-y, axisPull);
        }
      }
      const len = Math.sqrt(x * x + y * y);

      if (len > 1.0) {
        x = x / len;
        y = y / len;
      }

      const eps = 0.1;
      if (centerReturn && x > -eps && x < eps && y > -eps && y < eps) {
        x = 0.0;
        y = 0.0;
      }

      setPosition({ x: x, y: y });
      if (onPositionChange) {
        onPositionChange({ x, y });
      }
    }
  }, []);

  const handleMove = useCallback((e) => {
    calculateJoystickPosition(e);
  }, []);

  const handleDown = useCallback((e) => {
    calculateJoystickPosition(e);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, []);

  const handleUp = useCallback((e) => {
    if (!stickyHandle) {
      setPosition({ x: 0.0, y: 0.0 });
      if (onPositionChange) {
        onPositionChange({ x: 0.0, y: 0.0 });
      }
    }

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
  }, []);

  return (
    <JoystickRoot
      ref={rootRef}
      ownerState={ownerState}
      onMouseDown={handleDown}
    >
      <svg
        style={{ width: '100%', height: '100%', shapeRendering: 'crispEdges' }}
      >
        <line
          x1={'0px'}
          x2={'100%'}
          y1={'50%'}
          y2={'50%'}
          style={{
            stroke: theme.palette.primary.dark,
            strokeDasharray: '5, 5'
          }}
        />
        <line
          x1={'50%'}
          x2={'50%'}
          y1={'0px'}
          y2={'100%'}
          style={{
            stroke: theme.palette.primary.dark,
            strokeDasharray: '5, 5'
          }}
        />
      </svg>
      <JoystickHandle
        ownerState={ownerState}
        position={{ x: position.x, y: position.y }}
      />
    </JoystickRoot>
  );
};

export default Joystick;
