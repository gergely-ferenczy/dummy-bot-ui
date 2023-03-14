import React, { useState, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Slider, Paper, Stack } from '@mui/material';
import { lightBlue, red } from '@mui/material/colors';

import Joystick from './Joystick'
import ViewBox from './ViewBox'


const ControlPacket = {
  speed: 0.5,
  step: {x: 0.0, y: 0.0},
  step_height_weight: 1.0,
  turn: 0.0
};
const MonitorChannel = new WebSocket("ws://localhost:8080");
const ControlChannel = new WebSocket("ws://localhost:8081");

const updateSpeed = (e) => {
  const stepLen = Math.sqrt(e.x*e.x + e.y*e.y);
  const speed = stepLen;

  ControlPacket.speed = speed === 0.0 ? 0.5 : speed;
  if (stepLen > 0.0) {
    ControlPacket.step = {x: 0.2*e.x/stepLen + e.x*0.8, y: 0.2*e.y/stepLen + e.y*0.8};
  }
  else {
    ControlPacket.step = {x: 0.0, y: 0.0};
  }
  
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateStepHeightWeight = (e, newValue) => {
  ControlPacket.step_height_weight = newValue;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateTurnLen = (e, newValue) => {
  ControlPacket.turn = -newValue;
  ControlPacket.speed = newValue === 0.0 ? 0.5 : newValue;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: lightBlue[400] },
    secondary: { main: red['A200'] }
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
    },
    primary: { main: lightBlue[500] },
    secondary: { main: red['A400'] }
  },
  viewBox: {
    gridSectionColor: '#9d4b4b',
    gridCellColor: '#6f6f6f'
  }
})

const App = () => {

  const prefersDarkMode = true; useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => { return prefersDarkMode ? darkTheme : lightTheme; },
    [prefersDarkMode]
  );

  window.theme = theme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100%', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: 'min-content min-content', gridTemplateRows: '100%', padding: theme.spacing(), columnGap: theme.spacing() }}>
          <Box sx={{ height: '100%', aspectRatio: '4/3' }}>
            <Paper sx={{ height: '100%', padding: theme.spacing() }}>
              <ViewBox backendChannel={MonitorChannel} />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ padding: theme.spacing() }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Joystick elevation={2} stickyHandle stickyAxis centerReturn onPositionChange={updateSpeed}></Joystick>
                  <Box>
                    <Slider min={0.5} max={1.5} step={0.1} marks orientation="vertical" defaultValue={ControlPacket.step_height_weight} 
                      onChange={updateStepHeightWeight} valueLabelDisplay="auto" />
                  </Box>
                </Stack>
                <Slider style={{ width: 100 }} min={-1.0} max={1.0} step={0.1} marks defaultValue={ControlPacket.turn} 
                    onChange={updateTurnLen} valueLabelDisplay="auto" />
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
