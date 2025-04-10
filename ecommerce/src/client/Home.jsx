import React, { useEffect, useState } from 'react';
import {
    AppBar, Toolbar, Typography, InputBase, IconButton,
    Drawer, List, ListItem, ListItemText, Slider, Box,
    Grid, Card, CardMedia, CardContent, CardActions, Button,
    Divider, Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books'];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0); // Static count for now
    const userId = localStorage.getItem('userId');

    const navigate = useNavigate();

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert('Please login to add products to cart');
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
            setCartCount(prev => prev + 1);
            alert('Product added to cart');
        } catch (err) {
            console.error('Error adding to cart:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Failed to add to cart');
        }
    };


    

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCategorySelect = (category) => setSelectedCategory(category);
    const handlePriceChange = (e, newVal) => setPriceRange(newVal);

    const filteredProducts = products.filter((product) => {
        const inCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const inPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const inSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return inCategory && inPrice && inSearch;
    });
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ mr: 2 }}>
                        Cosysta Eccomerce
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', px: 1, borderRadius: 1 }}>
                        <InputBase
                            placeholder="Search…"
                            sx={{ ml: 1, flex: 1 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IconButton type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    {/* Cart Badge Icon */}
                    <IconButton color="inherit" onClick={() => navigate('/cart')} sx={{ ml: 2, mr: 2 }}>
                        <Badge badgeContent={cartCount} color="error" showZero>
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                    <Button onClick={() => handleLogout()} sx={{ color: 'white', marginLeft: '3px', border: '1px solid grey' }}>LogOut</Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 13,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 260,
                        boxSizing: 'border-box',
                        mt: '64px',
                        p: 2,
                        height: 'calc(100vh - 64px)',
                        overflowY: 'auto'
                    }
                }}
            >
                {/* Category Filter */}
                <Typography variant="h6">Category</Typography>
                <List dense>
                    {categories.map((cat) => (
                        <ListItem
                            button
                            key={cat}
                            selected={selectedCategory === cat}
                            onClick={() => handleCategorySelect(cat)}
                        >
                            <ListItemText primary={cat} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />

                {/* Price Filter */}
                <Typography variant="h6">Price Range</Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200000}
                    sx={{ mt: 1 }}
                />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: '64px',
                    ml: '260px',
                    minHeight: 'calc(100vh - 64px)',
                    bgcolor: '#f5f5f5'
                }}
            >
                <Grid container spacing={1}>
                    {filteredProducts.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    width: 190,
                                    height: 370,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    objectFit: 'contain',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={product.images?.[0]}
                                    alt={product.name}
                                    sx={{ height: 150, objectFit: 'contain', p: 1 }}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {product.category}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleAddToCart(product._id)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>

                            </Card>
                        </Grid>
                    ))}
                    {filteredProducts.length === 0 && (
                        <Typography variant="h6" sx={{ m: 4 }}>
                            No products found with selected filters.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default Home;
