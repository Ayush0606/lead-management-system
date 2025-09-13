
import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Stack } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


export default function LeadsList() {
  const [rowData, setRowData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, filters]);

  async function fetchLeads() {
    const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit, ...filters });
    const res = await fetch(`${API_URL}/leads?${params.toString()}`, { credentials: 'include' });
    if (res.status === 401) {
      navigate('/login');
      return;
    }
    const data = await res.json();
    setRowData(data.data);
    setPagination(p => ({ ...p, total: data.total, totalPages: data.totalPages }));
  }

  function onPageChange(newPage) {
    setPagination(p => ({ ...p, page: newPage }));
  }

  function onFilterChange(e) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Leads</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/leads/new')}>Add Lead</Button>
      </Stack>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField name="email" label="Email" onChange={onFilterChange} variant="outlined" size="small" />
          <TextField name="company" label="Company" onChange={onFilterChange} variant="outlined" size="small" />
          <TextField name="city" label="City" onChange={onFilterChange} variant="outlined" size="small" />
          {/* Add more filters as needed */}
        </Stack>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={[
              { field: 'first_name' },
              { field: 'last_name' },
              { field: 'email' },
              { field: 'phone' },
              { field: 'company' },
              { field: 'city' },
              { field: 'state' },
              { field: 'source' },
              { field: 'status' },
              { field: 'score' },
              { field: 'lead_value' },
              { field: 'last_activity_at' },
              { field: 'is_qualified' },
              { field: 'created_at' },
              { field: 'updated_at' },
              {
                headerName: 'Actions',
                cellRenderer: params => (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => navigate(`/leads/${params.data._id}/edit`)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={async () => {
                      await fetch(`${API_URL}/leads/${params.data._id}`, {
                        method: 'DELETE', credentials: 'include'
                      });
                      fetchLeads();
                    }}>Delete</Button>
                  </Stack>
                )
              }
            ]}
            pagination={false}
          />
        </div>
      </Paper>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Page: {pagination.page} / {pagination.totalPages}</Typography>
        <Button disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>Prev</Button>
        <Button disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}>Next</Button>
      </Stack>
    </Box>
  );
}
