import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Empty from '../utils/Empty';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user not authenticated.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`https://e-commerce-4jpl.onrender.com/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = res?.data?.cart?.items || [];
      setCart(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://e-commerce-4jpl.onrender.com/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return acc + price * quantity;
    }, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: '90vh', backgroundColor: '#f1f3f6' }}>
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        fontFamily="monospace"
        mb={4}
      >
        My Cart ({cart.length})
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : cart.length === 0 ? (
        <Empty />
      ) : (
        <Grid container spacing={3}>
          {/* Left: Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ maxHeight: '75vh', overflowY: 'auto', pr: 2 }}>
              {cart.map(({ product, quantity }, index) => {
                if (!product) return null;
                return (
                  <Card
                    key={product._id || index}
                    sx={{
                      display: 'flex',
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 2,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name || 'Product'}
                      sx={{ width: 130, height: 130, objectFit: 'contain', mr: 2 }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        Quantity: {quantity}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        ₹{product.price} x {quantity} = ₹{product.price * quantity}
                      </Typography>
                      <Box mt={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemove(product._id)}
                          startIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Grid>

          {/* Right: Summary Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: 3,
                width:'800px',
                marginTop:'50px',
                ml:4
              }}
            >
              <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
                Price Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total Items</Typography>
                <Typography>{cart.length}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total Price</Typography>
                <Typography fontWeight="bold">₹{getTotalPrice()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Delivery Charges</Typography>
                <Typography color="success.main">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Amount Payable
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  ₹{getTotalPrice()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                onClick={() => navigate('/checkout-all')}
              >
                Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CartPage;
