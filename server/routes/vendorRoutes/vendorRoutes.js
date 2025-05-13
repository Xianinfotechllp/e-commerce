import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  registerVendor,
  loginVendor,
  getVendorProducts,
} from "../../controllers/vendor/productController.js";
import { upload } from "../../utils/cloudinary.js";
import { protect, isVendor } from "../../middlewares/authmiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerVendor);
router.post("/login", loginVendor);

// Protected (Vendor only)
router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get("/my-products", protect, isVendor, getVendorProducts);
router.post("/add", protect, isVendor, upload.single("image"), createProduct);
router.put("/update/:id", protect, isVendor, upload.single("image"), updateProduct);
router.delete("/delete/:id", protect, isVendor, deleteProduct);
export default router;
