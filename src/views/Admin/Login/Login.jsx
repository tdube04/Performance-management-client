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
      .post("/temp-login", payload)
      .then(async ({ data }) => {
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
        } else {
          setUserType("USER");
          console.log("User logged in as USER");
        }

        // Check if user profile is complete
        try {
          const response = await axiosClient.get(
            `/User/{id}?id=${username}`
          );
          setProfileData(response.data);
          console.log("User profile:", response.data);

          if (response.data.ec_number === null) {
            // Redirect to signup to complete profile
            const signupUrl = `/signup?userName=${username}&token=${data.jwtToken}`;
            window.location.href = signupUrl;

            setToken(null);
            localStorage.removeItem(token);
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If user profile doesn't exist yet, they'll be redirected on the next page
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          if (response.status === 500) {
            setMessage("Server Error");
          } else if (response.status === 422) {
            setMessage(response.data.message);
          } else if (response.status === 404) {
            setMessage("Not Found");
          } else if (response.status === 403) {
            setMessage("Forbidden");
          } else if (response.status === 400) {
            setMessage("Bad Request");
          } else {
            setMessage("An error occurred");
          }
        } else {
          setMessage("Server Error");
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
    <>

    <div className="login-signup-form animated fadeInDown">
    <div><h3 className="project-title "><strong>PERFORMANCE EVALUATION SYSTEM</strong></h3></div>
      <div className="form">
        <form onSubmit={onSubmit}>
          {/* <img src="public/images/zimra.png" alt="Logo" className="logo" /> */}
          <div className="logo-container">
            <img src="public/images/zimra.png" alt="Logo" className="logo" />
          </div>
          <h1 className="title">Login into your account</h1>
          {/* {message && (
            <div className="alert">
              <p>{message}</p>
            </div>
          )} */}
          <label>Username: </label>
          <input
            className="input1"
            ref={usernameRef}
            type="text"
            placeholder="Username"
            variant="outlined"
            onClick={handleInputClick}
          />{" "}
          <br />
          <br />
          <label>Password: </label>
          <input
            className="input2"
            ref={passwordRef}
            type="password"
            placeholder="Password"
            onClick={handleInputClick}
          />
          <br />
          <br />
          <div className="">
            <button className="btn-login">
              {isLoading ? (
                <div style={{ margin: "auto" }}>
                  <CircularProgress color="success" />{" "}
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {userData && (
            <div>
              <p>Welcome, {userData.sub}!</p>
              <ul>
                {userData.ADMIN.map((permission, index) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="message">
            Admin Click to <Link to="/adminlogin">Login</Link>
          </p>
          {message && (
            <div className="alert alert-danger">
              <p>{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
    </>
  );
}
