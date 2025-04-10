import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  address:      { type: String },
  businessName: { type: String },
  role:         { type: Number, default: 1 },
  createdAt:    { type: Date, default: Date.now }
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
