import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./signup.scss";
import "animate.css/animate.min.css";
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import cookie from "cookie";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Cookies from "js-cookie";

export default function Signup() {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const timer = useRef();

  const {
    userName,
    token,
    userType,
    setUserName,
    setToken,
    setUserType,
  } = useStateContext();
  const [gradeSelected, setGradeSelected] = useState("");
  const [myname, setMyname] = useState("");
  const [tokenb, setTokenb] = useState("");
  const [password, setPassword] = useState("");

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const ecNumberRef = useRef(null);
  const userNameRef = useRef(null);
  const positionRef = useRef(null);
  const divisionRef = useRef(null);
  const sectionRef = useRef(null);
  const gradeRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState("");

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get("userName");
    const token = urlParams.get("token");

    console.log(userName);
    setUserName(userName);

    setTokenb(token);
    console.log("token");
    console.log(token);

    const myPassword = Cookies.get("password");
    setPassword(myPassword);
    console.log(password);
  }, []);

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
    setSelectedSection("");
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGradeSelected(event.target.value);
  };

  const selectedDivisionData = divisions.find(
    (division) => division.divisionName === selectedDivision
  );

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setIsLoading(true);
    if (!isLoading) {
      setIsLoading(true);
      timer.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
    const formData = {
      appraiserEmail: "string",
      divisionName: "",
      ec_number: ecNumberRef.current.value,
      email: emailRef.current.value,
      enabled: true,
      grade: gradeSelected,
      logAs: "user",
      name: firstNameRef.current.value,
      positionName: "",
      sectionName: "",
      surname: lastNameRef.current.value,
      userRole: ["USER"],
      username: userNameRef.current.value
    };

    if (/^[^\s@]+@[zimra]+\.[co]+\.[zw]+$/.test(emailRef.current.value)) {
      // Email is valid and belongs to the @zimra.co.zw domain
    } else {
      setMessage(
        "Email is invalid or does not belong to the @zimra.co.zw domain"
      );
    }

    try {
      const response = await axios
        .post("http://10.18.6.189:8080/saveUser", formData, {
          headers: {
            Authorization: tokenb,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: 'Welcome to ZIMRA!',
              text: 'Your account has been created successfully. Please login to continue.',
              icon: 'success',
              confirmButtonColor: '#2e7d32',
              background: '#f5f7fa',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              },
              timer: 4500,
              timerProgressBar: true,
            }).then(() => {
              // Redirect to login page after success
              window.location.href = '/login';
            });

            setToken(tokenb);
            setIsLoading(false);
            
          } else if (response.status === 500) {
            setMessage("Internal Server Error");
          } else if (response.status === 400) {
            setMessage("Bad Request");
          } else if (response.status === 404) {
            setMessage("Not Found");
          } else if (response.status === 403) {
            setMessage("Forbidden");
          } else {
            setMessage("An error occurred");
          }
        });

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEmailChange = () => {
    const emailValue = emailRef.current.value;
    const atIndex = emailValue.indexOf("@");
    if (atIndex !== -1) {
      const username = emailValue.substring(0, atIndex);
      setMyname(username);
      userNameRef.current.value = username;
    }
  };

  const handleInputClick = () => {
    setMessage("");
  };

  const handleNavigeteLogin = () => {
    <Navigate to="/login" />;
    window.location.href = "/login";
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-brand-section">
          <div className="brand-content">
            <img src="public/images/zimra.png" alt="Logo" className="logo-image" />
            <h3 className="project-title">PERFORMANCE EVALUATION SYSTEM</h3>
            <p className="tagline">Zimbabwe Revenue Authority</p>
          </div>
        </div>
        
        <div className="signup-form-section">
          <div className="form-header">
            <h1 className="title">Create Account</h1>
            <p className="subtitle">Register on ZIMRA Performance Evaluation System</p>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="First Name"
                  variant="outlined"
                  onClick={handleInputClick}
                  ref={firstNameRef}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Last Name"
                  variant="outlined"
                  onClick={handleInputClick}
                  ref={lastNameRef}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="email@zimra.co.zw"
                onClick={handleInputClick}
                onChange={handleEmailChange}
                ref={emailRef}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>EC Number</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="EC Number"
                  onClick={handleInputClick}
                  ref={ecNumberRef}
                />
              </div>
              <div className="form-group">
                <label>User Name</label>
                <input
                  defaultValue={userName}
                  className="input-field"
                  type="text"
                  placeholder="User Name"
                  onClick={handleInputClick}
                  ref={userNameRef}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Position</label>
              <input
                className="input-field"
                type="text"
                placeholder="Position"
                onClick={handleInputClick}
                ref={positionRef}
              />
            </div>
            
            <div className="form-group">
              <label>Grade</label>
              <select
                className="input-field"
                onChange={handleGradeChange}
                placeholder="Select a grade…"
                value={gradeSelected}
              >
                <option value="">Select a grade…</option>
                <option key="1" value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
              </select>
            </div>
            
            <button className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Create Account"
              )}
            </button>
            
            {message && (
              <div className="alert">
                <p>{message}</p>
              </div>
            )}
            
            <span className="cancel-link" onClick={handleNavigeteLogin}>
              Already have an account? Sign In
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
