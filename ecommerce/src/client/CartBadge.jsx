import React, { useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react'
import axios from 'axios';

const CartBadge = () => {
    const [cartCount, setCartCount] = useState(0)
    const fetchCart = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, user not authenticated.");
            return;
        }

        try {
            const res = await axios.get(`https://e-commerce-4jpl.onrender.com/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Defensive fallback if no items
            const items = res?.data?.cart?.items || [];
            setCartCount(items.length);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {

        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart()
    }, [])
    
    return (
        <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartCount} color="error" showZero>
                <ShoppingCartIcon />
            </Badge>
        </IconButton>
    );
};

export default CartBadge;
