import React from "react";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button 
} from "@mui/material";
import { deleteCoupon } from "../api/couponApi";

const CouponList = ({ coupons, refreshCoupons, openEdit }) => {
    const handleDelete = async (id) => {
        try {
            await deleteCoupon(id);
            refreshCoupons();
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Expiry</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {coupons.map((coupon) => (
                        <TableRow key={coupon._id}>
                            <TableCell>{coupon.code}</TableCell>
                            <TableCell>{coupon.discountType}</TableCell>
                            <TableCell>{coupon.discountValue}</TableCell>
                            <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button onClick={() => openEdit(coupon)} variant="contained" color="warning" size="small">Edit</Button>
                                <Button onClick={() => handleDelete(coupon._id)} variant="contained" color="error" size="small" style={{ marginLeft: 8 }}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CouponList;
