import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../authentication/axios-client";
import { useStateContext } from "../../../context/ContextProvider";
import "./roleSelection.scss";
import "animate.css/animate.min.css";
import jwt_decode from "jwt-decode";

export default function RoleSelection({ userName, token, userRoles, onRoleSelected }) {
  const navigate = useNavigate();
  const { setUserType, setToken, setUserName } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);

  // Role configurations with icons and colors
  const roleConfig = {
    ADMIN: {
      icon: "🛡️",
      color: "#667eea",
      title: "Administrator",
      description: "Access admin dashboard and manage users",
    },
    HC: {
      icon: "👥",
      color: "#10b981",
      title: "Human Capital",
      description: "Access HC dashboard and manage HR functions",
    },
    BOARD: {
      icon: "🏛️",
      color: "#8b5cf6",
      title: "Board Member",
      description: "Access board dashboard and executive reviews",
    },
    USER: {
      icon: "👤",
      color: "#6366f1",
      title: "Employee",
      description: "Access employee dashboard and personal performance",
    },
  };

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/selectRole", {
        username: userName,
        role: role,
      });

      if (response.data.jwtToken) {
        // Update token with new role
        setToken(response.data.jwtToken);
        localStorage.setItem("token", response.data.jwtToken);

        // Set user type based on selected role
        const decodedToken = jwt_decode(response.data.jwtToken);
        const newLogAs = decodedToken.logAs;
        
        // Also set the userName in context
        setUserName(userName);

        if (newLogAs === "admin") {
          setUserType("ADMIN");
          window.location.href = "/admin/dashboard";
        } else if (newLogAs === "hc") {
          setUserType("HC");
          window.location.href = "/hc/dashboard";
        } else if (newLogAs === "board") {
          // Board member - redirect to board dashboard
          setUserType("BOARD");
          window.location.href = "/board-dashboard/dashboard";
        } else {
          setUserType("USER");
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("Error selecting role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="role-selection-overlay">
      <div className="role-selection-container animate__animated animate__fadeInUp">
        <div className="role-selection-header">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Select how you'd like to continue</p>
        </div>

        <div className="role-cards">
          {userRoles.map((role) => {
            const config = roleConfig[role] || roleConfig.USER;
            return (
              <div
                key={role}
                className="role-card animate__animated animate__fadeInUp"
                style={{ 
                  borderColor: config.color,
                  animationDelay: `${userRoles.indexOf(role) * 0.1}s` 
                }}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-icon" style={{ backgroundColor: config.color }}>
                  {config.icon}
                </div>
                <div className="role-info">
                  <h3 className="role-title">{config.title}</h3>
                  <p className="role-description">{config.description}</p>
                </div>
                <div className="role-arrow">→</div>
              </div>
            );
          })}
        </div>

        <div className="role-selection-footer">
          <p className="footer-text">
            You can switch roles later from your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
