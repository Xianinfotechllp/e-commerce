import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel,
  Button, TextField
} from "@mui/material";
import axios from "axios";
import FileDownload from "js-file-download";

const VendorOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        deliveryStatus: newStatus,
      });
      fetchOrders(); // Refresh
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleExport = () => {
    const filtered = filterStatus
      ? orders.filter((o) => o.deliveryStatus === filterStatus)
      : orders;

    const csvHeader = "OrderID,User,Vendor,Amount,Status\n";
    const csvData = filtered.map((o) =>
      `${o._id},${o.user?.name || ""},${o.vendor?.name || ""},₹${o.totalAmount},${o.deliveryStatus}`
    ).join("\n");

    FileDownload(csvHeader + csvData, "orders.csv");
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.deliveryStatus === filterStatus)
    : orders;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Order Management</Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleExport}>
          Export CSV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>{order.vendor?.name}</TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>{order.deliveryStatus}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={order.deliveryStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VendorOrderManagement;
