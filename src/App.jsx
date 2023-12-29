import React, { useState, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Slider, Paper, Stack } from '@mui/material';
import { lightBlue, red } from '@mui/material/colors';

import Joystick from './Joystick'
import ViewBox from './ViewBox'


const ControlPacket = {
  step: {x: 0.0, y: 0.0},
  step_height_weight: 0.5,
  turn_angle: 0.0,
  body_offset: {x: 0.0, y: 0.0, z: 0.0},
  body_rotation_angle: 0.0,
  body_rotation_axis: {x: 0.0, y: 0.0, z: 0.0}
};
const MonitorChannel = new WebSocket("ws://localhost:8080");
const ControlChannel = new WebSocket("ws://localhost:8081");

const updateSpeed = (e) => {
  ControlPacket.step = {x: e.x, y: e.y};
  
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

const updateTurnAngle = (e, newValue) => {
  ControlPacket.turn_angle = -newValue;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateBodyOffset = (e) => {
  ControlPacket.body_offset.x = e.x;
  ControlPacket.body_offset.y = e.y;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateBodyRotation = (e) => {
  ControlPacket.body_rotation_angle = Math.sqrt(e.x*e.x + e.y*e.y);
  ControlPacket.body_rotation_axis.x = e.y;
  ControlPacket.body_rotation_axis.z = -e.x;
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
                  <Joystick elevation={2} stickyHandle stickyAxis centerReturn onPositionChange={updateSpeed} />
                  <Box>
                    <Slider min={0.0} max={2.0} step={0.1} marks orientation="vertical" defaultValue={ControlPacket.step_height_weight} 
                      onChange={updateStepHeightWeight} valueLabelDisplay="auto" />
                  </Box>
                  <Joystick elevation={2} stickyHandle stickyAxis centerReturn onPositionChange={updateBodyOffset} />
                  <Joystick elevation={2} stickyHandle stickyAxis centerReturn onPositionChange={updateBodyRotation} />
                </Stack>
                <Slider style={{ width: 100 }} min={-1.0} max={1.0} step={0.1} marks defaultValue={ControlPacket.turn_angle} 
                    onChange={updateTurnAngle} valueLabelDisplay="auto" />
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
