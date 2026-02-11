import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client";
import Swal from "sweetalert2";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as BsIcons from "react-icons/bs";
import "./hcLayout.scss";

const HCLayout = () => {
  const { userName, setUserName, userType, setUserType, token, setToken } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userName) {
      fetchData();
    }
  }, [userName]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosClient.get("/notifications");
        if (response.data && Array.isArray(response.data)) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const onLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        setToken(null);
        setUserName(null);
        setUserType(null);
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const toggleSubmenu = (title) => {
    setExpandedSubmenu(expandedSubmenu === title ? null : title);
  };

  const handleMenuClick = (item) => {
    if (item.subNav) {
      toggleSubmenu(item.title);
    } else {
      navigate(item.path);
      setExpandedSubmenu(null);
    }
  };

  const HC_SIDEBAR_DATA = [
    {
      title: "Dashboard",
      path: "/hc/dashboard",
      icon: <AiIcons.AiFillHome />,
    },
    {
      title: "User Management",
      icon: <FaIcons.FaUsers />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        { title: "All Users", path: "/hc/users", icon: <IoIcons.IoIosPeople /> },
        { title: "By Grade", path: "/hc/users/grade", icon: <BsIcons.BsGrid1X2 /> },
        { title: "By Division", path: "/hc/users/division", icon: <BsIcons.BsBuilding /> },
        { title: "By Section", path: "/hc/users/section", icon: <BsIcons.BsLayers /> },
      ],
    },
    {
      title: "IRBM Submissions",
      icon: <FaIcons.FaFileAlt />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        { title: "Submitted Scorecards", path: "/hc/submissions", icon: <FaIcons.FaCheckCircle /> },
        { title: "Pending Submissions", path: "/hc/pending", icon: <FaIcons.FaClock /> },
        { title: "Post Quarter End", path: "/hc/post-quarter", icon: <AiIcons.AiOutlineCalendar /> },
      ],
    },
    {
      title: "Notifications",
      path: "/hc/notifications",
      icon: <AiIcons.AiFillBell />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      title: "Reports",
      icon: <FaIcons.FaChartBar />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        { title: "Submission Summary", path: "/hc/reports/summary", icon: <FaIcons.FaChartPie /> },
        { title: "Export Data", path: "/hc/reports/export", icon: <FaIcons.FaFileExport /> },
      ],
    },
  ];

  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubmenuActive = (subNav) => {
    return subNav.some(sub => location.pathname === sub.path);
  };

  return (
    <div className="hc-layout">
      {/* Top Navigation */}
      <header className="hc-topbar">
        <div className="hc-logo-section">
          <button 
            className="toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <AiIcons.AiOutlineMenu />
          </button>
          
          <div className="brand">
            <img
              src="/images/zimra.png"
              alt="ZIMRA Logo"
              className="zimra-logo"
            />
            <div className="brand-text">
              <span className="brand-title">Human Capital</span>
              <span className="brand-subtitle">Performance Management</span>
            </div>
          </div>
        </div>

        <div className="hc-actions">
          <div className="search-box">
            <AiIcons.AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <AiIcons.AiFillBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>

          <div className="user-profile">
            <div className="avatar">
              {getInitials(profileData?.name || userName)}
            </div>
            <div className="user-info">
              <span className="name">{profileData?.name || userName}</span>
              <span className="role">HC Administrator</span>
            </div>
            <RiIcons.RiArrowDownSFill className="dropdown-icon" />
          </div>
        </div>
      </header>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h4>Notifications</h4>
            <button onClick={() => setShowNotifications(false)}>×</button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.slice(0, 5).map((notification, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-date">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link 
            to="/hc/notifications" 
            className="view-all-link"
            onClick={() => setShowNotifications(false)}
          >
            View All Notifications
          </Link>
        </div>
      )}

      {/* Animated Sidebar */}
      <nav className={`hc-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="welcome-badge">
            <span className="status-dot"></span>
            <span>Welcome back!</span>
          </div>
        </div>

        <div className="menu-section">
          <div className="section-title">Main Menu</div>
          <ul className="menu-list">
            {HC_SIDEBAR_DATA.map((item, index) => (
              <React.Fragment key={index}>
                <li 
                  className={`menu-item ${isActivePath(item.path) || (item.subNav && isSubmenuActive(item.subNav)) ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="menu-indicator"></div>
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.title}</span>
                  {item.subNav && (
                    <span className="menu-arrow">
                      {expandedSubmenu === item.title ? item.iconOpened : item.iconClosed}
                    </span>
                  )}
                  {item.badge && <span className="menu-badge">{item.badge}</span>}
                </li>
                
                {item.subNav && (
                  <div className={`submenu ${expandedSubmenu === item.title ? 'expanded' : ''}`}>
                    <ul className="submenu-list">
                      {item.subNav.map((subItem, subIndex) => (
                        <li 
                          key={subIndex}
                          className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                          onClick={() => navigate(subItem.path)}
                        >
                          <span className="submenu-icon">{subItem.icon}</span>
                          <span className="submenu-label">{subItem.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <AiIcons.AiOutlineLogout />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`hc-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default HCLayout;
