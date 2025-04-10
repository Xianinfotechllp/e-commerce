import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";
import { getCoupons } from "../api/couponApi";

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const fetchCoupons = async () => {
        try {
            const response = await getCoupons();
            setCoupons(response.data);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Admin Coupon Manager</Typography>
            <Button variant="contained" color="primary" onClick={() => { setSelectedCoupon(null); setOpen(true); }}>
                Add New Coupon
            </Button>
            <CouponList coupons={coupons} refreshCoupons={fetchCoupons} openEdit={(coupon) => { setSelectedCoupon(coupon); setOpen(true); }} />
            <CouponForm open={open} handleClose={() => setOpen(false)} selectedCoupon={selectedCoupon} refreshCoupons={fetchCoupons} />
        </Container>
    );
};

export default AdminCoupons;
