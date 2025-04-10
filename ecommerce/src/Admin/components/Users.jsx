import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: 1, suspended: false },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: 0, suspended: false },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: 0, suspended: true },
];

const getRoleName = (role) => {
  return role === 1 ? "Admin" : "User";
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleSuspend = (id) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, suspended: !user.suspended } : user
    );
    setUsers(updated);
  };

  const handleAssignAdmin = (id) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, role: user.role === 1 ? 0 : 1 } : user
    );
    setUsers(updated);
  };

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" padding={4}>
      <Paper sx={{ width: "100%", maxWidth: 1000, p: 4, textAlign: "center", boxShadow: 5, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Users Management
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleName(user.role)}</TableCell>
                  <TableCell>
                    <Typography color={user.suspended ? "error" : "green"}>
                      {user.suspended ? "Suspended" : "Active"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item>
                        <Button
                          variant="contained"
                          color={user.suspended ? "warning" : "error"}
                          startIcon={<BlockIcon />}
                          onClick={() => handleSuspend(user.id)}
                        >
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<AdminPanelSettingsIcon />}
                          onClick={() => handleAssignAdmin(user.id)}
                        >
                          {user.role === 1 ? "Revoke Admin" : "Make Admin"}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                        >
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
      </Paper>
    </Box>
  );
};

export default Users;
