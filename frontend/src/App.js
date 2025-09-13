
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, IconButton } from '@mui/material';
import { getTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MyAppBar from './components/AppBar';
import Login from './pages/Login';
import Register from './pages/Register';
import LeadsList from './pages/LeadsList';
import LeadForm from './pages/LeadForm';

function App() {
  const [mode, setMode] = React.useState('light');
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MyAppBar />
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: 2, sm: 4 }, 
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <IconButton 
            sx={{ 
              float: 'right', 
              mb: 2,
              position: { xs: 'fixed', sm: 'static' },
              top: { xs: 70, sm: 'auto' },
              right: { xs: 10, sm: 'auto' },
              zIndex: 1000,
              bgcolor: { xs: 'background.paper', sm: 'transparent' },
              boxShadow: { xs: 2, sm: 0 }
            }} 
            onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')} 
            color="inherit"
          >
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leads" element={<LeadsList />} />
            <Route path="/leads/new" element={<LeadForm />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />
            <Route path="*" element={<Navigate to="/leads" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
