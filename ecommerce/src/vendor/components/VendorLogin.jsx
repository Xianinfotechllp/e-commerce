// src/vendor/components/VendorLogin.jsx
import React, { useState } from "react";
import axios from "../../vendor/api/api.js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const VendorLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/vendors/login", formData);
      localStorage.setItem("vendorToken", res.data.token);
      setMessage("Login successful!");
      navigate("/vendor");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Vendor Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </Box>
        </form>

        {message && (
          <Alert severity={message.includes("success") ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default VendorLogin;
