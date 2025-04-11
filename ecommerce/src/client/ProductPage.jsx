import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Rating,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      toast.error('Product not found');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token || !userId) {
      toast.error('Please login to add products to cart');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/cart/add/${productId}`,
        {
          userId,
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
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleOrderNow = () => {
    navigate('/checkout', { state: { product } });
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment) return toast.error('Please provide rating and comment');

    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Review submitted');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box p={3} bgcolor="#f5f5f5" minHeight="100vh">
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.images?.[0]}
              alt={product.name}
              sx={{
                width: '100%',
                maxWidth: 500,
                height: 'auto',
                maxHeight: 450,
                objectFit: 'contain',
                borderRadius: 2,
                backgroundColor: '#fff',
                boxShadow: 2,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              {product.name}
            </Typography>
            <Chip label={product.category} color="secondary" sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />

            <Typography variant="h5" color="primary" gutterBottom>
              ₹{product.price}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>In Stock:</strong> {product.stock}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              {token && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ px: 3, py: 1.2, borderRadius: 2 }}
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              )}

              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
                onClick={handleOrderNow}
              >
                Order Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* REVIEW SECTION */}
      <Box mt={5}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Customer Reviews
        </Typography>

        {/* Submit Review */}
        {token && (
          <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }} elevation={2}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Leave a Review
            </Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={1}
            />
            <Box mt={2}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  borderColor: '#ccc',
                  fontSize: '1rem',
                  resize: 'none',
                }}
                placeholder="Write your review..."
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, px: 4, py: 1.2 }}
              onClick={handleReviewSubmit}
            >
              Submit Review
            </Button>
          </Paper>
        )}

        {/* Display Reviews */}
        <Box mt={3}>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet.
            </Typography>
          ) : (
            reviews.map((review) => (
              <Paper key={review._id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography fontWeight={600}>{review.name}</Typography>
                  <Rating value={review.rating} readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(review.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductPage;
