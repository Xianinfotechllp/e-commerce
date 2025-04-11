import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Grid,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Empty from '../utils/Empty';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user not authenticated.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/cart`, {
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
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
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
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return  (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f1f3f6' }}>
      <Typography style={{fontFamily:'cursive',textAlign:'center'}} variant="h5" gutterBottom fontWeight={600}>
        My Cart ({cart.length})
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : cart.length === 0 ? (
        <Empty/>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items Section */}
          <Grid item xs={12} md={8}>
            {cart.map(({ product, quantity }) => (
              <Card key={product._id} sx={{ display: 'flex', mb: 2, p: 2, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={product?.images?.[0] || '/placeholder.jpg'}
                  alt={product?.name || 'Product'}
                  sx={{ width: 130, height: 130, objectFit: 'contain', mr: 2 }}
                />

                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
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
            ))}
          </Grid>

          {/* Price Summary Section */}
          <Grid item xs={12} md={4} sx={{display:'flex',justifyContent:'center'}}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2,width:'800px',height:'400px',display:'flex',justifyContent:'center',flexDirection:'column' }}>
              <Typography sx={{textAlign:'center'}} variant="h4" gutterBottom>
                Price Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography >Total Items</Typography>
                <Typography>{cart.length}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total Price</Typography>
                <Typography fontWeight={600}>₹{getTotalPrice()}</Typography>
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
                sx={{ mt: 2, py: 1.5 }}
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
