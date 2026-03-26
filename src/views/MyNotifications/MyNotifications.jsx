import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import * as AiIcons from "react-icons/ai";
import "./myNotifications.scss";

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readNotifications, setReadNotifications] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const { userName, token } = useStateContext();

  // Load read notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("readNotifications");
    if (saved) {
      try {
        setReadNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing readNotifications:", e);
      }
    }
  }, []);

  // Save read notifications to localStorage whenever it changes
  const saveReadNotifications = (ids) => {
    setReadNotifications(ids);
    localStorage.setItem("readNotifications", JSON.stringify(ids));
  };

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      try {
        setLoading(true);
        const profileResponse = await axiosClient.get(`/User/{id}?id=${userName}`);
        const profileData = profileResponse.data;

        let role = "appraisee";
        if (profileData?.logAs) {
          role = profileData.logAs.toLowerCase();
        } else if (profileData?.userRole) {
          const roles = profileData.userRole.map((r) => r.toLowerCase());
          if (roles.includes("hc")) role = "hc";
          else if (roles.includes("admin")) role = "admin";
        } else if (profileData?.appraisees && profileData.appraisees.length > 0) {
          role = "appraiser";
        }

        const notifResponse = await axiosClient.get(
          `/notifications/visible?userRole=${role}`
        );
        setNotifications(notifResponse.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (token && userName) {
      fetchProfileAndNotifications();
    }
  }, [token, userName]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    if (!notificationId) return;
    const newRead = [...readNotifications, notificationId];
    saveReadNotifications(newRead);
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification?.id) return;
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setViewDialogOpen(true);
  };

  // Handle redirect based on targetAudience
  const handleRedirect = (notification) => {
    if (!notification?.id) return;
    markAsRead(notification.id);
    
    if (notification.targetAudience) {
      const target = notification.targetAudience.toLowerCase();
      switch (target) {
        case "workplan":
        case "work plans":
          navigate("/viewWorkPlan");
          break;
        case "scorecard":
        case "scorecards":
          navigate("/resultscorecard");
          break;
        case "appraisee":
        case "appraisees":
          navigate("/allirbms");
          break;
        case "evaluation":
        case "evaluate":
          navigate("/appraisee-result-scorecard-pending-approval");
          break;
        case "approved":
          navigate("/approved");
          break;
        case "rejected":
          navigate("/rejected");
          break;
        case "pending":
          navigate("/pendingApproval");
          break;
        default:
          break;
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isRead = (notificationId) => {
    return notificationId && readNotifications.includes(notificationId);
  };

  const columns = [
    {
      accessorKey: "readStatus",
      header: "Status",
      size: 80,
      Cell: ({ row }) => {
        const id = row.original?.id;
        return (
          <Chip
            label={isRead(id) ? "Read" : "New"}
            size="small"
            color={isRead(id) ? "default" : "primary"}
            variant={isRead(id) ? "outlined" : "filled"}
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 200,
      Cell: ({ row }) => {
        const id = row.original?.id;
        return (
          <Box className="title-cell">
            <Typography
              variant="subtitle2"
              className={`title-text ${!isRead(id) ? "unread" : ""}`}
            >
              {row.original?.title || ""}
            </Typography>
            <Typography variant="caption" className="title-preview">
              {row.original?.message?.substring(0, 60)}
              {row.original?.message?.length > 60 ? "..." : ""}
            </Typography>
          </Box>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
      Cell: ({ row }) => {
        const priority = row.original?.priority;
        let color = "default";
        if (priority === "high") color = "error";
        else if (priority === "medium") color = "warning";
        else if (priority === "low") color = "info";
        return (
          <Chip
            label={priority || "normal"}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      accessorKey: "targetAudience",
      header: "Target",
      size: 120,
      Cell: ({ row }) => (
        <Chip
          label={row.original?.targetAudience || "All"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      size: 120,
      Cell: ({ row }) => (
        <Typography variant="body2">
          {formatDate(row.original?.startDate)}
        </Typography>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      size: 120,
      Cell: ({ row }) => (
        <Typography variant="body2">
          {formatDate(row.original?.endDate)}
        </Typography>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 120,
      Cell: ({ row }) => (
        <Box className="action-buttons">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleNotificationClick(row.original)}
              className="action-btn"
            >
              <AiIcons.AiFillEye />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Go to Task">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleRedirect(row.original)}
              className="action-btn"
            >
              <AiIcons.AiOutlineArrowRight />
            </IconButton>
          </Tooltip> */}
        </Box>
      ),
    },
  ];

  const unreadCount = notifications.filter((n) => !isRead(n?.id)).length;

  return (
    <div className="my-notifications-container">
      <Paper elevation={0} className="page-header">
        <Box className="header-content">
          <Typography variant="h4" className="page-title">
            <AiIcons.AiOutlineBell /> My Notifications
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All notifications have been read"}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={1} className="notifications-table-paper">
        <MaterialReactTable
          columns={columns}
          data={notifications || []}
          loading={loading}
          enableRowSelection={false}
          initialState={{ showColumnFilters: false }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#fafafa",
              fontWeight: 600,
              fontSize: 13,
              borderBottom: "2px solid #e0e0e0",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            sx: {
              "&:hover": { backgroundColor: "#f8f9fa" },
              borderBottom: "1px solid #f0f0f0",
              backgroundColor:
                !isRead(row.original?.id) ? "#fff8e1" : "white",
            },
          })}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-header">
          <AiIcons.AiOutlineNotification /> Notification Details
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box className="notification-details">
              <Typography variant="h6" className="detail-title">
                {selectedNotification.title}
              </Typography>
              <Typography variant="body1" className="detail-message">
                {selectedNotification.message}
              </Typography>

              <Box className="detail-chips">
                <Chip
                  label={`Priority: ${selectedNotification.priority || "normal"}`}
                  size="small"
                  color={selectedNotification.priority === "high" ? "error" : "default"}
                  className="detail-chip"
                />
                <Chip
                  label={`Target: ${selectedNotification.targetAudience || "All"}`}
                  size="small"
                  variant="outlined"
                  className="detail-chip"
                />
                <Chip
                  label={isRead(selectedNotification.id) ? "Read" : "New"}
                  size="small"
                  color={isRead(selectedNotification.id) ? "default" : "primary"}
                  className="detail-chip"
                />
              </Box>

              <Box className="detail-dates">
                <Typography variant="body2" className="date-item">
                  <strong>Start Date:</strong>{" "}
                  {formatDate(selectedNotification.startDate)}
                </Typography>
                <Typography variant="body2" className="date-item">
                  <strong>End Date:</strong>{" "}
                  {formatDate(selectedNotification.endDate)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        {/* <Box className="dialog-actions">
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              markAsRead(selectedNotification?.id);
              handleRedirect(selectedNotification);
            }}
          >
            Go to Task
          </Button>
        </Box> */}
      </Dialog>
    </div>
  );
};

export default MyNotifications;
