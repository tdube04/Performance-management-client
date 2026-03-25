import React, { useState, useEffect, useRef } from "react";
import "./signup.scss";
import "animate.css/animate.min.css";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);
  const [gradeSelected, setGradeSelected] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfileInfo, setCurrentProfileInfo] = useState(null);
  const timer = useRef();

  const { setProfileData } = useStateContext();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const ecNumberRef = useRef(null);
  const positionRef = useRef(null);

  useEffect(() => {
    const { profileData } = location.state || {};
    setCurrentProfileInfo(profileData);
  }, []);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosClient.get("/division/allDivisions");
        setDivisions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDivisions();
  }, []);

  const selectedDivisionData = divisions.find(
    (d) => d.divisionName === selectedDivision
  );

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setSelectedSection("");
  };

  const handleSectionChange = (e) => setSelectedSection(e.target.value);
  const handleGradeChange = (e) => setGradeSelected(e.target.value);
  const handleInputClick = () => setMessage("");

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (!firstNameRef.current.value) return setMessage("First Name is required");
    if (!lastNameRef.current.value)  return setMessage("Last Name is required");
    if (!emailRef.current.value)     return setMessage("Email is required");
    if (!ecNumberRef.current.value)  return setMessage("EC Number is required");
    if (!positionRef.current.value)  return setMessage("Position is required");

    if (!/^[^\s@]+@[zimra]+\.[co]+\.[zw]+$/.test(emailRef.current.value)) {
      return setMessage("Email must belong to the @zimra.co.zw domain");
    }

    setIsLoading(true);
    timer.current = window.setTimeout(() => setIsLoading(false), 2000);

    const updatedProfile = {
      ...currentProfileInfo,
      name: firstNameRef.current.value,
      surname: lastNameRef.current.value,
      email: emailRef.current.value,
      ec_number: ecNumberRef.current.value,
      positionName: positionRef.current.value,
      divisionName: selectedDivision || (currentProfileInfo && currentProfileInfo.divisionName),
      sectionName: selectedSection || (currentProfileInfo && currentProfileInfo.sectionName),
      grade: gradeSelected || (currentProfileInfo && currentProfileInfo.grade),
    };

    try {
      const response = await axiosClient.put(
        `/updateUser/${currentProfileInfo.username}`,
        updatedProfile
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          timer: 2500,
          timerProgressBar: true,
        });
        setProfileData(updatedProfile);
        navigate("/");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">

        <div className="signup-form-section">
          <div className="form-header">
            <h1 className="title">Update Profile</h1>
            <p className="subtitle">Edit your ZIMRA Performance Evaluation System profile</p>
          </div>

          <form onSubmit={onSubmit}>

            {/* First Name + Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="First Name"
                  defaultValue={currentProfileInfo?.name}
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
                  defaultValue={currentProfileInfo?.surname}
                  onClick={handleInputClick}
                  ref={lastNameRef}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="email@zimra.co.zw"
                defaultValue={currentProfileInfo?.email}
                onClick={handleInputClick}
                ref={emailRef}
              />
            </div>

            {/* EC Number + Position */}
            <div className="form-row">
              <div className="form-group">
                <label>EC Number</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="EC Number"
                  defaultValue={currentProfileInfo?.ec_number}
                  onClick={handleInputClick}
                  ref={ecNumberRef}
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Position"
                  defaultValue={currentProfileInfo?.positionName}
                  onClick={handleInputClick}
                  ref={positionRef}
                />
              </div>
            </div>

            {/* Division + Section */}
            <div className="form-row">
              <div className="form-group">
                <label>Division</label>
                <select
                  className="input-field"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                >
                  <option value="">
                    {currentProfileInfo?.divisionName || "Select a division…"}
                  </option>
                  {divisions.map((d) => (
                    <option key={d.divisionName} value={d.divisionName}>
                      {d.divisionName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select
                  className="input-field"
                  value={selectedSection}
                  onChange={handleSectionChange}
                >
                  <option value="">
                    {currentProfileInfo?.sectionName || "Select a section…"}
                  </option>
                  {selectedDivisionData?.sectionName?.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grade */}
            <div className="form-group">
              <label>Grade</label>
              <select
                className="input-field"
                value={gradeSelected}
                onChange={handleGradeChange}
              >
                <option value="">
                  {currentProfileInfo?.grade || "Select a grade…"}
                </option>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={String(g)}>{g}</option>
                ))}
              </select>
            </div>

            {/* Appraisees */}
            <div className="form-group">
              <label>My Appraisees</label>
              <Autocomplete
                options={(currentProfileInfo?.appraisees) || []}
                multiple
                value={selectedResources}
                onChange={(_, newValue) => setSelectedResources(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select appraisees"
                    variant="outlined"
                  />
                )}
              />
            </div>

            {/* Submit */}
            <button className="btn-submit" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress color="inherit" size={22} /> : "Save Changes"}
            </button>

            {/* Error message */}
            {message && (
              <div className="alert">
                <p>{message}</p>
              </div>
            )}

            {/* Cancel */}
            <span className="cancel-link" onClick={() => navigate("/")}>
              Cancel — go back to dashboard
            </span>

          </form>
        </div>
      </div>
    </div>
  );
}
