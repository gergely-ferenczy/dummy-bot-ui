import { useMemo, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Slider, Paper, Stack } from '@mui/material';
import { lightBlue, red } from '@mui/material/colors';

import Joystick, { JoystickPosition } from './Joystick';
import ViewBox from './ViewBox';

const ControlPacket = {
  step: { x: 0.0, y: 0.0 },
  step_height_weight: 0.5,
  turn_angle: 0.0,
  body_offset: { x: 0.0, y: 0.0, z: 0.0 },
  body_rotation_angle: 0.0,
  body_rotation_axis: { x: 0.0, y: 0.0, z: 0.0 }
};
const MonitorChannel = new WebSocket('ws://localhost:8080');
const ControlChannel = new WebSocket('ws://localhost:8081');

const updateStepHeightWeight = (_: Event, newValue: number) => {
  ControlPacket.step_height_weight = newValue;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateBodyOffset = (position: JoystickPosition) => {
  ControlPacket.body_offset.x = position.x;
  ControlPacket.body_offset.y = position.y;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

const updateBodyRotation = (position: JoystickPosition) => {
  ControlPacket.body_rotation_angle = Math.sqrt(
    position.x * position.x + position.y * position.y
  );
  ControlPacket.body_rotation_axis.x = position.y;
  ControlPacket.body_rotation_axis.z = -position.x;
  if (ControlChannel.readyState == WebSocket.OPEN) {
    ControlChannel.send(JSON.stringify(ControlPacket));
  }
};

declare module '@mui/material/styles' {
  interface Theme {
    viewBox: {
      gridSectionColor: string;
      gridCellColor: string;
    };
  }
  interface ThemeOptions {
    viewBox: {
      gridSectionColor: string;
      gridCellColor: string;
    };
  }
}

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
});

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
});

const App = () => {
  const prefersDarkMode = true;
  useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    return prefersDarkMode ? darkTheme : lightTheme;
  }, [prefersDarkMode]);

  const [speed, setSpeed] = useState([0, 0]);
  const [turn, setTurn] = useState(0);

  const updateSpeed = (position: JoystickPosition) => {
    ControlPacket.step = { x: position.x, y: position.y };

    if (ControlChannel.readyState == WebSocket.OPEN) {
      ControlChannel.send(JSON.stringify(ControlPacket));
    }

    setSpeed([position.x * 0.16, position.y * 0.16]);
  };

  const updateTurnAngle = (_: Event, newValue: number) => {
    ControlPacket.turn_angle = -newValue;
    if (ControlChannel.readyState == WebSocket.OPEN) {
      ControlChannel.send(JSON.stringify(ControlPacket));
    }

    setTurn((newValue * Math.PI) / 2.4);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100%' }}>
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr min-content',
            gridTemplateRows: '100%',
            padding: theme.spacing(2),
            columnGap: theme.spacing()
          }}
        >
          <Box sx={{ height: '100%', overflow: 'hidden' }}>
            <Paper sx={{ height: '100%', padding: theme.spacing() }}>
              <ViewBox
                backendChannel={MonitorChannel}
                speed={speed}
                turn={turn}
              />
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ padding: theme.spacing() }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Joystick
                    elevation={2}
                    stickyHandle
                    stickyAxis
                    centerReturn
                    onPositionChange={updateSpeed}
                  />
                  <Box>
                    <Slider
                      min={0.0}
                      max={2.0}
                      step={0.1}
                      marks
                      orientation="vertical"
                      defaultValue={ControlPacket.step_height_weight}
                      onChange={updateStepHeightWeight}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Joystick
                    elevation={2}
                    stickyHandle
                    stickyAxis
                    centerReturn
                    onPositionChange={updateBodyOffset}
                  />
                  <Joystick
                    elevation={2}
                    stickyHandle
                    stickyAxis
                    centerReturn
                    onPositionChange={updateBodyRotation}
                  />
                </Stack>
                <Slider
                  style={{ width: 100 }}
                  min={-1.0}
                  max={1.0}
                  step={0.1}
                  marks
                  defaultValue={ControlPacket.turn_angle}
                  onChange={updateTurnAngle}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
