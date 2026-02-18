import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

// import Button from "@material-ui/core/Button";
import { Button, Input, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";

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
import { useLocation } from "react-router-dom";
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

const WorkingScoreCard = () => {
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

  const [fileName, setFileName] = useState("");
  const [evidenceAttachedId, setEvidenceAttachedId] = useState(null);
  const [evidenceAttachedName, setEvidenceAttachedName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
        setProfileData(response.data);
        console.log("My Appraiser profile");
        console.log(response.data);

        const { indicator, program, area } = location.state || {};

        console.log(indicator);
        console.log(program);
        console.log(area);

        setSelectedIndicatorData(indicator);
        setCurrentProgramData(program);
        setCurrentPerformanceData(area);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

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

  useEffect(() => {
    const fetchData = async () => {
      const appraiseeWorkplanArray = [];
      if (profileData) {
        try {
          const response = await axiosClient.get("/workplan/searchWorkplan", {
            params: {
              period: evaluationPeriod,
              username: userName,
            },
          });
          console.log("Appraisee Workplan");
          console.log(response.data);
          appraiseeWorkplanArray.push(response.data);
          setResponseBody(appraiseeWorkplanArray);
          console.log(appraiseeWorkplanArray);

          const areasOfPerformance = response.data.content[0].AreasOfPerformance;

          console.log("performance Workplan", areasOfPerformance);

          setPerformanceAreas(areasOfPerformance);
          console.log(performanceAreas);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [profileData]);

  const handlePerformanceClick = (area, index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Performance clicked", area);
    setSelectedPerfomanceArea(area);
    console.log("Performance", index);
  };

  const handleProgramClick = (program, index) => {
    console.log("Program clicked", program);
    setSelectedProgram(program);
    setProgramIndex(index);
    console.log("Program Index ", index);
  };

  const handlePerformanceChange = (event) => {
    const selected = performanceAreas.find(
      (area) => area.performanceArea === event.target.value
    );
    setSelectedArea(selected);
    if (event && event.target) {
      setSelectedPerfomance(event.target.value);
    }
    setSelectedPrograms(selected ? selected.programs : []);
  };

  const handleDivisionChange = (event) => {
    if (event && event.target) {
      setSelectedDivision(event.target.value);
    }
  };

  const handleProgramChange = async (event) => {
    if (event && event.target) {
      setSelectedProgram(event.target.value);
      console.log("Selected program:", event.target.value);
    }

    const selectedPerformanceArea = performanceAreas.find(
      (area) => area.performanceArea === selectedPerfomance
    );
    console.log("My Selected programs q:", selectedPerformanceArea.programs);
    // Find the program with the selected program name
    const myselectedProgram = selectedPerformanceArea?.programs.find(
      (program) => program.programName === event.target.value
    );

    console.log("My Selected program w:", myselectedProgram);
    // setProgramWeight(myselectedProgram.);
    // Update the program weight state
    // if (myselectedProgram) {
    //   setProgramWeight(myselectedProgram.weight);
    //   console.log("weight", programWeight);
    // } else {
    //   setProgramWeight(0);
    // }

    //////////////////////////////////////////////////////////////////////
    try {
      const response = await axiosClient.get("/workplan/searchWorkplan", {
        params: {
          period: evaluationPeriod,
          username: userName,
        },
      });

      const workplanData = response.data.content[0];

      // Find the performance area with the selected program
      // const selectedPerformanceAreaRef = workplanData.areasOfPerformnce?.find(
      //   (area) => area.performanceArea === selectedPerfomance
      // );
      const selectedPerformanceAreaRef =
        workplanData && workplanData.AreasOfPerformance
          ? workplanData.AreasOfPerformance.find(
              (area) => area.performanceArea === selectedPerfomance
            )
          : undefined;

      // Find the program with the selected program name
      const selectedProgramRef = selectedPerformanceAreaRef?.programs.find(
        (program) => program.name === event.target.value
      );
      console.log("selectedProgramRef :", selectedProgramRef.indicators);

      // Calculate the total weight of the indicators within the selected program
      let totalWeight = 0;
      if (selectedProgramRef && selectedProgramRef.indicators) {
        selectedProgramRef.indicators.forEach((indicator) => {
          totalWeight += indicator.weight;
        });
        setSelectedIndicators(selectedProgramRef?.indicators || []);
        console.log("My Indicators :", selectedIndicators);
        setTotalIndicatorWeight(totalWeight);
      }
      // setSelectedIndicators(selectedProgramRef?.indicators || []);
      // console.log("My Indicators :", selectedIndicators);

      setAvailableIndicatorWeight(programWeight - totalIndicatorWeight);
      setIsProgramSelected(true);
      console.log("Total Indicators Weight:", totalWeight);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIndicatorChange = (event) => {
    setSelectedIndicator(event.target.value);

    console.log(selectedIndicator);
  };

  const handleMeasurementChange = (event) => {
    const selectedValue = event.target.value;
    if (event && event.target) {
      setSelectedMeasurement(event.target.value);
    }
    if (selectedValue !== "Other") {
      setOtherMeasurement("");
    }
  };

  const handleOtherMeasurementChange = (event) => {
    setOtherMeasurement(event.target.value);
  };

  const performanceArea =
    performanceAreas &&
    performanceAreas.find((area) => area.id === selectedPerformance);

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  // const handleFileSelect = (file) => {

  //   // Do something with the selected file
  // };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };
  // const handleFileUpload = async () => {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);
  //     try {
  //       const response = await axiosClient.post("/file/upload", formData);
  //       console.log("File uploaded successfully:", response.data.id);
  //       console.log("File Data:", response.data);
  //       setEvidenceAttachedId(response.data.id);
  //       setEvidenceAttachedName(response.data.filename);
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //     }
  //   }
  // };
  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const response = await axiosClient.post("/file/upload", formData);
        console.log("File uploaded successfully:", response.data.id);
        console.log("File Data:", response.data);
        setEvidenceAttachedId(response.data.id);
        setEvidenceAttachedName(response.data.filename);
        return response.data; // Return the uploaded file data
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // Throw the error to be caught in the calling function
      }
    }
  };

  useEffect(() => {
    console.log(evidenceAttachedName, evidenceAttachedId);
  }, [evidenceAttachedName, evidenceAttachedId]);

  const handleSubmitIndicators = async (e) => {
    e.preventDefault();
    const updatedPerformanceArea =
      performanceAreas &&
      performanceAreas.find(
        (area) => area.performanceArea === performanceRef.current.value
      );

    console.log(updatedPerformanceArea);

    // Check if a file is attached
    console.log(selectedFile);
    if (selectedFile) {
      try {
        // Upload the file and wait for it to finish
        const uploadedFile = await handleFileUpload();
        console.log("Uploaded File:", uploadedFile);
        // Set the evidenceInfo using the uploaded file data
        const evidenceInfo = {
          filename: uploadedFile.filename,
          id: uploadedFile.id,
        };
        console.log(evidenceInfo);
        const newIndicatorData = {
          perfomanceComment: perfomanceCommentRef.current.value,
          evidenceFileIds: [evidenceInfo],
        };

        const newPerformanceArea = { ...updatedPerformanceArea };

        const evaluationPeriod = getCurrentEvaluationPeriod().evaluationPeriod;

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
              console.log(
                "There is an existing scorecard, so update it",
                res.data
              );
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
                  const existingIndicators = existingProgram.indicators;

                  // Find the index of the indicator, if it already exists
                  const indicatorIndex = existingIndicators.findIndex(
                    (indicator) =>
                      indicator.description === indicatorRef.current.value
                  );

                  const existingIndicatorData = existingIndicators.find(
                    (indicator) =>
                      indicator.description === indicatorRef.current.value
                  );
                  console.log(existingIndicatorData);

                  if (existingIndicatorData) {
                    existingIndicatorData.perfomanceComment =
                      perfomanceCommentRef.current.value;

                    // Initialize the evidenceFileIds array if it doesn't exist
                    if (!existingIndicatorData.evidenceFileIds) {
                      existingIndicatorData.evidenceFileIds = [];
                    }

                    // Push the new evidenceInfo into the evidenceFileIds array
                    // existingIndicatorData.evidenceFileIds.push(evidenceInfo);
                    if (existingIndicatorData) {
                      // Push the evidenceInfo object into the existingIndicatorData object
                      existingIndicatorData.evidenceFileIds.push(evidenceInfo);
                    } else {
                      // The existingIndicatorData object doesn't exist, so create a new object and push the evidenceInfo object into it
                      const newExistingIndicatorData = {
                        ...newIndicatorData,
                        evidenceFileIds: [evidenceInfo],
                      };
                      existingIndicatorData.evidenceFileIds.push(
                        newExistingIndicatorData
                      );
                      // existingIndicators.push(newExistingIndicatorData);
                    }

                    // Replace the existing indicator with the updated indicator
                    existingIndicators[indicatorIndex] = existingIndicatorData;
                    existingProgram.indicators = existingIndicators;

                    // Update the existing performance area with the updated program
                    existingPerformanceArea.programs[
                      programIndex
                    ] = existingProgram;

                    // Update the existing areas of performance with the updated performance area
                    existingAreasOfPerformance[
                      existingAreasOfPerformance.indexOf(
                        existingPerformanceArea
                      )
                    ] = existingPerformanceArea;

                    // Update the scorecard with the updated areas of performance
                    const updatedScorecard = {
                      ...scorecard.content[0],
                      areasOfPerformance: existingAreasOfPerformance,
                    };

                    // Send the updated scorecard to the server
                    try {
                      axiosClient
                        .put(
                          `/scorecard/updateScorecard/${scorecardId}`,
                          updatedScorecard
                        )
                        .then((res) => {
                          console.log("Status code:", res.status);
                          if (res.status === 200) {
                            swal({
                              text: "Indicator info Saved Successfully",
                              icon: "success",
                              button: "OK!",
                            });
                             navigate("/view_Workingscorecard");
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } catch (error) {
                      console.log("An error occurred:", error);
                    }
                  } else {
                    // Indicator doesn't exist, add it to the indicators array
                    console.log("Indicator doesn't exist");
                    newIndicatorData.evidenceFileIds = [evidenceInfo];
                    existingIndicators.push(newIndicatorData);
                  }
                } else {
                  console.log("Program doesn't exist");
                }
              } else {
                setMessage("Selected Performance not found");
              }
            } else {
              console.log("You Have No Scorecard");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error handling file upload:", error);
      }
    }
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 1 }}>
          <strong> ADD MORE INDICATOR DETAILS</strong>
        </Typography>
      </Paper>

      <div style={{ position: "absolute", top: 60, right: 20 }}>
        <ArticleIcon
          sx={{
            color: "#309366",
          }}
        />{" "}
        INSTRUCTIONS
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "210px",
        }}
      >
        <div>
          <Paper
            variant="outlined"
            sx={{
              mt: 4,
              ml: 10,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            <h4>Add More Indicator Details </h4>

            <form style={{ width: "550px" }}>
              <div
                style={{
                  display: "flex",
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
                  display: "flex",
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
                  display: "flex",
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

              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "180px" }}>
                  Actual Performance(%):{" "}
                </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Weight"
                  onClick={handleInputClick}
                  ref={actual_perfomanceRef}
                />
              </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ textAlign: "left", width: "180px" }}>
                  Comment on Indicator:{" "}
                </label>
                <textarea
                  defaultValue={
                    selectedIndicatorData &&
                    selectedIndicatorData.perfomanceComment
                  }
                  className="input2 animate__animated animate__bounceIn textarea-width"
                  placeholder="Comment"
                  onClick={handleInputClick}
                  ref={perfomanceCommentRef}
                ></textarea>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div>
                  <input type="file" onChange={handleFileSelect} />

                  <div className="btn-addPillar" style={{ marginTop: "-20px" }}>
                    <button
                      onClick={handleSubmitIndicators}
                      className="pillar-btn"
                      style={{ borderRadius: "25px" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                
              </div> 
              <p>Selected File: {fileName}</p>*/}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",

                  cursor: "pointer",
                }}
              >
                {/* <AttachFile id="fileInput" />
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Attach Evidence:{" "}
                </label> */}
                <Stack direction="row" alignItems="left" spacing={1}>
                  <Input
                    id="fileInput"
                    type="file"
                    sx={{
                      display: "none",
                    }}
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="fileInput"
                    style={{
                      cursor: "pointer",
                      marginLeft: "-14px",
                      width: "180px",
                    }}
                  >
                    <IconButton component="span" color="success">
                      <AttachFile />
                    </IconButton>
                    Attach Evidence
                  </label>
                </Stack>
                {/* <input
                  type="file"
                
                  onChange={handleFileSelect}
                /> */}
              </div>
              <p>Selected File: {fileName}</p>
              <div
                className="btn-addPillar"
                style={{ marginTop: "-20px", marginLeft: "50px" }}
              >
                <button
                  onClick={handleSubmitIndicators}
                  className="pillar-btn"
                  style={{ borderRadius: "25px" }}
                >
                  Add
                </button>
              </div>
              {message && (
                <div className="alert alert-danger">
                  <p>{message}</p>
                </div>
              )}
            </form>
          </Paper>
          <div
            style={{
              marginLeft: 100,
              marginTop: 50,
              display: "flex",
              textAlign: "center",
            }}
          >
            <div style={{ marginRight: 20 }}>
              <Typography className="" sx={{ fontSize: 15 }}>
                <strong>
                  Current Year Of Assessment:{" "}
                  <span style={{ color: "#309366" }}>{evaluationPeriod}</span>
                </strong>
              </Typography>
            </div>
            <div>
              <Typography className="" sx={{ fontSize: 15 }}>
                <strong>
                  Current Quarter Ends In:{" "}
                  <span style={{ color: "#f44336" }}>{daysRemaining} days</span>
                </strong>
              </Typography>
            </div>
          </div>
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

export default WorkingScoreCard;
