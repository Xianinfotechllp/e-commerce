import React, { useState, useEffect } from "react";
import { 
    Button, TextField, MenuItem, Dialog, DialogActions, DialogContent, 
    DialogTitle 
} from "@mui/material";
import { createCoupon, updateCoupon } from "../api/couponApi";
import dayjs from "dayjs";

const CouponForm = ({ open, handleClose, selectedCoupon, refreshCoupons }) => {
    const [coupon, setCoupon] = useState({
        code: "",
        discountType: "fixed",
        discountValue: "",
        expiryDate: "",
        usageLimit: ""
    });

    useEffect(() => {
        if (selectedCoupon) {
            setCoupon({ ...selectedCoupon, expiryDate: dayjs(selectedCoupon.expiryDate).format("YYYY-MM-DD") });
        } else {
            setCoupon({ code: "", discountType: "fixed", discountValue: "", expiryDate: "", usageLimit: "" });
        }
    }, [selectedCoupon]);

    const handleChange = (e) => {
        setCoupon({ ...coupon, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (selectedCoupon) {
                await updateCoupon(selectedCoupon._id, coupon);
            } else {
                await createCoupon(coupon);
            }
            refreshCoupons();
            handleClose();
        } catch (error) {
            console.error("Error saving coupon:", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
            <DialogContent>
                <TextField label="Code" name="code" value={coupon.code} onChange={handleChange} fullWidth margin="normal" />
                <TextField select label="Discount Type" name="discountType" value={coupon.discountType} onChange={handleChange} fullWidth margin="normal">
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                </TextField>
                <TextField label="Discount Value" name="discountValue" type="number" value={coupon.discountValue} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Expiry Date" name="expiryDate" type="date" value={coupon.expiryDate} onChange={handleChange} fullWidth margin="normal" />
                <TextField label="Usage Limit" name="usageLimit" type="number" value={coupon.usageLimit} onChange={handleChange} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {selectedCoupon ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CouponForm;
