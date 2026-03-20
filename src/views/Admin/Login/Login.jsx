import { Link } from "react-router-dom";
import axiosClient from "../../../authentication/axios-client";
import { createRef, useRef } from "react";
import { useStateContext } from "../../../context/ContextProvider.jsx";
import { useState, useEffect } from "react";
import "./login.scss";
import "animate.css/animate.min.css";
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import cookie from "cookie";
import Cookies from "js-cookie";
import RoleSelection from "./RoleSelection.jsx";

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();

  const [profileData, setProfileData] = useState("");
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");

  const timer = useRef();

  const onSubmit = (ev) => {
    ev.preventDefault();

    setIsLoading(true);
    if (!isLoading) {
      setIsLoading(true);
      timer.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username) {
      setMessage("User name is required");
      return;
    }
    if (!password) {
      setMessage("Password is required");
      return;
    }

    const payload = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    setIsLoading(true);
    axiosClient
      .post("/login", payload)
      .then(async ({ data }) => {
        // Check if user is not found in database (userFound is false)
        if (data.userFound === false) {
          setIsLoading(false);
          // User not found in database - redirect to signup page
          const signupUrl = `/signup?userName=${encodeURIComponent(usernameRef.current.value)}`;
          window.location.href = signupUrl;
          return;
        }

        // Check if authentication failed (userFound is true but jwtToken is null)
        if (!data.jwtToken && data.userFound === true) {
          setIsLoading(false);
          setMessage("Invalid username or password. Please try again.");
          return;
        }

        // Check if user has multiple roles - show role selection
        if (data.userRole && data.userRole.length > 1) {
          setIsLoading(false);
          setUserRoles(data.userRole);
          // Decode token to get username
          const decoded = jwt_decode(data.jwtToken);
          setSelectedUsername(decoded.sub);
          setShowRoleSelection(true);
          return;
        }

        // Single role user - proceed with normal login flow
        setToken(data.jwtToken);
        console.log("JWT Token:", data.jwtToken);
        console.log("Login Response:", data);
        const decodedToken = jwt_decode(data.jwtToken);

        console.log("Decoded Token:", decodedToken);
        const username = decodedToken.sub;
        setUserName(username);

        // Check the logAs property from the decoded JWT token
        const userRole = decodedToken.logAs;
        console.log("User role from JWT:", userRole);

        if (userRole === "admin") {
          setUserType("ADMIN");
          console.log("User logged in as ADMIN");
        } else if (userRole === "hc") {
          setUserType("HC");
          console.log("User logged in as HUMAN CAPITAL");
        } else if (userRole === "board") {
          setUserType("BOARD");
          console.log("User logged in as BOARD");
        } else {
          setUserType("USER");
          console.log("User logged in as USER");
        }

        // Check if user profile is complete
        try {
          const response = await axiosClient.get(
            `/User/${username}`
          );
          setProfileData(response.data);
          console.log("User profile:", response.data);

          // Check if user is Board member (grade 0)
          if (response.data.grade === "0") {
            console.log("Board member detected, redirecting to Board dashboard");
            window.location.href = "/board-dashboard/dashboard";
            return;
          }

          // Redirect HC users to HC dashboard
          if (userRole === "hc") {
            console.log("HC user detected, redirecting to HC dashboard");
            window.location.href = "/hc/dashboard";
            return;
          }

          // Redirect Board members to Board dashboard
          if (userRole === "board") {
            console.log("Board member detected, redirecting to Board dashboard");
            window.location.href = "/board-dashboard/dashboard";
            return;
          }

          // Redirect Admin users to admin dashboard
          if (userRole === "admin") {
            console.log("Admin user detected, redirecting to admin dashboard");
            window.location.href = "/admin/dashboard";
            return;
          }

          if (response.data.ec_number === null) {
            // Redirect to signup to complete profile
            const signupUrl = `/signup?userName=${username}&token=${data.jwtToken}`;
            window.location.href = signupUrl;

            setToken(null);
            localStorage.removeItem(token);
            localStorage.clear();
            return;
          }

          // Default redirect for regular users
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If user profile doesn't exist yet, they'll be redirected on the next page
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          if (response.status === 500) {
            setMessage("Unable to connect to server. Please try again later.");
          } else if (response.status === 422) {
            setMessage(response.data.message || "Invalid credentials. Please check your username and password.");
          } else if (response.status === 404) {
            setMessage("User not found. Please register first by clicking the link below.");
          } else if (response.status === 403) {
            setMessage("Access denied. Please contact your administrator.");
          } else if (response.status === 401) {
            setMessage("Invalid username or password. Please try again.");
          } else if (response.status === 400) {
            setMessage("Invalid request. Please provide valid credentials.");
          } else {
            setMessage("An unexpected error occurred. Please try again.");
          }
        } else {
          setMessage("Unable to connect to server. Please check your internet connection.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <div className="login-container">
      {showRoleSelection && (
        <RoleSelection 
          userName={selectedUsername}
          token={token}
          userRoles={userRoles}
          onRoleSelected={() => setShowRoleSelection(false)}
        />
      )}
      <div className="login-wrapper">
        <div className="login-brand-section">
          <div className="brand-content">
            <img src="public/images/zimra.png" alt="Logo" className="logo-image" />
            <h3 className="project-title">PERFORMANCE EVALUATION SYSTEM</h3>
            <p className="tagline">Zimbabwe Revenue Authority</p>
          </div>
        </div>
        
        <div className="login-form-section">
          <div className="form-header">
            <h1 className="title">Login</h1>
            <p className="subtitle">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                className={`input-field ${message ? 'error' : ''}`}
                ref={usernameRef}
                type="text"
                placeholder="Enter your username"
                variant="outlined"
                onClick={handleInputClick}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                className={`input-field ${message ? 'error' : ''}`}
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                onClick={handleInputClick}
              />
            </div>
            
            <button className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner">
                  <CircularProgress color="inherit" size={24} />
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            
            {message && (
              <div className="alert">
                <p>{message}</p>
              </div>
            )}
            
            <p className="message">
              Admin? <Link to="/adminlogin">Click here to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
