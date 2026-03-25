import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";

import Button from "@material-ui/core/Button";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AssessmentIcon from "@mui/icons-material/Assessment";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axiosClient from "../../authentication/axios-client";
import ArticleIcon from "@mui/icons-material/Article";
import { useStateContext } from "../../context/ContextProvider";
import Grid from "@mui/material/Grid";
import { borderRadius } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { AttachFile } from "@mui/icons-material";

const AttachEvidence = ({ onFileSelect }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    onFileSelect(file);
  };

  return (
    <div>
      <label htmlFor="fileInput">Attach File: </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button onClick={() => document.getElementById("fileInput").click()}>
        Browse
      </button>
    </div>
  );
};
const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  let quarter;
  let daysRemaining;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    const endOfQuarter = new Date(currentYear, 2, 31); // March 31st
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    const endOfQuarter = new Date(currentYear, 5, 30); // June 30th
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    const endOfQuarter = new Date(currentYear, 8, 30); // September 30th
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    const endOfQuarter = new Date(currentYear, 11, 31); // December 31st
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    daysRemaining: daysRemaining,
  };
};

const ActualPerformance = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sectionRef = useRef();
  const actual_perfomanceRef = useRef(null);
  const indicatorRef = useRef(null);
  const weightRef = useRef(null);
  const outcomeRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);
  const perfomanceCommentRef = useRef(null);
  const annualTargetRef = useRef(null);
  const varianceRef = useRef(null);
  const targetRef = useRef(null);

  const { userName, setUserName, userType, setUserType } = useStateContext();

  const [performances, setPerformances] = useState([]);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const [performanceAreas, setPerformanceAreas] = useState([]);

  const [selectedPerfomance, setSelectedPerfomance] = useState("");

  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");

  const [selectedProgram, setSelectedProgram] = useState("");

  const [selectedIndicator, setSelectedIndicator] = useState("");

  const [selectedMeasurement, setSelectedMeasurement] = useState("");

  const [programIndex, setProgramIndex] = useState(null);

  const [message, setMessage] = useState(null);

  const [selectedArea, setSelectedArea] = useState(null);

  const [openIndex, setOpenIndex] = React.useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [id, setId] = useState(0);

  const [profileData, setProfileData] = useState(" ");

  const [error, setError] = useState(null);

  const [programWeight, setProgramWeight] = useState(null);

  const [otherMeasurement, setOtherMeasurement] = useState("");

  const [performance, selectedPerformance] = useState(null);

  const [postedData, setPostedData] = useState(null);

  const [divisions, setDivisions] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [isProgramSelected, setIsProgramSelected] = useState(false);

  const [totalIndicatorWeight, setTotalIndicatorWeight] = useState(0);

  const [availableIndicatorWeight, setAvailableIndicatorWeight] = useState(0);

  const [responseBody, setResponseBody] = useState([]);

  const [selectedIndicators, setSelectedIndicators] = useState([]);

  const [allowableVariance, setAllOwableVariance] = useState(0);

  const [annualTarget, setAnnualTarget] = useState(0);

  const [description, setDescription] = useState("");

  const [incrementalOrDecremental, setIncrementalOrDecremental] = useState("");

  const [measurementUnit, setMeasurementUnit] = useState("");

  const [quarterlyTarget, setQuarterlyTarget] = useState(0);

  const [responsibleDivision, setResponsibleDivision] = useState("");
  const [responsibleResource, setResponsibleResource] = useState("");
  const [responsibleSection, setResponsibleSection] = useState("");
  const [indicatorWeight, setIndicatorWeight] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentProgramData, setCurrentProgramData] = useState(null);
  const [currentPerformanceData, setCurrentPerformanceData] = useState(null);
  const [selectedIndicatorData, setSelectedIndicatorData] = useState(null);
  const [totalPerformanceScore, setTotalPerformanceScore] = useState(null);
  const [overallAgreedScore, setOverallAgreedScore] = useState(null);

  const [fileName, setFileName] = useState("");
  const [evidenceAttached, setEvidenceAttached] = useState(null);

  const [score, setScore] = useState(null);
  const [agreedWeightedScore, setAgreedWeightedScore] = useState(null);
  const [scoringKey, setScoringKey] = useState("");
  const [
    totalOvaralAgreedWeightedScore,
    setTotalOvaralAgreedWeightedScore,
  ] = useState(null);

  const handleInputKeyUp = () => {
    if (!selectedIndicatorData) return;
    
    const quarterlyTarget = parseFloat(selectedIndicatorData.quarterly_target) || 0;
    const allowableVariance = parseFloat(selectedIndicatorData.allowable_variance) || 0;
    const incrementalDecremental = selectedIndicatorData.incremental_or_decremental;
    const indicatorWeight = parseFloat(selectedIndicatorData.weight) || 0;
    const actualPerformanceInput = actual_perfomanceRef.current.value;
    
    if (actualPerformanceInput === "") {
      setScore(0);
      setAgreedWeightedScore(0);
      setScoringKey("");
      return;
    }
    
    const actualPerformance = parseFloat(actualPerformanceInput);
    
    if (isNaN(actualPerformance)) {
      setScore(0);
      setAgreedWeightedScore(0);
      setScoringKey("Invalid input");
      return;
    }

    var newScore = 0;
    var newAgreedWeightedScore = 0;
    var newScoringKey = "";

    if (incrementalDecremental === "Incremental") {
      if (actualPerformance === 0) {
        newScore = 1;
        newAgreedWeightedScore = (1 * indicatorWeight) / 100;
        newScoringKey = "Nothing was accomplished";
      } else if (actualPerformance === quarterlyTarget) {
        newScore = 4;
        newAgreedWeightedScore = (4 * indicatorWeight) / 100;
        newScoringKey = "Met all agreed set targets";
      } else if (
        actualPerformance > quarterlyTarget &&
        actualPerformance <= quarterlyTarget + allowableVariance
      ) {
        newScore = 5;
        newAgreedWeightedScore = (5 * indicatorWeight) / 100;
        newScoringKey = "Performance above set targets -  but within variance";
      } else if (actualPerformance > quarterlyTarget + allowableVariance) {
        newScore = 6;
        newAgreedWeightedScore = (6 * indicatorWeight) / 100;
        newScoringKey = "Clearly exceeds set targets - but beyond variance";
      } else if (
        actualPerformance < quarterlyTarget &&
        actualPerformance >= quarterlyTarget - allowableVariance
      ) {
        newScore = 3;
        newAgreedWeightedScore = (3 * indicatorWeight) / 100;
        newScoringKey = "Performance below set targets - but within variance";
      } else if (actualPerformance < quarterlyTarget - allowableVariance) {
        newScore = 2;
        newAgreedWeightedScore = (2 * indicatorWeight) / 100;
        newScoringKey = "Performance below set targets - but below variance";
      }
      
      setScore(newScore);
      setAgreedWeightedScore(newAgreedWeightedScore);
      setScoringKey(newScoringKey);
      setIncrementalOrDecremental("Incremental");
    } else if (incrementalDecremental === "Decremental") {
      if (actualPerformance === 0) {
        newScore = 1;
        newAgreedWeightedScore = (1 * indicatorWeight) / 100;
        newScoringKey = "Nothing was accomplished";
      } else if (actualPerformance === quarterlyTarget) {
        newScore = 4;
        newAgreedWeightedScore = (4 * indicatorWeight) / 100;
        newScoringKey = "Met all agreed set targets";
      } else if (
        actualPerformance > quarterlyTarget &&
        actualPerformance <= quarterlyTarget + allowableVariance
      ) {
        newScore = 3;
        newAgreedWeightedScore = (3 * indicatorWeight) / 100;
        newScoringKey = "Performance below set targets - but within variance";
      } else if (actualPerformance > quarterlyTarget + allowableVariance) {
        newScore = 2;
        newAgreedWeightedScore = (2 * indicatorWeight) / 100;
        newScoringKey = "Performance below set targets - but below variance";
      } else if (
        actualPerformance < quarterlyTarget &&
        actualPerformance >= quarterlyTarget - allowableVariance
      ) {
        newScore = 5;
        newAgreedWeightedScore = (5 * indicatorWeight) / 100;
        newScoringKey = "Performance above set targets -  but within variance";
      } else if (actualPerformance < quarterlyTarget - allowableVariance) {
        newScore = 6;
        newAgreedWeightedScore = (6 * indicatorWeight) / 100;
        newScoringKey = "Clearly exceeds set targets - but beyond variance";
      }
      
      setScore(newScore);
      setAgreedWeightedScore(newAgreedWeightedScore);
      setScoringKey(newScoringKey);
      setIncrementalOrDecremental("Decremental");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
        console.log("My Appraiser profile");
        console.log(response.data);

        const {
          indicator,
          program,
          area,
          totalAgreedScorePerformances,
          overallAgreedScorePerformances,
        } = location.state || {};

        console.log(indicator);
        console.log(program);
        console.log(area);

        setSelectedIndicatorData(indicator);
        setCurrentProgramData(program);
        setCurrentPerformanceData(area);
        setTotalPerformanceScore(totalAgreedScorePerformances);
        setOverallAgreedScore(overallAgreedScorePerformances);
        
        // Get indicator name from URL search params
        const searchParams = new URLSearchParams(location.search);
        const indicatorNameParam = searchParams.get('indicatorName');
        if (indicatorNameParam) {
          const decodedIndicatorName = decodeURIComponent(indicatorNameParam);
          console.log("Indicator name from URL:", decodedIndicatorName);
          setSelectedIndicator(decodedIndicatorName);
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

  useEffect(() => {
    console.log(totalPerformanceScore);
    console.log(overallAgreedScore);
  }, [totalPerformanceScore, overallAgreedScore]);

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

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };
  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      axiosClient
        .post("/file/upload", formData)
        .then((response) => {
          console.log("File uploaded successfully:", response.data.id);
          console.log("File Data:", response.data);
          // Handle the response as needed
          setEvidenceAttached(response.data.id);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      console.log("No file selected.");
    }
  };
  const handleSubmitIndicators = async (e) => {
    e.preventDefault();

    if (!actual_perfomanceRef.current.value) {
      setMessage("Percentage Weight is required.");
    } else {
      const weight = parseFloat(actual_perfomanceRef.current.value);
      if (isNaN(weight) || weight < 1) {
        setMessage("Please enter a valid weight between 1 and 100.");
      }
    }

    const newIndicatorData = {
      appraisee_actual_perfomance: actual_perfomanceRef.current.value,
      agreedWeightedScore: agreedWeightedScore,
      appraiseeScore: score,
    };
    console.log(newIndicatorData);

    axiosClient
      .get("/scorecard/searchScorecard", {
        params: {
          period: evaluationPeriod,
          username: userName,
        },
      })
      .then((res) => {
        const scorecard = res.data;
        if (scorecard.content && scorecard.content.length > 0) {
          // There is an existing scorecard, so update it
          console.log("There is an existing scorecard, so update it", res.data);
          console.log("My ID: " + res.data.content[0].id);
          const scorecardId = res.data.content[0].id;
          const existingAreasOfPerformance =
            res.data.content[0].areasOfPerformance || [];
          console.log("My Areas: ");
          console.log(existingAreasOfPerformance);

          // Find the existing performance area
          const existingPerformanceArea = existingAreasOfPerformance.find(
            (area) => area.performanceArea === performanceRef.current.value
          );

          if (existingPerformanceArea) {
            // Performance area already exists, find the existing program
            const existingProgram = existingPerformanceArea.programs.find(
              (program) => program.name === outcomeRef.current.value
            );
            const programIndex = existingPerformanceArea.programs.findIndex(
              (program) => program.name === outcomeRef.current.value
            );

            if (existingProgram) {
              // Program already exists, update its indicators array
              const indicatorIndex = existingProgram.indicators.findIndex(
                (myIndicat) =>
                  myIndicat.description === indicatorRef.current.value
              );

              if (indicatorIndex !== -1) {
                // Indicator already exists, update its data
                existingPerformanceArea.programs[programIndex].indicators[
                  indicatorIndex
                ] = {
                  ...existingPerformanceArea.programs[programIndex].indicators[
                    indicatorIndex
                  ],
                  ...newIndicatorData,
                };

                const totalAgreedWeightedScore =
                  totalPerformanceScore + newIndicatorData.agreedWeightedScore;
                console.log(totalAgreedWeightedScore);

                const sumOfOverallAgreedWeightedScore =
                  overallAgreedScore + totalAgreedWeightedScore;

                existingPerformanceArea.performance_area_score = totalAgreedWeightedScore;
                console.log(existingPerformanceArea.performance_area_score);

                const updatedScorecard = {
                  ...scorecard.content[0],
                  areasOfPerformance: existingAreasOfPerformance,
                  total_overal_weighted_score: sumOfOverallAgreedWeightedScore,
                };

                console.log("Sending updatedScorecard with total_overal_weighted_score:", updatedScorecard.total_overal_weighted_score);
                console.log("Full updatedScorecard:", updatedScorecard);

                axiosClient
                  .put(`/scorecard/updateScorecard/${scorecardId}`, updatedScorecard)
                  .then((res) => {
                    console.log("Update response status:", res.status);
                    console.log("Update response data:", res.data);
                    if (res.status === 200) {
                      swal({
                        text: `Actual Performance Added Successfully! New Total Weighted Score: ${updatedScorecard.total_overal_weighted_score?.toFixed(2)}`,
                        icon: "success",
                        button: "OK!",
                      });
                      navigate("/resultscorecard");
                    }
                  })
                  .catch((err) => {
                    console.error("Update error:", err.response?.data || err.message);
                  });
              } else {
                // Indicator doesn't exist, create a new one
                console.log("Indicator doesn't exist");
                // updatedPerformanceArea.programs[programIndex].indicators.push(newIndicatorData);
              }
              // existingProgram.indicators.push(newIndicatorData);
            } else {
              // Program doesn't exist, create a new one
              console.log("Program doesn't exist");
              // existingPerformanceArea.programs.splice;
            }
          } else {
            // Performance area doesn't exist, create a new one
            setMessage("Selected Performance not found");
          }
        } else {
          console.log("You Have No Scorecard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleInputClick = () => {
    setMessage("");
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 10, p: 1 }}>
          <strong> ADD ACTUAL PERFORMANCE</strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 370, marginTop: 30, display: "flex" }}>
        <div style={{ marginRight: 20 }}>
          <Typography className="" sx={{ fontSize: 12 }}>
            <strong>
              Current Year Of Assessment:{" "}
              <span style={{ color: "#309366" }}>{evaluationPeriod}</span>
            </strong>
          </Typography>
        </div>
        <div>
          <Typography className="" sx={{ fontSize: 12 }}>
            <strong>
              Current Quarter Ends In:{" "}
              <span style={{ color: "#f44336" }}>{daysRemaining} days</span>
            </strong>
          </Typography>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "200px",
        }}
      >
        <div
          style={{
            transform: selectedPerfomance ? "translateX(-200px)" : "none",
            transition: "margin-left 0.5s ease-in-out",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              ml: 10,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            {/* {selectedPerfomance && (
              <div>
                <Typography style={{ color: "#309366" }}>
                  Selected Performance: {selectedArea.performanceArea}
                </Typography>
                <Typography style={{ color: "#309366" }}>
                  Current Total Performance: {selectedArea.weight}%
                </Typography>
              </div>
            )} */}
            <h4>Add Actual Performance For Indicator: {selectedIndicator || (selectedIndicatorData && selectedIndicatorData.description)} </h4>

            <form style={{ width: "670px" }}>
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "180px" }}>
                  Select a Performance
                </label>
                <input
                  defaultValue={
                    currentPerformanceData &&
                    currentPerformanceData.performanceArea
                  }
                  disabled
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder=""
                  onClick={handleInputClick}
                  ref={performanceRef}
                />
              </div>

              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "180px" }}>
                  Selected Program:{" "}
                </label>
                <input
                  defaultValue={currentProgramData && currentProgramData.name}
                  disabled
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder=""
                  onClick={handleInputClick}
                  ref={outcomeRef}
                />
              </div>

              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "180px" }}>
                  Selected Indicator:{" "}
                </label>
                <input
                  defaultValue={
                    selectedIndicatorData && selectedIndicatorData.description
                  }
                  disabled
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder=""
                  onClick={handleInputClick}
                  ref={indicatorRef}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "250px" }}>
                  Actual Performance(%):{" "}
                </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Weight"
                  onClick={handleInputClick}
                  onKeyUp={handleInputKeyUp}
                  ref={actual_perfomanceRef}
                />
              </div>

              {/* <div
                style={{
                  // display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <Typography variant="body2" sx={{ mt: 6, fontWeight: "bold" }}>
                  Scoree:
                </Typography>
                <Typography
                  variant="h8"
                  sx={{
                    mt: 6,
                    fontWeight: "bold",
                    color:
                      score === 1 || score === 2
                        ? "red"
                        : score === 3
                        ? "goldenrod"
                        : score === 4
                        ? "green"
                        : "blue",
                  }}
                >
                  {score}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  Agreed Weighted Scored:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {agreedWeightedScore}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  IRBM Scoring Key:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {scoringKey}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  Indicator is:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {incrementalOrDecremental}
                </Typography>
              </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div>
                  <div
                    className="btn-addPillar"
                    style={{ marginTop: "-20px", marginLeft: "100px" }}
                  >
                    <button
                      onClick={handleSubmitIndicators}
                      className="pillar-btn"
                      style={{ borderRadius: "25px" }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div className="alert alert-danger">
                  <p>{message}</p>
                </div>
              )}
            </form>
          </Paper>
        </div>
        <div>
          {selectedPerfomance && (
            <div className="new-div">
              <Sheet
                variant="outlined"
                sx={{
                  width: 400,
                  height: 470,
                  maxHeight: 250,
                  overflow: "auto",
                  borderRadius: "sm",
                  mt: 1,
                  ml: -15,
                  p: 2,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  borderTop: "8px solid #309366",
                  position: "relative",
                  elevation: 3,
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Nested List Items
                    </ListSubheader>
                  }
                >
                  <ListSubheader component="div" id="nested-list-subheader">
                    Selected Performance Area : {selectedPerfomance}
                  </ListSubheader>

                  {selectedPrograms.length > 0 ? (
                    <div>
                      <Typography sx={{ ml: 2 }}>
                        {" "}
                        Performance Programs{" "}
                      </Typography>
                      {selectedPrograms.map((program, index) => (
                        <React.Fragment key={program.id}>
                          <ListItemButton
                            onClick={() =>
                              handlePerformanceClick(program, index)
                            }
                          >
                            <ListItemIcon>
                              <AssessmentIcon />
                            </ListItemIcon>

                            <ListItemText
                              primary={` ${program.programName}(${program.weight}%)`}
                            />
                          </ListItemButton>
                          <Collapse
                            in={openIndex === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div">
                              {program.programs &&
                                program.programs.map((indicator) => (
                                  <ListItem
                                    key={indicator.programName}
                                    // onClick={() =>
                                    //   handleProgramClick(indicator, index)
                                    // }
                                    sx={{ pl: 4 }}
                                    endAction={
                                      <div>
                                        <IconButton
                                          sx={{
                                            fontSize: "15px",
                                            color: "green",
                                          }}
                                          onMouseEnter={() =>
                                            setIsHovered(true)
                                          }
                                          onMouseLeave={() =>
                                            setIsHovered(false)
                                          }
                                          onClick={() =>
                                            handleUpdateDialog(item.id)
                                          }
                                        >
                                          <ModeEditIcon
                                            sx={{
                                              fontSize: "15px",
                                            }}
                                          />
                                        </IconButton>
                                        <IconButton
                                          sx={{
                                            fontSize: "5px",
                                            color: "red",
                                          }}
                                          onMouseEnter={() =>
                                            setIsHovered(true)
                                          }
                                          onMouseLeave={() =>
                                            setIsHovered(false)
                                          }
                                          onClick={() =>
                                            handleDelete(
                                              indicator.programName,
                                              indicator.weight
                                            )
                                          }
                                        >
                                          <DeleteIcon
                                            sx={{
                                              fontSize: "15px",
                                            }}
                                          />
                                        </IconButton>
                                      </div>
                                    }
                                  >
                                    <ListItemIcon
                                      sx={{ fontSize: "extraSmall" }}
                                    >
                                      <FiberManualRecordIcon
                                        style={{ fontSize: "smaller" }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={indicator.programName}
                                      sx={{
                                        "&:hover": {
                                          backgroundColor: "#DEDDE2",
                                          cursor: "pointer",
                                        },
                                      }}
                                    />
                                  </ListItem>
                                ))}
                            </List>
                          </Collapse>
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <p>No programs found for the selected performance area.</p>
                  )}
                </List>
              </Sheet>
              <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ mt: 6 }}>
                      Update a Program
                    </Typography>
                  </div>
                  <br />
                  <form
                    onSubmit={(e) =>
                      handleUpdate(
                        e,
                        outcomeRef.current.value,
                        weightRef.current.value
                      )
                    }
                    style={{ width: "500px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <label>Enter Program: </label>
                      <input
                        defaultValue={selectedProgram.programName}
                        className="input2 animate__animated animate__bounceIn"
                        type="text"
                        placeholder="Program"
                        onClick={handleInputClick}
                        ref={outcomeRef}
                      />
                    </div>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <label>Enter Weight(%): </label>
                      <input
                        defaultValue={selectedProgram.weight}
                        className="input2 animate__animated animate__bounceIn"
                        type="text"
                        placeholder="Percentage Weight"
                        onClick={handleInputClick}
                        ref={weightRef}
                      />
                    </div>

                    <div className="btn-addPillar">
                      <button
                        className="pillar-btn"
                        style={{ borderRadius: "25px" }}
                      >
                        Update
                      </button>
                    </div>
                    {message && (
                      <div className="alert alert-danger">
                        <p>{message}</p>
                      </div>
                    )}
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setModalOpen(false)} color="primary">
                    Close
                  </Button>
                  {/* <Button onClick={() => setModalOpen(false)} color="primary">
                  Update
                </Button> */}
                </DialogActions>
              </Dialog>
            </div>
          )}
          {isProgramSelected && (
            <div
              style={{
                width: "400px",
                marginLeft: "-110px",
                marginTop: "10px",
              }}
            >
              <Typography>
                {totalIndicatorWeight === 0 ? (
                  <strong style={{ color: "#309366" }}>
                    You have no indicators present under the selected program
                  </strong>
                ) : (
                  <>
                    Total Weight of Indicators used:{" "}
                    <strong style={{ color: "#309366" }}>
                      {totalIndicatorWeight}%
                    </strong>
                    <Typography>
                      Unused Percentage Weight:{" "}
                      <strong style={{ color: "#f44336" }}>
                        {availableIndicatorWeight}%
                      </strong>
                    </Typography>
                  </>
                )}
              </Typography>
            </div>
          )}

          {isFormSubmitted && (
            <>
              <hr style={{ width: "400px", marginLeft: "-120px" }} />
              <div className="new-div2">
                <Paper
                  variant="outlined"
                  sx={{
                    width: 400,
                    height: 310,
                    mt: 1,
                    ml: -15,
                    p: 2,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                    borderTop: "7px solid #f0ec13",
                    position: "relative",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#818197" }}>
                    New Indicator Details:{" "}
                  </Typography>
                  {/* <Typography variant="caption" color="text.secondary" sx={{}}>
                  {postedData.division}
                </Typography> */}
                  <Typography display="block" variant="caption">
                    Indicator Name:{postedData.indicator}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    Division Responsible:{postedData.division}
                  </Typography>

                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                    sx={{}}
                  >
                    Program:{postedData.program}
                  </Typography>
                  <Typography display="block" variant="caption">
                    Annual Target:{postedData.annualTarget}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    Current quarter Target:{postedData.target}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    Allowable variance:{postedData.variance}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Previous Performance:{postedData.prevPerformance}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    Measurement Unit:{postedData.measurement}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    weight:{postedData.weight}
                  </Typography>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                  >
                    Performance Area:{postedData.performance}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      position: "relative",
                      marginTop: "20px",
                    }}
                  >
                    <IconButton
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={() => handleUpdateDialog(performancearea.id)}
                    >
                      <ModeEditIcon sx={{ fontSize: "20px", color: "green" }} />
                    </IconButton>
                    <IconButton
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={() => handleDelete(performancearea.id)}
                    >
                      <DeleteIcon sx={{ fontSize: "20px", color: "red" }} />
                    </IconButton>
                  </div>
                </Paper>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ActualPerformance;
