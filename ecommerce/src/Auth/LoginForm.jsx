// src/pages/LoginForm.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginImage from '../images/login.jpg'

const LoginForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const endpoint =
      role === 'vendor'
        ? 'https://e-commerce-4jpl.onrender.com/api/vendors/login'
        : 'https://e-commerce-4jpl.onrender.com/api/users/login';

    try {
      const res = await axios.post(endpoint, formData);

      const { token, user } = res.data;

      // Store token and role

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user._id); // if backend sends this


      toast.success(`Logged in as ${role}`);

      // Redirect
      if (role === 'vendor') {
        navigate('/vendor/vendor-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '98vh',
      backgroundImage: `url(  ${loginImage} )`, backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <Box sx={{ maxWidth: 400,ml:70, boxShadow: 2,padding:3,borderRadius:'15px'}}>
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
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          <Link style={{ color: 'white', textDecoration: 'none' }} to={'/register'}>Register</Link>
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
