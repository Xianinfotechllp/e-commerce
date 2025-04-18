import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, TextField, Button, Paper, Divider, CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutAllForm = () => {
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res?.data?.cart?.items || [];
      const validItems = items.filter(item => item.product && item.product.price); // filter invalid ones
      setCart(validItems);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  const validate = () => {
    const newErrors = {};
    Object.entries(address).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = 'Required';
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
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      alert('User not logged in');
      return;
    }

    const items = cart.map(({ product, quantity }) => ({
      product: product._id,
      vendor: product.vendor?._id || product.vendor,
      quantity,
      price: product.price,
    }));

    const orderData = {
      user: userId,
      items,
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      address: `${address.fullName}, ${address.street}, ${address.city}, ${address.state} - ${address.zip}, Phone: ${address.phone}`,
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/orders/create', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('❌ Order Error:', error.response?.data || error.message);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ p: 4, minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Cart is empty. Please add products before checkout.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: '90vh', backgroundColor: '#f1f3f6' }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontFamily: 'cursive' }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Address Form */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: '#fdfdfd',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              sx={{ color: '#333', mb: 2 }}
            >
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
                <Grid
                  item
                  xs={12}
                  sm={field.name === 'phone' ? 12 : 6}
                  key={field.name}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={address[field.name]}
                    onChange={handleChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                        backgroundColor: '#fff',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc',
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '& .MuiFormHelperText-root': {
                        mt: 0.5,
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>


        {/* Order Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'center',width:'100%' }}>
          <Grid item xs={12} md={6} minWidth={800}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                {cart.map(({ product, quantity }, idx) => {
                  if (!product) return null; // skip invalid products

                  return (
                    <Box key={product._id || idx} display="flex" gap={2} alignItems="center" mb={2} overflow={scrollX}>
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={product.name || 'Product'}
                        style={{ width: 80, height: 80, objectFit: 'contain' }}
                      />
                      <Box>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {quantity}
                        </Typography>
                        <Typography variant="body1">
                          ₹{product.price} x {quantity} = ₹{product.price * quantity}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

              </Box>

              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1" fontWeight={500}>Total</Typography>
                <Typography variant="body1" fontWeight={600}>
                  ₹{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Box>

  );
};

export default CheckoutAllForm;
