import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, Typography, Card, CardContent,
  CardMedia, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";

const VendorProductManager = () => {
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", stock: "", image: null,
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // ✅ Fix: use correct key
  // Vendor token

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vendors/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleAdd = async () => {
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    try {
      await axios.post("http://localhost:5000/api/vendors/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      await axios.put(`http://localhost:5000/api/vendors/update/${editingProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEditingProduct(null);
      setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vendors/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>Add New Product</Typography>
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
        <TextField label="Price" name="price" value={form.price} onChange={handleChange} />
        <TextField label="Category" name="category" value={form.category} onChange={handleChange} />
        <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <Button variant="contained" onClick={handleAdd}>Add Product</Button>
      </Box>

      <Typography variant="h5" mb={2}>Your Products</Typography>
      {loading ? (
        <Typography>Loading products...</Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {products.map((product) => (
            <Card key={product._id} sx={{ width: 250 }}>
              <CardMedia
                component="img"
                height="140"
                image={product.images?.[0] || "https://via.placeholder.com/150"}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>₹{product.price}</Typography>
                <Typography>{product.category}</Typography>
                <Button size="small" onClick={() => {
                  setEditingProduct(product);
                  setForm({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    stock: product.stock,
                    image: null,
                  });
                }}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(product._id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
          <TextField label="Price" name="price" value={form.price} onChange={handleChange} />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} />
          <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorProductManager;
