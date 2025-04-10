import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["fixed", "percentage"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // null means unlimited
    usedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
