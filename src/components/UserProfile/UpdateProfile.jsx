import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./signup.scss";
import "animate.css/animate.min.css";
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { Navigate } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import cookie from "cookie";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const timer = useRef();

  const {
    userName,
    token,
    userType,
    profileData,
    setUserName,
    setToken,
    setUserType,
    setProfileData,
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
  const [currentProfileInfo, setCurrentProfileInfo] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const { profileData } = location.state || {};
    setCurrentProfileInfo(profileData);
    console.log(profileData);
  }, [currentProfileInfo]);

  useEffect(() => {
    console.log(currentProfileInfo);
  }, [currentProfileInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/division/allDivisions");
        setDivisions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
    setSelectedSection("");
  };

  const selectedDivisionData = divisions.find(
    (division) => division.divisionName === selectedDivision
  );

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGradeSelected(event.target.value);
  };


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
      name: firstNameRef.current.value,
      surname: lastNameRef.current.value,
      email: emailRef.current.value,
      ec_number: ecNumberRef.current.value,
      //   username: userNameRef.current.value,
      positionName: positionRef.current.value,
      divisionName: selectedDivision,
      sectionName: selectedSection,
      grade: gradeSelected,
      userRole: currentProfileInfo.userRole,
    };
    const updatedProfile = {
      ...currentProfileInfo,
      name: firstNameRef.current.value,
      surname: lastNameRef.current.value,
      email: emailRef.current.value,
      ec_number: ecNumberRef.current.value,
      //   username: userNameRef.current.value,
      positionName: positionRef.current.value,
      divisionName: selectedDivision,
      sectionName: selectedSection,
      grade: gradeSelected,
    };

    if (/^[^\s@]+@[zimra]+\.[co]+\.[zw]+$/.test(emailRef.current.value)) {
      // Email is valid and belongs to the @zimra.co.zw domain
    } else {
      setMessage(
        "Email is invalid or does not belong to the @zimra.co.zw domain"
      );
    }
    if (!firstNameRef.current.value) {
      setMessage("First Name is required");
      return;
    }

    if (!lastNameRef.current.value) {
      setMessage("Last Name is required");
      return;
    }
    // if (!userNameRef.current.value) {
    //   setMessage("User name is required");
    //   return;
    // }

    if (!emailRef.current.value) {
      setMessage("Email is required");
      return;
    }
    if (!ecNumberRef.current.value) {
      setMessage(" Ec Number is required");
      return;
    }
    if (!positionRef.current.value) {
      setMessage("Position is required");
      return;
    }
    // if (!selectedDivision) {
    //   setMessage("Division is required");
    //   return;
    // }
    // if (!selectedSection) {
    //   setMessage("Section is required");
    //   return;
    // }
    // if (!gradeSelected) {
    //   setMessage("Grade is required");
    //   return;
    // }

    if (selectedDivision) {
      updatedProfile.divisionName = selectedDivision;
    } else {
      updatedProfile.divisionName =
        currentProfileInfo && currentProfileInfo.divisionName;
    }
    if (selectedSection) {
      updatedProfile.sectionName = selectedSection;
    } else {
      updatedProfile.sectionName =
        currentProfileInfo && currentProfileInfo.sectionName;
    }
    if (gradeSelected) {
      updatedProfile.grade = gradeSelected;
    } else {
      updatedProfile.grade = currentProfileInfo && currentProfileInfo.grade;
    }

    try {
      const response = await axiosClient
        .put(`/updateUser/${currentProfileInfo.username}`, updatedProfile)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            Swal.fire({
              title: "Success!",
              text: "Successfully Updated!",
              icon: "success",
              timer: 2000,
            });

            navigate("/");
            setProfileData(updatedProfile);
            console.log(profileData);
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

      //   console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  // const handleDivisionChange = (event) => {
  //   if (event && event.target) {
  //     setSectionNames(event.target.value);
  //   }
  // };
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

  const handleNavigeteCancel = () => {
    navigate("/");
  };

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "400px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 1 }}>
          <strong>
            {" "}
            Edit Your Profile for ZIMRA Perfomance Evaluation System
          </strong>
        </Typography>
      </Paper>
      <div className="login-signup-form animated fadeInDown">
        <div className="form" style={{ marginLeft: "845px" }}>
          <form onSubmit={onSubmit}>
            <h1 className="title">Update Your Profile</h1>
            <Typography className="" sx={{ ml: 10 }}>
              Register on ZIMRA Perfomance Evaluation System
            </Typography>

            <div style={{ marginBottom: "5px" }}>
              <label>First Name: </label>
              <input
                defaultValue={currentProfileInfo && currentProfileInfo.name}
                className="input1"
                type="text"
                placeholder="First Name"
                variant="outlined"
                onClick={handleInputClick}
                ref={firstNameRef}
              />
            </div>
            <div style={{ marginBottom: "5px" }}>
              <label>Last Name: </label>
              <input
                defaultValue={currentProfileInfo && currentProfileInfo.surname}
                className="input1"
                type="text"
                placeholder="Last Name"
                variant="outlined"
                onClick={handleInputClick}
                ref={lastNameRef}
              />
            </div>
            <div style={{ marginBottom: "5px" }}>
              <label>Email: </label>
              <input
                defaultValue={currentProfileInfo && currentProfileInfo.email}
                className="input2"
                type="email"
                placeholder="email@zimra.co.zw"
                onClick={handleInputClick}
                onChange={handleEmailChange}
                ref={emailRef}
              />
            </div>
            <div style={{ marginBottom: "5px" }}>
              <label>EC Number: </label>
              <input
                defaultValue={
                  currentProfileInfo && currentProfileInfo.ec_number
                }
                className="input2"
                type="number"
                placeholder="EC Number"
                onClick={handleInputClick}
                ref={ecNumberRef}
              />
            </div>
            {/* <div style={{ marginBottom: "5px" }}>
            <label>User Name: </label>
            <input
             defaultValue={currentProfileInfo.name}
              defaultValue={userName}
              className="input2"
              type="text"
              placeholder="User Name"
              onClick={handleInputClick}
              ref={userNameRef}
            />
          </div> */}
            <div style={{ marginBottom: "5px" }}>
              <label>Position: </label>
              <input
                defaultValue={
                  currentProfileInfo && currentProfileInfo.positionName
                }
                className="input2"
                type="text"
                placeholder="Position"
                onClick={handleInputClick}
                ref={positionRef}
              />
            </div>
            {/* <div style={{ marginBottom: "5px" }}>
            <label>Division: </label>
            <input
              className="input2"
              type="text"
              placeholder="Division"
              ref={divisionRef}
              onClick={handleInputClick}
            />
          </div> */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>Division:</label>
                <select
                  defaultValue={
                    currentProfileInfo && currentProfileInfo.divisionName
                  }
                  className="input2"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  placeholder="Select a division…"
                  style={{
                    marginLeft: "80px",
                    width: 247,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={
                      currentProfileInfo && currentProfileInfo.divisionName
                    }
                  >
                    {currentProfileInfo && currentProfileInfo.divisionName}
                  </option>
                  {divisions &&
                    divisions.map((division) => (
                      <option
                        key={division.divisionName}
                        value={division.divisionName}
                      >
                        {division.divisionName}
                      </option>
                    ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>Section:</label>
                <select
                  defaultValue={
                    currentProfileInfo && currentProfileInfo.sectionName
                  }
                  className="input2"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  placeholder="Select a section…"
                  style={{
                    marginLeft: "80px",
                    width: 247,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={currentProfileInfo && currentProfileInfo.sectionName}
                  >
                    {currentProfileInfo && currentProfileInfo.sectionName}
                  </option>
                  {selectedDivisionData &&
                    selectedDivisionData.sectionName.map((sectionName) => (
                      <option
                        key={sectionName}
                        value={sectionName}
                      >
                        {sectionName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label style={{ marginRight: "10px" }}>Grade: </label>
              <select
                defaultValue={currentProfileInfo && currentProfileInfo.grade}
                className="input2"
                onChange={handleGradeChange}
                placeholder="Select a grade…"
                value={gradeSelected}
                indicator={<KeyboardArrowDown />}
                style={{
                  marginLeft: "80px",
                  width: 247,
                  backgroundColor: "#f9f6f6",
                  [`& .${selectClasses.indicator}`]: {
                    transition: "0.2s",
                    [`&.${selectClasses.expanded}`]: {
                      transform: "rotate(-180deg)",
                    },
                  },
                }}
              >
                <option value={currentProfileInfo && currentProfileInfo.grade}>
                  {currentProfileInfo && currentProfileInfo.grade}
                </option>
                <option key="1" value="1">
                  1
                </option>
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
              {/* <input
              className="input2"
              type="text"
              placeholder="Grade"
              ref={gradeRef}
              onClick={handleInputClick}
            /> */}
            </div>
            <div style={{ marginLeft: "-5px" }}>
              <label
                style={{
                  textAlign: "left",
                  width: "180px",

                  marginRight: "60px",
                }}
              >
                My Appraisees:{" "}
              </label>
              <Autocomplete
                options={
                  (currentProfileInfo && currentProfileInfo.appraisees) || []
                }
                multiple
                style={{ width: 500, backgroundColor: "#f9f6f6" }}
                value={selectedResources}
                onChange={(event, newValue) => {
                  setSelectedResources(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // variant="standard"
                    placeholder="You can select many people"
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        background: "#f9f6f6",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        border: "1px solid #ccc", // Add thin border here
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className="">
              <button className="btn-login">
                {isLoading ? (
                  <div style={{ margin: "auto" }}>
                    <CircularProgress color="success" />{" "}
                  </div>
                ) : (
                  "Update"
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

            {message && (
              <div className="alert alert-danger">
                <p>{message}</p>
              </div>
            )}
          </form>
          <div style={{ marginRight: "160px" }}>
            <Typography
              onClick={handleNavigeteCancel}
              sx={{
                ml: 55,
                "&:hover": {
                  color: "green",
                  cursor: "pointer",
                },
              }}
            >
              Cancel
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}
