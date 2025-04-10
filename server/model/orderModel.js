const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // Replaced userId with user
    vendor:  { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon"
    },    
    items: [
      {
        product:  { type: Object, required: true },   // Full product object
        quantity: { type: Number, required: true, min: 1 }
      }
    ],

    totalAmount:    { type: Number, required: true },
    paymentStatus:  { type: String, enum: ["pending", "completed"], default: "pending" },
    deliveryStatus: { type: String, enum: ["pending", "shipped", "completed"], default: "pending" },
    address:        { type: String, required: true }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

