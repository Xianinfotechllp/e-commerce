import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('user');
  const Navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    businessName: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const endpoint =
      role === 'vendor'
        ? 'http://localhost:5000/api/vendors/register'
        : 'http://localhost:5000/api/users/register';

    const dataToSend =
      role === 'vendor'
        ? formData
        : { name: formData.name, email: formData.email, password: formData.password, address: formData.address };

    try {
      const res = await axios.post(endpoint, dataToSend);
      alert(`Registered as ${role}!`);
      Navigate('/login')
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5">Register as {role}</Typography>

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

      <TextField fullWidth margin="normal" name="name" label="Name" onChange={handleChange} />
      <TextField fullWidth margin="normal" name="email" label="Email" onChange={handleChange} />
      <TextField fullWidth margin="normal" name="password" type="password" label="Password" onChange={handleChange} />
      <TextField fullWidth margin="normal" name="address" label="Address" onChange={handleChange} />

      {role === 'vendor' && (
        <TextField fullWidth margin="normal" name="businessName" label="Business Name" onChange={handleChange} />
      )}

      <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
