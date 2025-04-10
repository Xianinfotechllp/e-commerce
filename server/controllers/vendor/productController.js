import Vendor from "../../model/vendorModel.js";
import Product from "../../model/productModel.js";
import { cloudinary } from "../../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Vendor


export const registerVendor = async (req, res) => {
  try {
    const { name, email, password, address, businessName } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({
      name,
      email,
      password: hashedPassword,
      address,
      businessName,
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendor: {
        _id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        role: newVendor.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};


// Login Vendor
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Use _id so your middleware works
    const token = jwt.sign({ _id: vendor._id, role: vendor.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};


// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image required" });

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [result.secure_url],
      vendor: req.user.id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, stock } = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.images = [result.secure_url];
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// getmyproducts
export const getVendorProducts = async (req, res) => {
    try {
      const products = await Product.find({ vendor: req.user.id });
      res.status(200).json({ success: true, products });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user.id,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
