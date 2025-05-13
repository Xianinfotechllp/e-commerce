import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutForm = () => {
  const { state } = useLocation(); // Get product data passed via Order Now
  const navigate = useNavigate();

  const product = state?.product;

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    Object.entries(address).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'Required';
      }
    });

    if (address.phone && !/^[0-9]{10}$/.test(address.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (address.zip && !/^[0-9]{5,6}$/.test(address.zip)) {
      newErrors.zip = 'Invalid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
  
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // assuming user info is stored here
  
    if (!token || !userId) {
      alert('User not logged in');
      return;
    }
  
    const orderData = {
      user: userId, // ✅ Add this!
      items: [
        {
          product: product._id,
          vendor: product.vendor, // must be a valid vendor ID
          quantity: 1,
          price: product.price,   // ✅ Required based on backend validation
        },
      ],
      totalAmount: product.price,
      address: `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.zip}, Phone: ${address.phone}`,
    };
  
    try {
      const res = await axios.post(
        'https://e-commerce-4jpl.onrender.com/api/orders/create',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('❌ Order Error:', error.response?.data || error.message);
      alert('Failed to place order. Please check the form and try again.');
    }
  };
  

  if (!product) {
    return <Typography p={4}>No product found. Please select a product to order.</Typography>;
  }

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* Address Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Full Name', name: 'fullName' },
                { label: 'Street Address', name: 'street' },
                { label: 'City', name: 'city' },
                { label: 'State', name: 'state' },
                { label: 'ZIP Code', name: 'zip' },
                { label: 'Phone Number', name: 'phone' },
              ].map((field) => (
                <Grid item xs={12} sm={field.name === 'phone' ? 12 : 6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={address[field.name]}
                    onChange={handleChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box display="flex" gap={2} alignItems="center">
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: 80, height: 80, objectFit: 'contain' }}
              />
              <Box>
                <Typography variant="subtitle1">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>
                <Typography variant="h6">₹{product.price}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" gutterBottom>
              Subtotal: ₹{product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Shipping: ₹0 (Free)
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total: ₹{product.price}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutForm;
