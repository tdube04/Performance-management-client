import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";

import swal from "sweetalert";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";

const AVAILABLE_ROLES = [
  { value: "ADMIN", label: "Admin", description: "Full system access", color: "#0066cc", icon: <AdminPanelSettingsIcon /> },
  { value: "USER", label: "User", description: "Standard access", color: "#34c759", icon: <BadgeIcon /> },
  { value: "HC", label: "Human Capital", description: "HC operations", color: "#af52de", icon: <PersonSearchIcon /> },
  { value: "BOARD", label: "Board", description: "Board member", color: "#ff3b30", icon: <GroupsIcon /> }
];

export default function ElevateUserRole() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const userId = user.ec_number || user.username || user._id || "";
    const fullName = `${user.name || ""} ${user.surname || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const position = (user.positionName || "").toLowerCase();
    
    return (
      fullName.includes(query) ||
      userId.toLowerCase().includes(query) ||
      email.includes(query) ||
      position.includes(query)
    );
  });

  const getUserId = (user) => user.username;

  const handleUserChange = (event, newValue) => {
    setSelectedUser(newValue);
    setMessage(null);
  };

  const handleAddRole = async (roleToAdd) => {
    if (!selectedUser) return;
    
    const currentRoles = selectedUser.userRole || [];
    if (currentRoles.includes(roleToAdd)) {
      swal({
        text: "User already has this role",
        icon: "warning",
        button: "OK!",
      });
      return;
    }

    setLoading(true);
    const newRoles = [...currentRoles, roleToAdd];
    
    try {
      const userData = {
        username: selectedUser.username || selectedUser._id,
        name: selectedUser.name,
        surname: selectedUser.surname,
        email: selectedUser.email,
        ec_number: selectedUser.ec_number,
        positionName: selectedUser.positionName,
        divisionName: selectedUser.divisionName,
        sectionName: selectedUser.sectionName,
        grade: selectedUser.grade,
        enabled: selectedUser.enabled,
        appraiser_status: selectedUser.appraiser_status,
        appraiserEmail: selectedUser.appraiserEmail,
        appraisees: selectedUser.appraisees || [],
        userRole: newRoles
      };

      const userId = getUserId(selectedUser);
      await axiosClient.put(`/updateUser/${userId}`, userData);
      
      const updatedUser = { ...selectedUser, userRole: newRoles };
      setSelectedUser(updatedUser);
      
      swal({
        text: `Role "${roleToAdd}" added successfully`,
        icon: "success",
        button: "OK!",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error adding role:", error);
      swal({
        text: "Failed to add role",
        icon: "error",
        button: "OK!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleToRemove) => {
    if (!selectedUser) return;
    
    const currentRoles = selectedUser.userRole || [];
    if (currentRoles.length <= 1) {
      swal({
        text: "User must have at least one role",
        icon: "warning",
        button: "OK!",
      });
      return;
    }

    setLoading(true);
    const newRoles = currentRoles.filter(r => r !== roleToRemove);
    
    try {
      const userData = {
        username: selectedUser.username || selectedUser._id,
        name: selectedUser.name,
        surname: selectedUser.surname,
        email: selectedUser.email,
        ec_number: selectedUser.ec_number,
        positionName: selectedUser.positionName,
        divisionName: selectedUser.divisionName,
        sectionName: selectedUser.sectionName,
        grade: selectedUser.grade,
        enabled: selectedUser.enabled,
        appraiser_status: selectedUser.appraiser_status,
        appraiserEmail: selectedUser.appraiserEmail,
        appraisees: selectedUser.appraisees || [],
        userRole: newRoles
      };

      const userId = getUserId(selectedUser);
      await axiosClient.put(`/updateUser/${userId}`, userData);
      
      const updatedUser = { ...selectedUser, userRole: newRoles };
      setSelectedUser(updatedUser);
      
      swal({
        text: `Role "${roleToRemove}" removed successfully`,
        icon: "success",
        button: "OK!",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
      swal({
        text: "Failed to remove role",
        icon: "error",
        button: "OK!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleConfig = (roleValue) => {
    return AVAILABLE_ROLES.find(r => r.value === roleValue) || { 
      value: roleValue, 
      label: roleValue, 
      description: "", 
      color: "#666" 
    };
  };

  const currentRoles = selectedUser?.userRole || [];

  return (
    <Box sx={{ 
      display: "flex",
      ml:26,
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      {/* Hero Header */}
      <Box sx={{ 
        py: 1.5,
        px: { xs: 2, md: 4 },
        flexShrink: 0,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
        textAlign: "center"
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 300,
            color: "#1d1d1d",
            mb: 0.25,
            letterSpacing: "-0.02em",
            lineHeight: 1.2
          }}
        >
          Assign Roles
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: "#999",
            fontWeight: 400,
            letterSpacing: "0.01em"
          }}
        >
          Elevate team members with responsibility
        </Typography>
      </Box>

      {/* Main Content - Single Column, Card-Based */}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        width: "100%",
        px: { xs: 1.5, md: 3 },
        py: 1.5,
        boxSizing: "border-box",
        overflow: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}>
        <Box sx={{ 
          maxWidth: 700, 
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%"
        }}>
          {/* User Selection Card */}
          <Box sx={{ 
            background: "white",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 400,
                color: "#1d1d1d",
                mb: 1.5,
                letterSpacing: "-0.01em"
              }}
            >
              Find a person
            </Typography>
            
            <Autocomplete
              value={selectedUser}
              onChange={handleUserChange}
              inputValue={searchQuery}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              options={filteredUsers}
              getOptionLabel={(option) => 
                `${option.name || ""} ${option.surname || ""}${option.ec_number ? ` • ${option.ec_number}` : ""}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by name or ID..."
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #e0e0e0",
                      transition: "all 0.2s",
                      "& fieldset": {
                        borderColor: "#e0e0e0"
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0066cc"
                      }
                    }
                  }}
                />
              )}
              noOptionsText="No one found"
            />

            {/* Selected User Preview */}
            {selectedUser && (
              <Box 
                sx={{ 
                  mt: 1.5,
                  p: 1.5,
                  background: "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                  borderRadius: 1.5,
                  border: "1px solid #d4e0ff",
                  animation: "slideIn 0.3s ease-out"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, #0066cc 0%, #005bb3 100%)`,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 400,
                      fontSize: 16,
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0, 102, 204, 0.3)"
                    }}
                  >
                    {(selectedUser.name || selectedUser.ec_number || "?").charAt(0).toUpperCase()}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1d1d1d", mb: 0.15 }}>
                      {selectedUser.name} {selectedUser.surname}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.1 }}>
                      {selectedUser.ec_number || selectedUser.username}
                    </Typography>
                    {selectedUser.positionName && (
                      <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                        {selectedUser.positionName}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            <style>
              {`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(-8px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}
            </style>
          </Box>

          {/* Roles Management Card */}
          {selectedUser && (
            <Box sx={{ 
              background: "white",
              borderRadius: 2,
              p: 2,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
              animation: "slideIn 0.4s ease-out"
            }}>
              {/* Current Roles Section */}
              <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f0f0f0" }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1d1d1d",
                    mb: 1,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    display: "block"
                  }}
                >
                  Current Roles
                </Typography>
                
                {currentRoles.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {currentRoles.map((role) => {
                      const config = getRoleConfig(role);
                      return (
                        <Chip
                          key={role}
                          label={config.label}
                          onDelete={() => handleRemoveRole(role)}
                          deleteIcon={<CloseIcon />}
                          sx={{
                            backgroundColor: config.color,
                            color: "white",
                            fontWeight: 500,
                            height: 32,
                            "& .MuiChip-label": {
                              px: 1.5
                            },
                            "& .MuiChip-deleteIcon": {
                              color: "rgba(255,255,255,0.8)",
                              ml: 0.5,
                              transition: "all 0.2s",
                              "&:hover": {
                                color: "white"
                              }
                            },
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: `0 4px 12px ${config.color}40`
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="#999" sx={{ fontStyle: "italic" }}>
                    No roles yet. Add one below.
                  </Typography>
                )}
              </Box>

              {/* Available Roles Section */}
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1d1d1d",
                    mb: 1.5,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    display: "block"
                  }}
                >
                  Available Roles
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" }, gap: 1.5 }}>
                  {AVAILABLE_ROLES.map((role) => {
                    const hasRole = currentRoles.includes(role.value);
                    return (
                      <Box
                        key={role.value}
                        onClick={() => !hasRole && !loading && handleAddRole(role.value)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          background: hasRole ? `linear-gradient(135deg, ${role.color}15, ${role.color}08)` : "linear-gradient(135deg, #f9f9f9, #f3f3f3)",
                          border: hasRole 
                            ? `2px solid ${role.color}` 
                            : "1px solid #e5e5e5",
                          cursor: hasRole ? "default" : "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          position: "relative",
                          overflow: "hidden",
                          opacity: loading && !hasRole ? 0.5 : 1,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle at 30% 20%, ${role.color}10, transparent)`,
                            pointerEvents: "none"
                          },
                          "&:hover": hasRole ? {} : {
                            borderColor: role.color,
                            background: `linear-gradient(135deg, ${role.color}08, ${role.color}04)`,
                            boxShadow: `0 8px 20px ${role.color}15`,
                            transform: "translateY(-4px)"
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${role.color}, ${role.color}dd)`,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            boxShadow: `0 4px 12px ${role.color}40`,
                            fontSize: 20
                          }}
                        >
                          {role.icon}
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "#1d1d1d", mb: 0.4, lineHeight: 1.2, fontSize: "0.85rem" }}>
                          {role.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666", mb: 1, lineHeight: 1.3, minHeight: 24, fontSize: "0.75rem" }}>
                          {role.description}
                        </Typography>
                        {hasRole ? (
                          <Chip 
                            label="✓ Assigned" 
                            sx={{ 
                              backgroundColor: role.color, 
                              color: "white",
                              fontWeight: 600,
                              height: 28,
                              fontSize: "0.85rem"
                            }} 
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: `${role.color}20`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: role.color,
                              fontSize: 18,
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: `${role.color}35`,
                                transform: "scale(1.1)"
                              }
                            }}
                          >
                            <AddIcon sx={{ fontSize: 18 }} />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}

          {/* Empty State */}
          {!selectedUser && (
            <Box sx={{ 
              textAlign: "center", 
              py: 4,
              px: 2,
              background: "white",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
            }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #f0f0f0, #e8e8e8)",
                mx: "auto", 
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <PersonSearchIcon sx={{ fontSize: 32, color: "#ccc" }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 400, color: "#1d1d1d", mb: 0.25, fontSize: "0.95rem" }}>
                Find someone
              </Typography>
              <Typography variant="caption" color="#999">
                Search above to get started
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
