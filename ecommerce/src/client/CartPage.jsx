import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // added loader

  const fetchCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found, user not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Defensive fallback if no items
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
      fetchCart(); // Refresh cart after deletion
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        cart.map(({ product, quantity }) => (
          <Card key={product._id} sx={{ mb: 2, display: 'flex' }}>
            <CardMedia
              component="img"
              image={product?.images?.[0] || '/placeholder.jpg'}
              alt={product?.name || 'Product'}
              sx={{ width: 150, objectFit: 'contain' }}
            />


            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography>Price: ₹{product.price}</Typography>
              <Typography>Quantity: {quantity}</Typography>
              <IconButton onClick={() => handleRemove(product._id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CartPage;
