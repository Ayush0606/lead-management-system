import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyAppBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/leads')}
        >
          Lead Management System
        </Typography>
        <Button color="inherit" onClick={() => navigate('/leads')}>Leads</Button>
        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        <Button color="inherit" onClick={async () => {
          await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
          navigate('/login');
        }}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
