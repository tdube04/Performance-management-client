import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Swal from "sweetalert2";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import "./notificationManagement.scss";

const NotificationManagement = () => {
  const { userName, userType, token } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // CRUD Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "normal",
    targetAudience: "all",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/notifications");
      const data = Array.isArray(response.data) ? response.data : response.data.content || [];
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch notifications",
      });
      setLoading(false);
    }
  };

  const isHCPersonnel = userType === "HC" || userType === "ADMIN";

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        createdBy: userName,
        createdAt: new Date().toISOString(),
      };

      await axiosClient.post("/notifications", payload);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Notification created successfully",
      });
      
      setCreateDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create notification",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        updatedBy: userName,
        updatedAt: new Date().toISOString(),
      };

      await axiosClient.put(`/notifications/${selectedNotification.id}`, payload);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Notification updated successfully",
      });
      
      setEditDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error updating notification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update notification",
      });
    }
  };

  const handleSoftDelete = async () => {
    try {
      await axiosClient.put(`/notifications/${selectedNotification.id}/soft-delete`, {
        deletedBy: userName,
        deletedAt: new Date().toISOString(),
      });
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Notification deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete notification",
      });
    }
  };

  const handleRestore = async (notification) => {
    try {
      await axiosClient.put(`/notifications/${notification.id}/restore`, {
        restoredBy: userName,
        restoredAt: new Date().toISOString(),
      });
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Notification restored successfully",
      });
      
      fetchNotifications();
    } catch (error) {
      console.error("Error restoring notification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to restore notification",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      priority: "normal",
      targetAudience: "all",
      startDate: "",
      endDate: "",
      isActive: true,
    });
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      size: 150,
    },
    {
      accessorKey: "message",
      header: "Message",
      size: 250,
      Cell: ({ row }) => (
        <span className="message-cell">
          {row.original.message?.substring(0, 50)}
          {row.original.message?.length > 50 ? "..." : ""}
        </span>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
      Cell: ({ row }) => {
        const priority = row.original.priority;
        let color = "default";
        if (priority === "high") color = "error";
        else if (priority === "medium") color = "warning";
        else if (priority === "low") color = "info";
        return <Chip label={priority} color={color} size="small" />;
      },
    },
    {
      accessorKey: "targetAudience",
      header: "Audience",
      size: 100,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.targetAudience} 
          variant="outlined"
          size="small" 
        />
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      size: 120,
      Cell: ({ row }) => (
        <span>
          {row.original.createdAt 
            ? new Date(row.original.createdAt).toLocaleDateString() 
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      size: 100,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.isActive ? "Active" : "Inactive"} 
          color={row.original.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      accessorKey: "isDeleted",
      header: "Deleted",
      size: 80,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.isDeleted ? "Yes" : "No"} 
          color={row.original.isDeleted ? "error" : "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 100,
      Cell: ({ row }) => (
        <div>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedNotification(row.original);
                setViewDialogOpen(true);
              }}
            >
              <AiIcons.AiFillEye />
            </IconButton>
          </Tooltip>
          
          {isHCPersonnel && !row.original.isDeleted && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedNotification(row.original);
                    setFormData({
                      title: row.original.title,
                      message: row.original.message,
                      priority: row.original.priority,
                      targetAudience: row.original.targetAudience,
                      startDate: row.original.startDate || "",
                      endDate: row.original.endDate || "",
                      isActive: row.original.isActive,
                    });
                    setEditDialogOpen(true);
                  }}
                >
                  <AiIcons.AiFillEdit />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedNotification(row.original);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <AiIcons.AiFillDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {row.original.isDeleted && (
            <Tooltip title="Restore">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleRestore(row.original)}
              >
                <AiIcons.AiOutlineReload />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="notification-management-container">
      <Paper elevation={0} className="page-header">
        <Box className="header-content">
          <Typography variant="h4" className="page-title">
            <AiIcons.AiOutlineNotification /> Notification Management
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Create, view, update, and manage system notifications
          </Typography>
        </Box>
        
        {isHCPersonnel && (
          <Button
            variant="contained"
            startIcon={<AiIcons.AiOutlinePlus />}
            onClick={() => {
              resetForm();
              setCreateDialogOpen(true);
            }}
            className="btn-create"
          >
            Create Notification
          </Button>
        )}
      </Paper>

      <Paper elevation={1} className="notifications-table-paper">
        <MaterialReactTable
          columns={columns}
          data={notifications}
          loading={loading}
          enableRowSelection={false}
          initialState={{ showColumnFilters: false }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            }
          }}
        />
      </Paper>

      {/* Create Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <AiIcons.AiOutlinePlusCircle /> Create Notification
        </DialogTitle>
        <DialogContent>
          <Box component="form" className="notification-form">
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={formData.targetAudience}
                label="Target Audience"
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="admin">Admins Only</MenuItem>
                <MenuItem value="hc">HC Only</MenuItem>
                <MenuItem value="appraisees">Appraisees</MenuItem>
                <MenuItem value="appraisers">Appraisers</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <AiIcons.AiFillEdit /> Edit Notification
        </DialogTitle>
        <DialogContent>
          <Box component="form" className="notification-form">
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={formData.targetAudience}
                label="Target Audience"
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="admin">Admins Only</MenuItem>
                <MenuItem value="hc">HC Only</MenuItem>
                <MenuItem value="appraisees">Appraisees</MenuItem>
                <MenuItem value="appraisers">Appraisers</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <AiIcons.AiFillEye /> Notification Details
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box className="notification-details">
              <Typography variant="h6">{selectedNotification.title}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedNotification.message}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`Priority: ${selectedNotification.priority}`} 
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`Audience: ${selectedNotification.targetAudience}`} 
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={selectedNotification.isActive ? "Active" : "Inactive"} 
                  size="small"
                  color={selectedNotification.isActive ? "success" : "default"}
                />
              </Box>
              <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
                Created by: {selectedNotification.createdBy} on{" "}
                {selectedNotification.createdAt 
                  ? new Date(selectedNotification.createdAt).toLocaleString() 
                  : "-"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <AiIcons.AiOutlineExclamationCircle /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification? This action can be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleSoftDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationManagement;
