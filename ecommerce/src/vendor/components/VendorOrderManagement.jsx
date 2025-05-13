import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const VendorOrderManagement = () => {
  const vendorId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `https://e-commerce-4jpl.onrender.com/api/orders/vendor/${vendorId}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://e-commerce-4jpl.onrender.com/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchOrders();
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  const handleExport = () => {
    const filtered = filterStatus
      ? orders.filter((o) => o.status === filterStatus)
      : orders;
  
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Vendor Order Report", 14, 22);
  
    const tableColumn = [
      "Order ID",
      "User",
      "Product",
      "Vendor",
      "Qty",
      "Amount (₹)",
      "Status",
    ];
  
    const tableRows = [];
  
    filtered.forEach((order) => {
      order.items.forEach((item) => {
        if (item.vendor?._id === vendorId) {
          tableRows.push([
            order._id,
            order.user?.name || "",
            item.product?.name || "",
            item.vendor?.name || "",
            item.quantity,
            (item.product?.price * item.quantity).toFixed(2),
            order.status,
          ]);
        }
      });
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      styles: { fontSize: 10 },
    });
  
    doc.save("orders.pdf");
  };
  

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Vendor Order Management
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleExport}>
          Export PDF
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const vendorItems = order.items.filter(
                  (item) => item.vendor?._id === vendorId
                );

                if (vendorItems.length === 0) return null;

                return (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.user?.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedItems(vendorItems);
                          setOpenModal(true);
                        }}
                      >
                        View Products ({vendorItems.length})
                      </Button>
                    </TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Products */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Products
          <IconButton
            edge="end"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>{item.vendor?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorOrderManagement;
