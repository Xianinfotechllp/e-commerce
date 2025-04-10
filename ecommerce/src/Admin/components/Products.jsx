import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API_URL = "http://localhost:5000/api/products";
const categories = ["Electronics", "Furniture", "Clothing", "Books"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: "",
    price: "",
    category: "",
    description: "", // Added description field
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response.data)
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
    } else {
      setIsEditing(false);
      setCurrentProduct({ _id: null, name: "", price: "", category: "", description: "", image: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({ _id: null, name: "", price: "", category: "", description: "", image: "" });
    setImageFile(null);
  };

  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    try {
        const formData = new FormData();
        formData.append("name", currentProduct.name);
        formData.append("price", currentProduct.price);
        formData.append("category", currentProduct.category);
        formData.append("description", currentProduct.description);
        if (imageFile) formData.append("image", imageFile);

        console.log("Form Data Entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Debugging to ensure data is sent
        }

        const response = isEditing
            ? await axios.put(`${API_URL}/${currentProduct._id}`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              })
            : await axios.post(API_URL, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              });

        console.log("Response:", response.data);
        fetchProducts();
        handleClose();
    } catch (error) {
        console.error("Error saving product:", error.response ? error.response.data : error.message);
    }
};




  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" p={4}>
      <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom fontWeight="bold" color="primary">
        Product Management
      </Typography>

      <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>
        Add Product
      </Button>

      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 5, borderRadius: 2, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price ($)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`${product.images[0]}`} // Ensure correct URL
                      alt={product.name}
                      width="50"
                      height="50"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">No Image</Typography>
                  )}
                </TableCell>


                <TableCell>
                  <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                      <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleOpen(product)}>
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(product._id)}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" fullWidth value={currentProduct.name} onChange={handleChange} />
          <TextField label="Price" name="price" type="number" fullWidth value={currentProduct.price} onChange={handleChange} />
          <InputLabel sx={{ mt: 2 }}>Category</InputLabel>
          <Select fullWidth name="category" value={currentProduct.category} onChange={handleChange}>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
          <TextField label="Description" name="description" fullWidth multiline rows={3} value={currentProduct.description} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "16px" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;

