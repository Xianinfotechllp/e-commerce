import Product from "../../model/productModel.js";
import { cloudinary } from "../../utils/cloudinary.js";

// Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    let imageUrls = [];
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageUrls.push(uploadResult.secure_url);
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Products (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};
// Controller
export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    let updatedFields = { name, price, category, description };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      // Replace old image with new one
      updatedFields.images = [uploadResult.secure_url];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // No need to delete from Cloudinary unless you store public_id

    await Product.findByIdAndDelete(req.params.productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};
