import React, { useState, useEffect } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, Paper } from '@mui/material';

import Joystick from './Joystick'
import ViewBox from './ViewBox'


const ControlPacket = {
  speed: 0.2,
  step: [0.04, 0.0, 0.0],
  step_height: 0.3,
  move: false
};
const BackendChannel = new WebSocket("ws://localhost:8080");

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ margin: theme.spacing(), height: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100%', columnGap: theme.spacing() }}>
          <Box sx={{ overflow: 'hidden' }}>
            <ViewBox backendChannel={BackendChannel} />
          </Box>
          <Box>
            <Paper sx={{ padding: theme.spacing() }}>
              <Joystick></Joystick>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
