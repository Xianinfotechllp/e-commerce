import React, { useEffect, useState } from 'react';
import {
    AppBar, Toolbar, Typography, InputBase, IconButton,
    Drawer, List, ListItem, ListItemText, Slider, Box,
    Grid, Card, CardMedia, CardContent, CardActions, Button,
    Divider, Badge,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartBadge from './CartBadge';
import { toast } from 'react-toastify'
import shopImg from "../images/shop.jpg";

const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books'];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
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
            toast.success('Product added to cart')
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
        const confirmed = window.confirm('Are you sure you want to log out?');
        if (confirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            toast.warning("logout successful")
            navigate('/');
        }
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
                        <Badge color="error" >
                            <CartBadge />
                        </Badge>
                    </IconButton>
                    {userId ? <Button onClick={() => handleLogout()} sx={{ color: 'white', marginLeft: '3px', border: '1px solid grey' }}>LogOut</Button> :
                        <Button sx={{ color: 'white', marginLeft: '3px', border: '1px solid grey' }}><Link style={{ color: 'white', textDecoration: 'none' }} to={'/login'}>Login</Link></Button>
                    }                </Toolbar>
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


                <Paper sx={{ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                    {/* Overlay Text */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '25%',
                            left: '5%',
                            zIndex: 2,
                            color: '#fff',
                            backdropFilter: 'blur(6px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            padding: '24px 32px',
                            borderRadius: 2,
                            maxWidth: '45%',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                letterSpacing: '0.5px',
                                mb: 1,
                            }}
                        >
                            Elevate Your Shopping Experience
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '1.1rem',
                                color: '#ddd',
                            }}
                        >
                            Browse premium collections with unbeatable offers curated just for you.
                        </Typography>
                    </Box>

                    {/* Image */}
                    <img
                        src={shopImg}
                        alt="Shop Banner"
                        style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                            filter: 'brightness(90%)',
                        }}
                    />
                </Paper>
                {/* common grid */}
                {/* Section: All Products */}
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    All Products
                </Typography>
                <Grid container spacing={2}>
                    {filteredProducts.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    height: 370,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={product.images?.[0]}
                                    alt={product.name}
                                    sx={{
                                        height: 150,
                                        width: '190px',
                                        objectFit: 'contain',
                                        p: 1,
                                        cursor: 'pointer',
                                        backgroundColor: '#f9f9f9',
                                        borderBottom: '1px solid #eee',
                                    }}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {product.category}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary">
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2 }}>
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


                {/* Section: Electronics */}
                <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                    Electronics
                </Typography>
                <Grid container spacing={2}>
                    {filteredProducts
                        .filter(product => product.category === 'Electronics')
                        .map((product) => (
                            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                                {/* same card */}
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
                                        sx={{ height: 150, objectFit: 'contain', width: '190px', p: 1, cursor: 'pointer' }}
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
                </Grid>
                {/* Section: Electronics */}
                <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                    Furnitures
                </Typography>
                <Grid container spacing={2}>
                    {filteredProducts
                        .filter(product => product.category === 'Furniture')
                        .map((product) => (
                            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                                {/* same card */}
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
                                        sx={{ height: 150, objectFit: 'contain', width: '190px', p: 1, cursor: 'pointer' }}
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
                </Grid>

                {/* Section: Books */}
                <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                    Books
                </Typography>
                <Grid container spacing={2}>
                    {filteredProducts
                        .filter(product => product.category === 'Books')
                        .map((product) => (
                            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                                {/* same card */}
                                <Card
                                    sx={{
                                        height: 370,
                                        width:190,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={product.images?.[0]}
                                        alt={product.name}
                                        sx={{ height: 150, objectFit: 'contain', p: 1, width: '190px', cursor: 'pointer', }}
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
                </Grid>


            </Box>
        </Box>
    );
};

export default Home;


