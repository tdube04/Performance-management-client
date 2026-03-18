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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Swal from "sweetalert2";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
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
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "normal",
    targetAudience: "all",
    startDate: "",
    endDate: "",
    isActive: true,
    visibleToAll: true,
    visibleToAppraisees: true,
    visibleToAppraisers: true,
    visibleToHC: true,
    visibleToAdmin: true,
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
        text: error.response?.data?.message || "Failed to create notification",
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
        text: error.response?.data?.message || "Failed to update notification",
      });
    }
  };

  const handleVisibilityUpdate = async () => {
    try {
      const payload = {
        visibleToAll: formData.visibleToAll,
        visibleToAppraisees: formData.visibleToAppraisees,
        visibleToAppraisers: formData.visibleToAppraisers,
        visibleToHC: formData.visibleToHC,
        visibleToAdmin: formData.visibleToAdmin,
      };

      await axiosClient.put(`/notifications/${selectedNotification.id}/visibility`, payload);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Visibility settings updated successfully",
      });
      
      setVisibilityDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Error updating visibility:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update visibility",
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
        text: error.response?.data?.message || "Failed to delete notification",
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
        text: error.response?.data?.message || "Failed to restore notification",
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
      visibleToAll: true,
      visibleToAppraisees: true,
      visibleToAppraisers: true,
      visibleToHC: true,
      visibleToAdmin: true,
    });
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openVisibilityDialog = () => {
    if (selectedNotification) {
      setFormData({
        title: selectedNotification.title,
        message: selectedNotification.message,
        priority: selectedNotification.priority,
        targetAudience: selectedNotification.targetAudience,
        startDate: selectedNotification.startDate || "",
        endDate: selectedNotification.endDate || "",
        isActive: selectedNotification.isActive,
        visibleToAll: selectedNotification.visibleToAll,
        visibleToAppraisees: selectedNotification.visibleToAppraisees,
        visibleToAppraisers: selectedNotification.visibleToAppraisers,
        visibleToHC: selectedNotification.visibleToHC,
        visibleToAdmin: selectedNotification.visibleToAdmin,
      });
      setVisibilityDialogOpen(true);
    }
    handleMenuClose();
  };

  const VisibilityToggle = ({ label, checked, onChange }) => (
    <Box className="visibility-toggle">
      <Typography className="visibility-label">{label}</Typography>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        color="success"
        size="small"
        className="visibility-switch"
      />
      <Chip 
        label={checked ? "Visible" : "Hidden"} 
        size="small"
        color={checked ? "success" : "default"}
        variant="outlined"
        className="visibility-status"
      />
    </Box>
  );

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      size: 180,
      Cell: ({ row }) => (
        <Box className="title-cell">
          <Typography variant="subtitle2" className="title-text">
            {row.original.title}
          </Typography>
          <Typography variant="caption" className="title-preview">
            {row.original.message?.substring(0, 50)}
            {row.original.message?.length > 50 ? "..." : ""}
          </Typography>
        </Box>
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
        return (
          <Chip 
            label={priority} 
            color={color} 
            size="small" 
            variant="outlined"
            className="priority-chip"
          />
        );
      },
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      size: 200,
      Cell: ({ row }) => (
        <Box className="visibility-chips">
          {row.original.visibleToAll && (
            <Chip label="All" size="small" color="success" className="visibility-chip" />
          )}
          {row.original.visibleToAppraisees && (
            <Chip label="Appraisees" size="small" className="visibility-chip" />
          )}
          {row.original.visibleToAppraisers && (
            <Chip label="Appraisers" size="small" className="visibility-chip" />
          )}
        </Box>
      ),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      size: 120,
      Cell: ({ row }) => (
        <Typography variant="body2" className="creator-name">
          {row.original.createdBy}
        </Typography>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      size: 120,
      Cell: ({ row }) => (
        <Typography variant="body2" className="date-cell">
          {row.original.createdAt 
            ? new Date(row.original.createdAt).toLocaleDateString() 
            : "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      Cell: ({ row }) => (
        <Chip 
          label={row.original.isActive ? "Active" : "Inactive"} 
          color={row.original.isActive ? "success" : "default"}
          size="small"
          variant="outlined"
          className="status-chip"
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 120,
      Cell: ({ row }) => (
        <Box className="action-buttons">
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedNotification(row.original);
                setViewDialogOpen(true);
              }}
              className="action-btn"
            >
              <AiIcons.AiFillEye />
            </IconButton>
          </Tooltip>
          
          {isHCPersonnel && !row.original.isDeleted && (
            <>
              <Tooltip title="Visibility Settings">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setSelectedNotification(row.original);
                    openVisibilityDialog();
                  }}
                  className="action-btn visibility-btn"
                >
                  <FaIcons.FaEye />
                </IconButton>
              </Tooltip>
              
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
                      visibleToAll: row.original.visibleToAll,
                      visibleToAppraisees: row.original.visibleToAppraisees,
                      visibleToAppraisers: row.original.visibleToAppraisers,
                      visibleToHC: row.original.visibleToHC,
                      visibleToAdmin: row.original.visibleToAdmin,
                    });
                    setEditDialogOpen(true);
                  }}
                  className="action-btn"
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
                  className="action-btn delete-btn"
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
                color="success"
                onClick={() => handleRestore(row.original)}
                className="action-btn restore-btn"
              >
                <AiIcons.AiOutlineReload />
              </IconButton>
            </Tooltip>
          )}
        </Box>
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
            Create and manage system notifications with visibility controls
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
              backgroundColor: "#fafafa",
              fontWeight: 600,
              fontSize: 13,
              borderBottom: "2px solid #e0e0e0",
            }
          }}
          muiTableBodyRowProps={{
            sx: {
              '&:hover': { backgroundColor: '#f8f9fa' },
              borderBottom: "1px solid #f0f0f0",
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
        TransitionComponent={Fade}
      >
        <DialogTitle className="dialog-header">
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
              className="form-field"
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
              className="form-field"
            />
            
            <Divider className="form-divider" />
            <Typography variant="subtitle2" className="section-label">Settings</Typography>
            
            <Box className="form-row">
              <FormControl fullWidth margin="normal" className="form-field-half">
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
              
              <FormControl fullWidth margin="normal" className="form-field-half">
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
            </Box>
            
            <Box className="form-row">
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                className="form-field-half"
              />
              <TextField
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                className="form-field-half"
              />
            </Box>
            
            <Divider className="form-divider" />
            <Typography variant="subtitle2" className="section-label">Visibility Control</Typography>
            <Typography variant="caption" className="section-hint">
              Control which users can see this notification
            </Typography>
            
            <Box className="visibility-section">
              <VisibilityToggle
                label="Visible to All Users"
                checked={formData.visibleToAll}
                onChange={(checked) => setFormData({ ...formData, visibleToAll: checked })}
              />
              <VisibilityToggle
                label="Visible to Appraisees"
                checked={formData.visibleToAppraisees}
                onChange={(checked) => setFormData({ ...formData, visibleToAppraisees: checked })}
              />
              <VisibilityToggle
                label="Visible to Appraisers"
                checked={formData.visibleToAppraisers}
                onChange={(checked) => setFormData({ ...formData, visibleToAppraisers: checked })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Visibility Settings Dialog */}
      <Dialog 
        open={visibilityDialogOpen} 
        onClose={() => setVisibilityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle className="dialog-header">
          <FaIcons.FaEye /> Visibility Settings
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" className="notification-title-preview">
            {selectedNotification?.title}
          </Typography>
          <Typography variant="body2" className="notification-subtitle-preview">
            Control which users can see this notification
          </Typography>
          
          <Box className="visibility-section-full">
            <VisibilityToggle
              label="Visible to All Users"
              checked={formData.visibleToAll}
              onChange={(checked) => setFormData({ ...formData, visibleToAll: checked })}
            />
            <VisibilityToggle
              label="Visible to Appraisees"
              checked={formData.visibleToAppraisees}
              onChange={(checked) => setFormData({ ...formData, visibleToAppraisees: checked })}
            />
            <VisibilityToggle
              label="Visible to Appraisers"
              checked={formData.visibleToAppraisers}
              onChange={(checked) => setFormData({ ...formData, visibleToAppraisers: checked })}
            />
            <VisibilityToggle
              label="Visible to HC Personnel"
              checked={formData.visibleToHC}
              onChange={(checked) => setFormData({ ...formData, visibleToHC: checked })}
            />
            <VisibilityToggle
              label="Visible to Admin Users"
              checked={formData.visibleToAdmin}
              onChange={(checked) => setFormData({ ...formData, visibleToAdmin: checked })}
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setVisibilityDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleVisibilityUpdate}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle className="dialog-header">
          <AiIcons.AiFillEye /> Notification Details
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box className="notification-details">
              <Typography variant="h6" className="detail-title">{selectedNotification.title}</Typography>
              <Typography variant="body1" className="detail-message">
                {selectedNotification.message}
              </Typography>
              
              <Box className="detail-chips">
                <Chip 
                  label={`Priority: ${selectedNotification.priority}`} 
                  size="small"
                  color={selectedNotification.priority === "high" ? "error" : "default"}
                  className="detail-chip"
                />
                <Chip 
                  label={`Audience: ${selectedNotification.targetAudience}`} 
                  size="small"
                  variant="outlined"
                  className="detail-chip"
                />
                <Chip 
                  label={selectedNotification.isActive ? "Active" : "Inactive"} 
                  size="small"
                  color={selectedNotification.isActive ? "success" : "default"}
                  className="detail-chip"
                />
              </Box>
              
              <Box className="visibility-preview">
                <Typography variant="subtitle2" className="visibility-label">Visible to:</Typography>
                <Box className="visibility-tags">
                  {selectedNotification.visibleToAll && <Chip label="All" size="small" color="success" />}
                  {selectedNotification.visibleToAppraisees && <Chip label="Appraisees" size="small" />}
                  {selectedNotification.visibleToAppraisers && <Chip label="Appraisers" size="small" />}
                  {selectedNotification.visibleToHC && <Chip label="HC" size="small" />}
                  {selectedNotification.visibleToAdmin && <Chip label="Admin" size="small" />}
                </Box>
              </Box>
              
              <Typography variant="caption" className="detail-meta">
                Created by: {selectedNotification.createdBy} on{" "}
                {selectedNotification.createdAt 
                  ? new Date(selectedNotification.createdAt).toLocaleString() 
                  : "-"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle className="dialog-header">
          <AiIcons.AiOutlineExclamationCircle /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification? This action can be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
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
