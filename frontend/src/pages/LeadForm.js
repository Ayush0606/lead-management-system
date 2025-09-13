
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, Card, CardContent, MenuItem, Alert, Stack, FormControlLabel, Checkbox } from '@mui/material';

const initialState = {
  first_name: '', last_name: '', email: '', phone: '', company: '', city: '', state: '',
  source: 'website', status: 'new', score: 0, lead_value: 0, last_activity_at: '', is_qualified: false
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


export default function LeadForm() {
  const [lead, setLead] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/leads/${id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setLead(data));
    }
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setLead(l => ({ ...l, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/leads/${id}` : `${API_URL}/leads`;
    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (res.ok) {
      navigate('/leads');
    } else {
      const data = await res.json();
      setError(data.error || 'Save failed');
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
        maxWidth: { xs: '100%', sm: 400, md: 500 }, 
        p: { xs: 1, sm: 2 } 
      }}>
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            {id ? 'Edit Lead' : 'Create Lead'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField name="first_name" label="First Name" value={lead.first_name} onChange={handleChange} required fullWidth />
              <TextField name="last_name" label="Last Name" value={lead.last_name} onChange={handleChange} required fullWidth />
              <TextField name="email" label="Email" value={lead.email} onChange={handleChange} required fullWidth />
              <TextField name="phone" label="Phone" value={lead.phone} onChange={handleChange} fullWidth />
              <TextField name="company" label="Company" value={lead.company} onChange={handleChange} fullWidth />
              <TextField name="city" label="City" value={lead.city} onChange={handleChange} fullWidth />
              <TextField name="state" label="State" value={lead.state} onChange={handleChange} fullWidth />
              <TextField select name="source" label="Source" value={lead.source} onChange={handleChange} fullWidth>
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="facebook_ads">Facebook Ads</MenuItem>
                <MenuItem value="google_ads">Google Ads</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="events">Events</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              <TextField select name="status" label="Status" value={lead.status} onChange={handleChange} fullWidth>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="won">Won</MenuItem>
              </TextField>
              <TextField name="score" label="Score" type="number" inputProps={{ min: 0, max: 100 }} value={lead.score} onChange={handleChange} fullWidth />
              <TextField name="lead_value" label="Lead Value" type="number" value={lead.lead_value} onChange={handleChange} fullWidth />
              <TextField name="last_activity_at" label="Last Activity" type="datetime-local" value={lead.last_activity_at} onChange={handleChange} fullWidth />
              <FormControlLabel
                control={<Checkbox name="is_qualified" checked={lead.is_qualified} onChange={handleChange} />}
                label="Qualified?"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>{id ? 'Update' : 'Create'}</Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
