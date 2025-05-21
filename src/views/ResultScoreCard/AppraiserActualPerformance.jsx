import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import queryString from "query-string";

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

const AppraiserActualPerfromance = () => {
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
  const [currentAppraiseeName, setCurrentAppraiseeName] = useState(null);

  const [totalPerformanceScore, setTotalPerformanceScore] = useState(null);
  const [overallAgreedScore, setOverallAgreedScore] = useState(null);


  const [fileName, setFileName] = useState("");
  const [evidenceAttached, setEvidenceAttached] = useState(null);

  const [score, setScore] = useState(null);
  const [agreedWeightedScore, setAgreedWeightedScore] = useState(null);
  const [scoringKey, setScoringKey] = useState("");

  const handleInputKeyUp = () => {
    const quarterlyTarget = selectedIndicatorData.quarterly_target;
    const allowableVariance = selectedIndicatorData.allowable_variance;
    const incrementalDecremental =
      selectedIndicatorData.incremental_or_decremental;
    const indicatorWeight = selectedIndicatorData.weight;
    const actualPerformance = actual_perfomanceRef.current.value;

    var aws = 0;

    if (incrementalDecremental === "Incremental") {
      if (actualPerformance === "") {
        setScore(0);
      } else if (actualPerformance === "0") {
        setScore(1);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Nothing was accomplished");
        setIncrementalOrDecremental("Incremental");
      } else if (actualPerformance === quarterlyTarget.toString()) {
        setScore(4);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Met all agreed set targets");
        setIncrementalOrDecremental("Incremental");
      } else if (
        actualPerformance > quarterlyTarget &&
        actualPerformance <= quarterlyTarget + allowableVariance
      ) {
        setScore(5);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance above set targets -  but within variance");
        setIncrementalOrDecremental("Incremental");
      } else if (actualPerformance > quarterlyTarget + allowableVariance) {
        setScore(6);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Clearly exceeds set targets - but beyond variance");
        setIncrementalOrDecremental("Incremental");
      } else if (
        actualPerformance < quarterlyTarget &&
        actualPerformance >= quarterlyTarget - allowableVariance
      ) {
        setScore(3);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance below set targets - but within variance");
        setIncrementalOrDecremental("Incremental");
      } else if (actualPerformance < quarterlyTarget - allowableVariance) {
        setScore(2);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance below set targets - but below variance");
        setIncrementalOrDecremental("Incremental");
      }
    } else if (incrementalDecremental === "Decremental") {
      if (actualPerformance === "") {
        setScore(0);
      } else if (actualPerformance > "100") {
        setScore(1);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Nothing was accomplished");
        setIncrementalOrDecremental("Decremental");
      } else if (actualPerformance === quarterlyTarget.toString()) {
        setScore(4);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Met all agreed set targets");
        setIncrementalOrDecremental("Decremental");
      } else if (
        actualPerformance > quarterlyTarget &&
        actualPerformance <= quarterlyTarget + allowableVariance
      ) {
        setScore(3);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance below set targets - but within variance");
        setIncrementalOrDecremental("Decremental");
      } else if (actualPerformance > quarterlyTarget + allowableVariance) {
        setScore(2);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance below set targets - but below variance");
        setIncrementalOrDecremental("Decremental");
      } else if (
        actualPerformance < quarterlyTarget &&
        actualPerformance >= quarterlyTarget - allowableVariance
      ) {
        setScore(5);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Performance above set targets -  but within variance");
        setIncrementalOrDecremental("Decremental");
      } else if (actualPerformance < quarterlyTarget - allowableVariance) {
        setScore(6);
        setAgreedWeightedScore((score * indicatorWeight) / 100);
        setScoringKey("Clearly exceeds set targets - but beyond variance");
        setIncrementalOrDecremental("Decremental");
      }
      // aws = score*indicatorWeight;
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
          selectedAppraisee,
          totalAgreedScorePerformances,
          overallAgreedScorePerformances,
        } = location.state || {};

        console.log(indicator);
        console.log(program);
        console.log(area);

        setCurrentAppraiseeName(selectedAppraisee);
        setSelectedIndicatorData(indicator);
        setCurrentProgramData(program);
        setCurrentPerformanceData(area);
        setTotalPerformanceScore(totalAgreedScorePerformances);
        setOverallAgreedScore(overallAgreedScorePerformances);
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

          const areasOfPerformance =
            response.data.content[0].areasOfPerformance;

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
      // const selectedPerformanceAreaRef = workplanData.areasOfPerformance?.find(
      //   (area) => area.performanceArea === selectedPerfomance
      // );
      const selectedPerformanceAreaRef =
        workplanData && workplanData.areasOfPerformance
          ? workplanData.areasOfPerformance.find(
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
    performanceAreas.find((area) => area && area.id === selectedPerformance);

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
      if (isNaN(weight) || weight < 1 || weight > 100) {
        setMessage("Please enter a valid weight between 1 and 100.");
      }
    }

    const updatedPerformanceArea =
      performanceAreas &&
      performanceAreas.find(
        (area) => area.performanceArea === performanceRef.current.value
      );

    console.log(updatedPerformanceArea);

    const newIndicatorData = {
      appraisor_actual_perfomance: actual_perfomanceRef.current.value,
      agreedWeightedScore: agreedWeightedScore,
      appraiseeScore: score,
    };
    console.log(newIndicatorData);

    const newPerformanceArea = { ...updatedPerformanceArea };

    axiosClient
      .get("/scorecard/searchScorecard", {
        params: {
          period: evaluationPeriod,
          username: currentAppraiseeName,
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
          console.log(outcomeRef.current.value);

          if (existingPerformanceArea) {
            // Performance area already exists, find the existing program
            const existingProgram = existingPerformanceArea.programs.find(
              (program) => program.name === outcomeRef.current.value
            );
            const programIndex = existingPerformanceArea.programs.findIndex(
              (program) => program.name === outcomeRef.current.value
            );

            console.log(existingProgram);

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

                console.log("updatedScorecard", updatedScorecard);

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
                          text: "Actual Performance Added Successfully",
                          icon: "success",
                          button: "OK!",
                        });
                        const parsedWorkplanData = JSON.parse(
                          JSON.stringify(updatedScorecard)
                        );
                        const encodedWorkplanData = encodeURIComponent(
                          JSON.stringify(parsedWorkplanData)
                        );

                        const queryParams = queryString.stringify({
                          username: currentAppraiseeName,
                          workplanData: encodedWorkplanData,
                        });
                        const workplanUrl = `/selected-pending-approval-results-scorecard?${queryParams}`;
                        navigate(workplanUrl);
                        // navigate(`/selected-pending-approval-results-scorecard?username=${currentAppraiseeName}`);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } catch (error) {
                  console.log("An error occurred:", error);
                }
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
          width: "430px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        <Typography variant="body2" sx={{ textAlign: "center", ml: 4, p: 1 }}>
          <strong>
            {" "}
            UPDATE ACTUAL PERFORMANCE FOR: {currentAppraiseeName}
          </strong>
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
            <h4>Update Appraisee's Actual Performance For The Indicator </h4>

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

              <div
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
                  Score:
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
              </div>
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

export default AppraiserActualPerfromance;
