import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/AuthSlice';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: 'test@gmail.com',
    password: 'test@123',
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
      const request = await post('/auth/login', value);
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        dispatch(addUser(response.user));
        navigate('/');
      }
      console.log(response);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log('error', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button fullWidth variant="contained" type="submit" sx={{ mb: 2 }}>
            Login
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Link to={'/register'} style={{ textDecoration: 'none', color: '#1976d2' }}>Register</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}