import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      toast.error('Product not found')
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token || !userId) {
      toast.error('Please login to add products to cart');
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:5000/api/cart/add/${productId}`,
        {
          userId, // ⬅️ make sure backend expects this
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      toast.success('Product added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };
  

  const handleOrderNow = () => {
    navigate('/checkout', { state: { product } });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Typography p={4}>{error}</Typography>;

  return (
    <Box p={4}>
      <Paper elevation={3}>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} md={5}>
            <img
              src={product.images?.[0]}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>{product.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>Category: {product.category}</Typography>
            <Typography variant="h5" color="primary" gutterBottom>₹{product.price}</Typography>
            <Typography variant="body1" gutterBottom>In Stock: {product.stock}</Typography>
            <Typography variant="body2" color="textSecondary">{product.description}</Typography>

            <Box mt={4} display="flex" gap={2}>
              {token  && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              )}

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOrderNow}
              >
                Order Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductPage;
