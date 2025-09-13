import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
  },
  shape: {
    borderRadius: 8,
  },
});
