import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndPoint';
import toast from 'react-hot-toast';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

export default function Register() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('/auth/register', value);
      const response = request.data;
      console.log(response);
      if (response.success) {
        toast.success(response.message);
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              name="userName"
              value={value.userName}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={value.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={value.password}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Button fullWidth variant="contained"  type="submit" sx={{ mb: 2 }}>
            Register
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link to={'/login'} style={{ textDecoration: 'none', color: '#1976d2' }}>Login</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
