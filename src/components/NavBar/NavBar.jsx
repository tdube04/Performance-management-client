import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import ViewProfileModal from "../UserProfile/ViewProfileModal";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const NavBar = () => {
  const navigate = useNavigate();
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();

  const [profileData, setProfileData] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const notificationRef = useRef(null);

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

  // Check if notification is read
  const isRead = (notificationId) => {
    return notificationId && readNotifications.includes(notificationId);
  };

  // Get unread count
  const unreadCount = notifications.filter((n) => !isRead(n?.id)).length;

  // Determine user role for fetching notifications
  const getUserRole = () => {
    // First check logAs field from profile
    if (profileData?.logAs) {
      return profileData.logAs.toLowerCase();
    }
    
    // Check userType from context
    if (userType?.toUpperCase() === "ADMIN") return "admin";
    if (userType?.toUpperCase() === "HC") return "hc";
    if (userType?.toUpperCase() === "BOARD") return "board";
    
    // Check userRole array from profile
    if (profileData?.userRole) {
      const roles = profileData.userRole.map(r => r.toLowerCase());
      if (roles.includes("hc")) return "hc";
      if (roles.includes("admin")) return "admin";
      if (roles.includes("board")) return "board";
    }
    
    // Check if user is an appraiser (has appraisees)
    if (profileData?.appraisees && profileData.appraisees.length > 0) return "appraiser";
    
    // Check if user is a board member (grade 0)
    if (profileData?.grade === "0") return "board";
    
    // Default to appraisee
    return "appraisee";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
        setProfileData(response.data);
        console.log("User profile loaded:", response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (userName) {
      fetchData();
    }
  }, [userName]);

  // Fetch notifications visible to the user
  useEffect(() => {
    const role = getUserRole();
    console.log("Fetching notifications for role:", role, "userType:", userType);
    
    if (token && role) {
      axiosClient.get(`/notifications/visible?userRole=${role}`)
        .then((response) => {
          console.log("Notifications received:", response.data.length);
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [profileData, token, userType]);

  // Close notification dropdown when clicking outside
  const handleClickAway = () => {
    setShowNotifications(false);
  };

  // Handle notification click - mark as read and redirect
  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification.id);
    
    // Mark as read
    if (notification?.id) {
      const newRead = [...readNotifications, notification.id];
      saveReadNotifications(newRead);
    }
    
    // Close dropdown
    setShowNotifications(false);
    
    // Redirect based on notification target
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
          // Default to notifications page
          navigate("/my-notifications");
      }
    } else {
      // No specific target, go to notifications page
      navigate("/my-notifications");
    }
  };

  // Get icon for notification priority
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <span style={{ color: "#e74c3c" }}>●</span>;
      case "medium":
        return <span style={{ color: "#f39c12" }}>●</span>;
      case "low":
        return <span style={{ color: "#3498db" }}>●</span>;
      default:
        return <span style={{ color: "#95a5a6" }}>●</span>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    setToken(null);
    localStorage.removeItem(token);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo"></span>
          </Link>
        </div>
        <div className="items" style={{ marginTop: -30 }}>
          <div className="item">
            Welcome: {profileData.name} {""}
            {profileData.surname}
          </div>

          {/* Notification Bell */}
          <div className="item notification-container" ref={notificationRef}>
            <div
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <NotificationsNoneOutlinedIcon />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <ClickAwayListener onClickAway={handleClickAway}>
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="notification-count">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <NotificationsNoneOutlinedIcon
                          style={{ fontSize: 48, color: "#ccc", marginBottom: 8 }}
                        />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!isRead(notification.id) ? "unread" : ""}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-icon">
                            {getPriorityIcon(notification.priority)}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title}
                              {!isRead(notification.id) && <span className="new-badge">New</span>}
                            </div>
                            <div className="notification-message">
                              {notification.message?.substring(0, 60)}
                              {notification.message?.length > 60 ? "..." : ""}
                            </div>
                            <div className="notification-meta">
                              {notification.startDate && (
                                <span>
                                  {formatDate(notification.startDate)}
                                  {notification.endDate &&
                                    ` - ${formatDate(notification.endDate)}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="notification-footer">
                      <Link
                        to="/my-notifications"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </div>
              </ClickAwayListener>
            )}
          </div>

          <div className="item">
            <ViewProfileModal />
          </div>

          <div className="item">
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout <ExitToAppIcon className="icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
