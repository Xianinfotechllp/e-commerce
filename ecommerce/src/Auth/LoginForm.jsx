// src/pages/LoginForm.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const endpoint =
      role === 'vendor'
        ? 'http://localhost:5000/api/vendors/login'
        : 'http://localhost:5000/api/users/login';

    try {
      const res = await axios.post(endpoint, formData);

      const { token,user } = res.data;

      // Store token and role
     
localStorage.setItem('token', token);
localStorage.setItem('role', role);
localStorage.setItem('userId', user._id); // if backend sends this


      alert(`Logged in as ${role}`);

      // Redirect
      if (role === 'vendor') {
        navigate('/vendor/vendor-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5">Login as {role}</Typography>

      <TextField
        select
        fullWidth
        margin="normal"
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="vendor">Vendor</MenuItem>
      </TextField>

      <TextField fullWidth margin="normal" name="email" label="Email" onChange={handleChange} />
      <TextField fullWidth margin="normal" name="password" type="password" label="Password" onChange={handleChange} />

      <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
