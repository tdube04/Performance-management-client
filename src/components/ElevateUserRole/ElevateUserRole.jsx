import React, { useState, useRef, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import swal from "sweetalert";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";

export default function ElevateUserRole() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState([]);

  // Fetch users from the database on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/getAllUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      swal({
        text: "Failed to load users from database",
        icon: "error",
        button: "OK!",
      });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    // Use ec_number (EC Number) as the username identifier since MongoDB _id maps to username in Java
    const userId = user.ec_number || user.username || user._id || "";
    const fullName = `${user.name || ""} ${user.surname || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const position = (user.positionName || "").toLowerCase();
    const division = (user.divisionName || "").toLowerCase();
    
    return (
      fullName.includes(query) ||
      userId.toLowerCase().includes(query) ||
      email.includes(query) ||
      position.includes(query) ||
      division.includes(query)
    );
  });

  // Get user ID for API calls - use username (MongoDB _id maps to username in Java)
  const getUserId = (user) => {
    return user.username;
  };

  const handleUserChange = (event, newValue) => {
    setSelectedUser(newValue);
  };

  const handleRoleChange = (event) => {
    if (event && event.target) {
      setSelectedRole(event.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation before submitting
    if (!selectedUser) {
      setMessage("Please select a user");
      return;
    }

    if (!selectedRole) {
      setMessage("Please select a role");
      return;
    }

    // Build the request to update user role
    // IMPORTANT: Use username (MongoDB _id) for the API call
    const userId = getUserId(selectedUser);
    console.log("Selected user ID:", userId, "Full object:", selectedUser);
    
    if (!userId) {
      setMessage("Unable to identify user. Please try again.");
      return;
    }
    
    const userData = {
      userRole: [selectedRole]
    };
    
    console.log("Updating user with data:", userData);
    console.log("API endpoint:", `/userEntity/updateUser/${userId}`);

    axiosClient
      .put(`/userEntity/updateUser/${userId}`, userData)
      .then((res) => {
        console.log("API Response:", res);
        swal({
          text: `User ${selectedUser.name} ${selectedUser.surname} role updated to ${selectedRole} successfully`,
          icon: "success",
          button: "OK!",
        }).then(() => {
          // Reset form
          setSelectedUser(null);
          setSelectedRole("");
          setSearchQuery("");
          // Refresh users list
          fetchUsers();
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          text: "Failed to update user role",
          icon: "error",
          button: "OK!",
        });
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };

  // Custom render for user option
  const renderUserOption = (props, option) => {
    const { key, ...restProps } = props;
    return (
      <Box
        key={key}
        component="li"
        {...restProps}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.5,
          px: 2,
          borderBottom: "1px solid #f0f0f0",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#1a237e",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {(option.name || option.ec_number || option._id || "?").charAt(0).toUpperCase()}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight={600}>
            {option.name} {option.surname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {option.ec_number || option.username || option._id} • {option.positionName || "No Position"} • {option.divisionName || "No Division"}
          </Typography>
        </Box>
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: option.enabled !== false ? "#e8f5e9" : "#ffebee",
            color: option.enabled !== false ? "#2e7d32" : "#c62828",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {option.enabled !== false ? "Active" : "Inactive"}
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Paper
        elevation={1}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "300px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5 }}>
        Search for a user and assign their role
        </Typography>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          mt: 15,
          ml: 35,
          p: 3,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
          borderTop: "7px solid #309366",
          position: "relative",
          elevation: 3,
          maxWidth: 500,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <PersonSearchIcon sx={{ color: "#1a237e", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600} color="#1a237e">
            Elevate User Role
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          {/* Search/Select User */}
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              value={selectedUser}
              onChange={handleUserChange}
              inputValue={searchQuery}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              options={filteredUsers}
              getOptionLabel={(option) => 
                `${option.name || ""} ${option.surname || ""} (${option.ec_number || option.username || option._id})`
              }
              renderOption={renderUserOption}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search User"
                  placeholder="Type name, ID, email, position or division..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              noOptionsText={
                users.length === 0 
                  ? "No users loaded" 
                  : "No users found matching your search"
              }
              sx={{ width: "100%" }}
            />
            {filteredUsers.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                Showing {filteredUsers.length} of {users.length} users
              </Typography>
            )}
          </Box>

          {/* Selected User Preview */}
          {selectedUser && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#f8f9fa",
                border: "1px solid #1a237e",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Selected User
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#1a237e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {(selectedUser.name || selectedUser.ec_number || selectedUser._id || "?").charAt(0).toUpperCase()}
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedUser.name} {selectedUser.surname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.ec_number || selectedUser.username || selectedUser._id} • {selectedUser.positionName} • {selectedUser.divisionName}
                  </Typography>
                  {selectedUser.userRole && selectedUser.userRole.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Current Role: {selectedUser.userRole.join(", ")}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Role Selection */}
          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              value={selectedRole}
              onChange={handleRoleChange}
              SelectProps={{
                native: true,
              }}
              onClick={handleInputClick}
            >
              <option value="">Select a Role</option>
              <option value="ADMIN">ADMIN - Full System Access</option>
              <option value="USER">USER - Standard Access</option>
              <option value="HC">HC - Human Capital</option>
              <option value="BOARD">BOARD - Board Member</option>
            </TextField>
          </Box>

          {/* Submit Button */}
          <Box
            className="btn-addPillar"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              className="pillar-btn"
              style={{
                borderRadius: "25px",
                padding: "14px 60px",
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: selectedUser && selectedRole ? "#309366" : "#ccc",
                color: "white",
                border: "none",
                cursor: selectedUser && selectedRole ? "pointer" : "not-allowed",
                width: "100%",
                maxWidth: "400px",
              }}
              disabled={!selectedUser || !selectedRole}
            >
              {selectedUser && selectedRole 
                ? `Elevate ${selectedUser.name} to ${selectedRole}` 
                : "Select User and Role"}
            </button>
          </Box>

          {message && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                backgroundColor: "#ffebee",
                borderRadius: 1,
                border: "1px solid #ef5350",
              }}
            >
              <Typography variant="body2" color="#c62828">
                {message}
              </Typography>
            </Box>
          )}
        </form>
      </Paper>
    </div>
  );
}
