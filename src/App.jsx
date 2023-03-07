import React, { useState, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Slider, Paper, Stack } from '@mui/material';

import Joystick from './Joystick'
import ViewBox from './ViewBox'


const ControlPacket = {
  speed: 0.2,
  step: {x: 0.0, y: 0.0},
  step_height_weight: 1.0
};
const MonitorChannel = new WebSocket("ws://localhost:8080");
const ControlChannel = new WebSocket("ws://localhost:8081");

const updateSpeed = (e) => {
  const speed = Math.sqrt(e.x*e.x + e.y*e.y);
  ControlPacket.speed = speed === 0.0 ? 0.5 : speed;
  ControlPacket.step = {x: e.x, y: e.y};
  if (ControlChannel.readyState == WebSocket.OPEN) {
    console.log(ControlPacket.speed, ControlPacket.step);
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateStepHeightWeight = (e, newValue) => {
  ControlPacket.speed = 0.1;
  ControlPacket.step = {x: 0.0, y: ControlPacket.step.y < 1.0 ? 1.0 : 0.1};

  ControlPacket.step_height_weight = newValue;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    console.log(ControlPacket.speed, ControlPacket.step);
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
  viewBox: {
    gridSectionColor: '#de7c7c',
    gridCellColor: '#6f6f6f'
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#404040',
      default: '#404040'
    }
  },
  viewBox: {
    gridSectionColor: '#9d4b4b',
    gridCellColor: '#6f6f6f'
  }
})

const App = () => {

  const prefersDarkMode = true;//= useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => { return prefersDarkMode ? darkTheme : lightTheme; },
    [prefersDarkMode]
  );

  window.theme = theme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: theme.spacing(), height: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100%', columnGap: theme.spacing() }}>
          <Box sx={{ overflow: 'hidden', aspectRatio: '4/3' }}>
            <ViewBox backendChannel={MonitorChannel} />
          </Box>
          <Box>
            <Paper sx={{ padding: theme.spacing() }}>
              <Stack direction="row" spacing={2}>
                <Joystick elevation={2} stickyAxis centerReturn onPositionChange={updateSpeed}></Joystick>
                <Box>
                  <Slider min={0.5} max={1.5} step={0.1} marks orientation="vertical" defaultValue={ControlPacket.step_height_weight} 
                    onChange={updateStepHeightWeight} valueLabelDisplay="auto" />
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
