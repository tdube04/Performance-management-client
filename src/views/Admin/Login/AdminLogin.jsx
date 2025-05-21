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

export default function AdminLogin() {
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
      .post("/adminlogin", payload)
      .then(async ({ data }) => {
        setToken(data.jwtToken);
        console.log(data.jwtToken);
        const decodedToken = jwt_decode(data.jwtToken);

        console.log(decodedToken.sub);
        setUserName(decodedToken.sub);

        if (decodedToken.ADMIN) {
          setUserType("ADMIN");
          setUserName(decodedToken.sub);
          console.log("ADMIN");
        } else if (decodedToken.USER) {
          setUserType("USER");
          setUserName(decodedToken.sub);
          console.log("USER");
        } else {
          try {
            const response = await axiosClient.get(
              `/User/{id}?id=${decodedToken.sub}`
            );
            setProfileData(response.data);
            console.log("My Appraiser profile");
            console.log(response.data.ec_number);

            if (response.data.ec_number === null) {
              const signupUrl = `/signup?userName=${decodedToken.sub}&token=${data.jwtToken}`;
              window.location.href = signupUrl;

              setToken(null);
              localStorage.removeItem(token);
              localStorage.clear();
            } else {
              setUserType("USER");
              setUserName(decodedToken.sub);
            }
          } catch (error) {
            console.error(error);
          }
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
          <h1 className="title">Login into Admin account</h1>
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
            Go Back To Staff <Link to="/login">Login</Link>
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
