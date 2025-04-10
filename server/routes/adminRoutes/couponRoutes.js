import express from "express";
import { 
    createCoupon, 
    getAllCoupons, 
    getCouponById, 
    updateCoupon, 
    deleteCoupon, 
    validateCoupon 
} from "../../controllers/admin/couponController.js";

const router = express.Router();

// 🟢 Create Coupon
router.post("/", createCoupon);

// 🟢 Get All Coupons
router.get("/", getAllCoupons);

// 🟢 Get Single Coupon
router.get("/:id", getCouponById);

// 🟢 Update Coupon
router.put("/:id", updateCoupon);

// 🟢 Delete Coupon
router.delete("/:id", deleteCoupon);

// 🟢 Validate Coupon (For Checkout)
router.post("/validate", validateCoupon);

export default router;
