import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(true);

  // Simulating fetching user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("admin"));
    if (storedUser) {
      setAdmin(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin"); // Remove admin data
    setAdmin(null);
    navigate("/login"); // Redirect to login
  };
  

  const handleDashboard = () => {
    navigate("/dashboard"); // Redirect to login
  };
  

  return (
    <>
    <nav style={styles.navbar}>
      <h2>My App</h2>

      <div style={styles.links}>
        {admin ? (
          <>
            <span style={styles.adminName}>Welcome, {admin.name}!Aravind</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
            <button onClick={handleDashboard} style={styles.button}>Dashboard</button>
          </>
        ) : (
          <Link to="/login" style={styles.button}>Login</Link>
        )}
      </div>
    </nav>
    </>
    
  );
};

// Simple inline styles for the navbar
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#333",
    color: "#fff"
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  adminName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  button: {
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default NavBar;
