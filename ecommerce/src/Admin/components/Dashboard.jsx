import React from "react";
import { Box, Grid, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StoreIcon from "@mui/icons-material/Store";

Chart.register(...registerables);

const Dashboard = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Revenue ($)",
        data: [4000, 6000, 8000, 7500, 9000, 11000, 10500],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ["Electronics", "Fashion", "Home & Kitchen"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#4CAF50", "#FFC107", "#E91E63"],
      },
    ],
  };

  const orders = [
    { id: "#001", customer: "John Doe", amount: "$120", status: "Completed" },
    { id: "#002", customer: "Jane Smith", amount: "$85", status: "Pending" },
    { id: "#003", customer: "Chris Johnson", amount: "$200", status: "Completed" },
    { id: "#004", customer: "Robert Brown", amount: "$150", status: "Shipped" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#f4f6f8", p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#2c3e50" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {[{ title: "Total Users", value: "1,245", color: "#2196F3", icon: <PeopleIcon /> },
          { title: "Total Orders", value: "520", color: "#4CAF50", icon: <ShoppingCartIcon /> },
          { title: "Revenue", value: "$45K", color: "#FFC107", icon: <MonetizationOnIcon /> },
          { title: "Vendors", value: "87", color: "#E91E63", icon: <StoreIcon /> }].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: "10%", boxShadow: 4, bgcolor: "white" }}>
              <IconButton sx={{ bgcolor: stat.color, color: "white", mb: 1, p: 2, borderRadius: "50%" }}>
                {stat.icon}
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>{stat.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, color: stat.color }}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 6, bgcolor: "white",width:'800px' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Sales Overview</Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 6, bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Top Categories</Typography>
            <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Doughnut data={categoryData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 6, bgcolor: "white",width:'1250px' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Recent Orders</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Order ID</b></TableCell>
                    <TableCell><b>Customer</b></TableCell>
                    <TableCell><b>Amount</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
