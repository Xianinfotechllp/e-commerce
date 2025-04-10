import Coupon from '../../model/couponModel.js'
// 🟢 Create Coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;

        // Ensure unique coupon code
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists!" });
        }

        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            expiryDate,
            usageLimit,
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 🟢 Get All Coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Get Single Coupon
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Update Coupon
export const updateCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, usageLimit, isActive } = req.body;
        const { id } = req.params;

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { code, discountType, discountValue, expiryDate, usageLimit, isActive },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.json(updatedCoupon);
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Delete Coupon
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🟢 Validate Coupon (During Checkout)
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        // Check if the coupon is expired
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        // Check if the usage limit is exceeded
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit exceeded" });
        }

        res.json({ 
            valid: true, 
            discountType: coupon.discountType, 
            discountValue: coupon.discountValue 
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ message: "Server error" });
    }
};
