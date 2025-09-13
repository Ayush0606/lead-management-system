
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Card, CardContent, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log("Registration successful");
    if (res.ok) {
      navigate('/leads');
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  }

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="60vh"
      px={{ xs: 1, sm: 2 }}
    >
      <Card sx={{ 
        width: '100%', 
        maxWidth: { xs: '100%', sm: 350, md: 400 }, 
        p: { xs: 1, sm: 2 } 
      }}>
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, textAlign: 'center' }}
          >
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
