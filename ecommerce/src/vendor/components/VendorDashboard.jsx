import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    vendor: { name: "TechWorld" },
    productCount: 5,
    orderCount: 8,
    totalRevenue: 21000,
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(21000);

  useEffect(() => {
    // Simulated products
    const fakeProducts = [
      { name: "Laptop", stock: 12 },
      { name: "Smartphone", stock: 20 },
      { name: "Tablet", stock: 8 },
      { name: "Headphones", stock: 15 },
      { name: "Keyboard", stock: 10 },
    ];

    // Simulated orders
    const fakeOrders = [
      {
        createdAt: "2024-04-01",
        totalAmount: 5000,
        paymentStatus: "completed",
        items: [{ product: { name: "Laptop", vendor: "123" }, quantity: 1 }],
      },
      {
        createdAt: "2024-04-03",
        totalAmount: 3000,
        paymentStatus: "pending",
        items: [{ product: { name: "Smartphone", vendor: "123" }, quantity: 1 }],
      },
      {
        createdAt: "2024-04-04",
        totalAmount: 2000,
        paymentStatus: "completed",
        items: [{ product: { name: "Headphones", vendor: "123" }, quantity: 2 }],
      },
      {
        createdAt: "2024-04-07",
        totalAmount: 4300,
        paymentStatus: "completed",
        items: [{ product: { name: "Keyboard", vendor: "123" }, quantity: 3 }],
      },
      {
        createdAt: "2024-04-08",
        totalAmount: 2700,
        paymentStatus: "completed",
        items: [{ product: { name: "Tablet", vendor: "123" }, quantity: 1 }],
      },
    ];

    setProducts(fakeProducts);
    setOrders(fakeOrders);
  }, []);

  const completedOrders = orders.filter(o => o.paymentStatus === "completed");
  const pendingOrders = orders.filter(o => o.paymentStatus === "pending");

  const statusData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedOrders.length, pendingOrders.length],
        backgroundColor: ["#28a745", "#ffc107"],
      },
    ],
  };

  const stockData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Stock",
        data: products.map(p => p.stock),
        backgroundColor: "#007bff",
      },
    ],
  };

  const salesTrend = {
    labels: orders.map(o => new Date(o.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Revenue",
        data: orders.map(o => o.totalAmount),
        borderColor: "#17a2b8",
        fill: false,
      },
    ],
  };

  const topMap = {};
  orders.forEach(o => {
    (o.items || []).forEach(it => {
      const name = it.product.name;
      topMap[name] = (topMap[name] || 0) + it.quantity;
    });
  });

  const topNames = Object.keys(topMap);
  const topData = {
    labels: topNames,
    datasets: [
      {
        label: "Units Sold",
        data: topNames.map(n => topMap[n]),
        backgroundColor: "#dc3545",
      },
    ],
  };

  return (
    <div className="vd-container">
      <h1 className="vd-title">
        {stats.vendor.name ? `${stats.vendor.name}’s Dashboard` : "Vendor Dashboard"}
      </h1>

      <div className="stat-cards">
        <div className="stat-card">
          <h3>Products</h3>
          <p>{stats.productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p>{completedOrders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Sales</h3>
          <p>₹{sales}</p>
        </div>
      </div>

      <div className="vd-chart-row">
        <div className="vd-section">
          <h2>Order Status</h2>
          <Doughnut data={statusData} />
        </div>
        <div className="vd-section">
          <h2>Stock Levels</h2>
          <Bar data={stockData} />
        </div>
      </div>

      <div className="vd-chart-row">
        <div className="vd-section">
          <h2>Sales Trend</h2>
          <Line data={salesTrend} />
        </div>
        <div className="vd-section">
          <h2>Top Selling Products</h2>
          <Bar data={topData} />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
