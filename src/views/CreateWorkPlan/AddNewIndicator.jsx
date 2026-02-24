import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";
// import Select from "@mui/material/Select";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
// import { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AssessmentIcon from "@mui/icons-material/Assessment";
import IconButton from "@mui/material/IconButton";
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
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ITEM_HEIGHT = 89;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

function getStyles(name, pillarName, theme) {
  return {
    fontWeight:
      pillarName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const animatedComponents = makeAnimated();

const AddNewIndicator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const sectionRef = useRef();
  const weightRef = useRef(null);
  const indicatorRef = useRef(null);
  const outcomeRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);
  const prevPerformanceRef = useRef(null);
  const annualTargetRef = useRef(null);
  const varianceRef = useRef(null);
  const targetRef = useRef(null);

  const { userName, setUserName, userType, setUserType } = useStateContext();

  const [performances, setPerformances] = useState([]);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const [selectedPerfomance, setSelectedPerfomance] = useState("");

  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");

  const [selectedProgram, setSelectedProgram] = useState("");

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
  const [selectedIncrementDecrement, setSelectedIncrementDecrement] = useState(
    ""
  );
  const [selectedSection, setSelectedSection] = useState("");

  const [selectedResources, setSelectedResources] = useState([]);

  const [resources, setResources] = useState([]);

  const [weightDifference, setWeightDifference] = useState(0);

  const [isPerformanceAreaSelected, setIsPerformanceAreaSelected] = useState(
    false
  );

  const [currentProgramData, setCurrentProgramData] = useState(null);
  const [currentPerformanceData, setCurrentPerformanceData] = useState(null);

  const [performanceAreas, setPerformanceAreas] = useState([]);

  const [sumOfIndicators, setSumOfIndicators] = useState(null);

  const [currentProgramWeight, setCurrentProgramWeight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
        setProfileData(response.data);
        setResources(response.data.appraisees);
        console.log("My Appraiser resource", resources);
        console.log("My Appraiser profile");
        console.log(response.data);

        const { program, area, programWeight, totalIndicatorWeight } =
          location.state || {};

        console.log(program);

        console.log(area);

        setCurrentProgramData(program);

        setCurrentPerformanceData(area);

        setSumOfIndicators(totalIndicatorWeight);

        setCurrentProgramWeight(programWeight);

        console.log(evaluationPeriod, daysRemaining);
      } catch (error) {
        setError(error.message);

        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

  useEffect(() => {
    // const evaluationPeriod = "2023-Q3";
    // axiosClient
    //   .get("/workplan/searchWorkplan", {
    //     params: {
    //       period: evaluationPeriod,
    //       username: userName,
    //     },
    //   })
    //   .then((res) => {
    //     const myWorkPlanData = res.data;
    //     const areasOfPerformanceData =
    //         res.data.content[0].areasOfPerformance || [];
    //       console.log("My Areas Passed: ");
    //       console.log(res.data.content[0].areasOfPerformance);
    //       setPerformanceAreas(res.data.content[0].areasOfPerformance || []);
    //       console.log(performanceAreas);
    //   });
    // const urlParams = new URLSearchParams(window.location.search);
    // const PerformancesParsed = urlParams.get("performancesData");
    // const decodedPerformcesData = JSON.parse(
    //   decodeURIComponent(PerformancesParsed)
    // );
    // console.log(decodedPerformcesData);
    // setPerformanceAreas(decodedPerformcesData);
    // console.log(performanceAreas);
  }, []);

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

  const handlePerformanceClick = (area, index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Performance clicked", area);
    setSelectedPerfomanceArea(area);
    console.log("Performance", index);

    setIsPerformanceAreaSelected(true);
  };

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
  // const handleResourceChange = (event) => {
  //   setSelectedResource(event.target.value);
  // };

  const handleResourceChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedResources(selectedOptions);
    console.log(`Selected options: ${selectedOptions}`);
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
  const handleIncrementChange = (event) => {
    if (event && event.target) {
      setSelectedIncrementDecrement(event.target.value);
    }
  };

  const handleOtherMeasurementChange = (event) => {
    setOtherMeasurement(event.target.value);
  };
  const { performanceAreasParsed } = location.state || {};
  const performanceArea =
    performanceAreas &&
    performanceAreas.find((area) => area && area.id === selectedPerfomance);

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleSubmitIndicators = (e) => {
    e.preventDefault();

   
    axiosClient
      .get("/workplan/searchWorkplan", {
        params: {
          period: evaluationPeriod,
          username: userName,
        },
      })
      .then((res) => {
        const myWorkPlanData = res.data;
        const areasOfPerformanceData =
          res.data.content[0]?.areasOfPerformance || [];
          console.log(areasOfPerformanceData);

        if (areasOfPerformanceData.length === 0) {
          console.log("No workplan present");
          // Display a message or take appropriate action when no workplan is present
        } else {
          console.log("My Areas Passed: ");
          console.log(areasOfPerformanceData);
          setPerformanceAreas(areasOfPerformanceData);
          console.log(performanceAreas);

          setSelectedPerfomanceArea(currentPerformanceData.performanceArea);
          setSelectedProgram(currentProgramData.name);

          // if (selectedPerfomance === "") {
          //   setMessage("Please select a performance");
          //   return;
          // }
          // if (selectedProgram === "") {
          //   setMessage("Please select a program");
          //   return;
          // }
          let finalIndicatorsWeight = currentProgramWeight - sumOfIndicators;

          if (weightRef.current.value > finalIndicatorsWeight) {
            setMessage(
              "Indicator weight must be equal to and not greater than" +
                finalIndicatorsWeight +
                "%"
            );
            return;
          }
          if (!weightRef.current.value) {
            setMessage("Percentage Weight is required.");
            return;
          }

          if (indicatorRef.current.value === "") {
            setMessage("Please enter an Indicator name");
            return;
          }

          if (selectedMeasurement === "") {
            setMessage("Please enter a Measurement");
            return;
          }
          if (selectedDivision === "") {
            setMessage("Please enter a division");
            return;
          }
          if (prevPerformanceRef === "") {
            setMessage("Please enter previous performance");
            return;
          }
          if (annualTargetRef.current.value === "") {
            setMessage("Please enter Annaual target");
            return;
          } else {
            const weight = parseFloat(weightRef.current.value);
            if (isNaN(weight) || weight < 1 || weight > 100) {
              setMessage("Please enter a valid target between 1 and 100.");
            }
          }
          if (varianceRef.current.value === "") {
            setMessage("Please enter a variance");
            return;
          }
          if (targetRef.current.value === "") {
            setMessage("Please enter current year target");
            return;
          } else {
            const weight = parseFloat(weightRef.current.value);
            if (isNaN(weight) || weight < 1 || weight > 100) {
              setMessage(
                "Please enter a valid current target between 1 and 100."
              );
            }
          }
          console.log(areasOfPerformanceData);
          const updatedPerformanceArea =
            areasOfPerformanceData &&
            areasOfPerformanceData.find(
              (area) =>
                area &&
                area.performanceArea === currentPerformanceData.performanceArea
            );

          console.log(updatedPerformanceArea);

          console.log("selectedResources", selectedResources);

          const newIndicatorData = {
            description: indicatorRef.current.value,
            measurement_unit: selectedMeasurement,
            weight: weightRef.current.value,
            annual_target: annualTargetRef.current.value,
            incremental_or_decremental: selectedIncrementDecrement,
            previous_year_Perfomenace: "0",
            quarterly_target: targetRef.current.value,
            responsibleDivision: selectedDivision,
            responsibleResources: selectedResources,
            responsibleSection: selectedSection,
            allowable_variance: varianceRef.current.value,
            name: selectedProgram,
          };

          console.log(newIndicatorData);
          console.log(
            updatedPerformanceArea && updatedPerformanceArea.programs
          );
          console.log(updatedPerformanceArea);
          if (
            updatedPerformanceArea !== undefined &&
            updatedPerformanceArea.programs !== undefined &&
            Array.isArray(updatedPerformanceArea.programs)
          ) {
            const programIndex = updatedPerformanceArea.programs.findIndex(
              (program) =>
                program.programName === currentPerformanceData.performanceArea
            );
            if (programIndex !== -1) {
              if (!updatedPerformanceArea.programs[programIndex].indicators) {
                updatedPerformanceArea.programs[programIndex].indicators = [];
              }
              updatedPerformanceArea.programs[programIndex].indicators.push(
                newIndicatorData
              );
            } else {
              // Create a new program and add it to the programs array
              console.log("Program does not exist");
              // const newProgram = {
              //   name: selectedProgram,
              //   weight: programWeight,
              //   indicators: [newIndicatorData],
              // };
              // updatedPerformanceArea.programs.push(newProgram);
            }
          } else {
            setMessage("The programs array is null or not an array");
          }

          const newPerformanceArea = { ...updatedPerformanceArea };

          axiosClient
            .get("/workplan/searchWorkplan", {
              params: {
                period: evaluationPeriod,
                username: userName,
              },
            })
            .then((res) => {
              const workplan = res.data;
              if (workplan.content && workplan.content.length > 0) {
                // There is an existing workplan, so update it
                console.log(
                  "There is an existing workplan, so update it",
                  res.data
                );
                console.log("My ID: " + res.data.content[0].id);
                const workplanId = res.data.content[0].id;

                const existingAreasOfPerformance =
                  res.data.content[0].areasOfPerformance || [];
                console.log("My Areas: ");
                console.log(res.data.content[0].areasOfPerformance);

                // Find the existing performance area
                const existingPerformanceArea = existingAreasOfPerformance.find(
                  (area) =>
                    area &&
                    area.performanceArea ===
                      currentPerformanceData.performanceArea
                );
                console.log(selectedPerfomance);

                if (existingPerformanceArea) {
                  // Performance area already exists, find the existing program
                  const existingProgram = existingPerformanceArea.programs.find(
                    (program) =>
                      program && program.name === currentProgramData.name
                  );

                  if (existingProgram) {
                    // Program already exists, update its indicators array
                    if (!existingProgram.indicators) {
                      existingProgram.indicators = [];
                    }
                    existingProgram.indicators.push(newIndicatorData);
                    console.log(existingProgram);

                    const newWorkplanStatus = "Incomplete";
                    // Performance area doesn't exist, create a new one
                    let newPerformanceArea;
                    if (
                      updatedPerformanceArea !== undefined &&
                      updatedPerformanceArea.section !== undefined
                    ) {
                      newPerformanceArea = {
                        section: updatedPerformanceArea.section,
                        weight: updatedPerformanceArea.weight,

                        programs: [
                          {
                            contributedPillar: null,
                            indicators: [newIndicatorData],
                            name: selectedProgram,
                            weight: programWeight,
                          },
                        ],
                        description: null,
                        performanceArea: selectedPerfomance,
                      };
                      existingAreasOfPerformance.push(newPerformanceArea);
                      const updatedWorkplan = {
                        ...workplan.content[0],
                        areasOfPerformance: existingAreasOfPerformance,
                        workplanStatus: "Incomplete",
                      };

                      console.log("updatedWorkplan", updatedWorkplan);

                      try {
                        axiosClient
                          .put(
                            `/workplan/updateWorkplan/${workplanId}`,
                            updatedWorkplan
                          )
                          .then((res) => {
                            console.log("Status code:", res.status);
                            if (res.status === 200) {
                              swal({
                                text: "Indicator Saved Successfully",
                                icon: "success",
                                button: "OK!",
                              });
                              setPostedData({
                                performance:
                                  currentPerformanceData.performanceArea,
                                program: currentProgramData.name,
                                indicator: indicatorRef.current.value,
                                weight: weightRef.current.value,
                                measurement: selectedMeasurement,
                                division: selectedDivision,
                                prevPerformance: "0",
                                annualTarget: annualTargetRef.current.value,
                                variance: varianceRef.current.value,
                                target: targetRef.current.value,
                              });
                              if (postedData && postedData.division) {
                                console.log(
                                  "Responsible Division:",
                                  postedData.division
                                );
                              }
                              setIsFormSubmitted(true);
                              // Clear form fields after successful submission
                              indicatorRef.current.value = "";
                              weightRef.current.value = "";
                              annualTargetRef.current.value = "";
                              varianceRef.current.value = "";
                              targetRef.current.value = "";
                              // Clear state variables
                              setSelectedMeasurement("");
                              setSelectedDivision("");
                              setSelectedSection("");
                              setSelectedIncrementDecrement("");
                              setSelectedResources([]);
                              setOtherMeasurement("");
                              setMessage("");
                              // Redirect to viewWorkPlan after successful submission
                              navigate("/viewWorkPlan");
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } catch (error) {
                        console.log("An error occurred:", error);
                      }
                    } else {
                      console.log("Section ");
                    }
                  } else {
                    console.log("Program does not exist 2");
                  }
                } else {
                }
              } else {
                const areasOfPerformance = [
                  {
                    section: updatedPerformanceArea.section,
                    weight: updatedPerformanceArea.weight,
                    programs: [
                      {
                        contributedPillar: null,
                        indicators: [newIndicatorData],
                        name: selectedProgram,
                        weight: programWeight,
                      },
                    ],
                    description: null,
                    performanceArea: selectedPerfomance,
                  },
                ];
                const appraiser_email = "tdube1";
                const evaluator_email = "tdube1";
                const user_email = userName;
                const workplanStatus = "Incomplete";

                const data = {
                  appraiser_email,
                  areasOfPerformance,
                  evaluationPeriod,
                  evaluator_email,
                  user_email,
                  workplanStatus,
                };
                axiosClient
                  .post("/workplan/save", data)
                  .then((res) => {
                    console.log(res.data);
                    console.log(
                      "There is no existing workplan, so save a new one"
                    );
                    console.log(res.data);
                    swal({
                      text: "Indicator Saved Successfully",
                      icon: "success",
                      button: "OK!",
                    });
                    setPostedData({
                      performance: selectedPerfomance,
                      program: selectedProgram,
                      indicator: indicatorRef.current.value,
                      weight: weightRef.current.value,
                      measurement: selectedMeasurement,
                      division: selectedDivision,
                      prevPerformance: "0",
                      annualTarget: annualTargetRef.current.value,
                      variance: varianceRef.current.value,
                      target: targetRef.current.value,
                    });
                    setIsFormSubmitted(true);
                    // Clear form fields after successful submission
                    indicatorRef.current.value = "";
                    weightRef.current.value = "";
                    annualTargetRef.current.value = "";
                    varianceRef.current.value = "";
                    targetRef.current.value = "";
                    // Clear state variables
                    setSelectedMeasurement("");
                    setSelectedDivision("");
                    setSelectedSection("");
                    setSelectedIncrementDecrement("");
                    setSelectedResources([]);
                    setOtherMeasurement("");
                    setMessage("");
                    // Redirect to viewWorkPlan after successful submission
                    navigate("/viewWorkPlan");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 1 }}>
          <strong> ADD INDICATORS FOR A PERFORMANCE AREA</strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 330, marginTop: 10, display: "flex" }}>
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
              mt: 1,
              ml: 10,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            <h4>Add Indicator </h4>

            <form onSubmit={handleSubmitIndicators} style={{ width: "550px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>
                  Select a Performance
                </label>
                <input
                  disabled
                  defaultValue={
                    currentPerformanceData &&
                    currentPerformanceData.performanceArea
                  }
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Performance Name"
                  onClick={handleInputClick}
                  // ref={performanceAreaRef}
                  style={{
                    marginLeft: "80px",
                    width: 275,
                    height: "40px",
                    backgroundColor: "#b6aeae",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Enter Program: </label>
                <input
                  disabled
                  defaultValue={currentProgramData && currentProgramData.name}
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Program Name"
                  onClick={handleInputClick}
                  // ref={programRef}
                  style={{
                    marginLeft: "40px",
                    width: 275,
                    height: "40px",
                    backgroundColor: "#b6aeae",
                  }}
                />

                <input
                  style={{ display: "none" }}
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Indicator Name"
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
                <label>Enter Indicator: </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Indicator Name"
                  onClick={handleInputClick}
                  ref={indicatorRef}
                  style={{ height: "30px" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Incremental/Decremental:</label>

                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedIncrementDecrement}
                  onChange={handleIncrementChange}
                  placeholder="Incremental/Decremental"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select Increment/Decrement...</option>
                  <option value="Incremental">Incremental</option>
                  <option value="Decremental">Decremental</option>
                </select>
                <br />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Indicator Weight(%): </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Weight"
                  onClick={handleInputClick}
                  ref={weightRef}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Measurement Unit: </label>

                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedMeasurement}
                  onChange={handleMeasurementChange}
                  placeholder="Measurement Unit"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a Measurement Unit...</option>
                  <option value="%">%</option>
                  <option value="$">$</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Other">Other</option>
                </select>
                <br />
              </div>
              {selectedMeasurement === "Other" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    marginLeft: "200px",
                  }}
                >
                  <input
                    className="input2 animate__animated animate__bounceIn"
                    type="text"
                    placeholder="Enter Measurement Unit"
                    value={otherMeasurement}
                    onChange={handleOtherMeasurementChange}
                    style={{
                      width: 250,
                      backgroundColor: "#f9f6f6",
                      marginTop: 10,
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Responsible Division: </label>
                <select
                  className="input2"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  placeholder="Select a division…"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a division...</option>
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
              {selectedDivisionData && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <label style={{ marginRight: "10px" }}>Section:</label>
                  <select
                    className="input2"
                    value={selectedSection}
                    onChange={handleSectionChange}
                    placeholder="Select a section…"
                    style={{
                      marginLeft: "80px",
                      width: 275,
                      backgroundColor: "#f9f6f6",
                    }}
                  >
                    <option value="">Select a section...</option>
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
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label> Current Annual Target(%):</label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Target"
                  onClick={handleInputClick}
                  ref={annualTargetRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label> Allowable Variance: </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Variance"
                  onClick={handleInputClick}
                  ref={varianceRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>  Current Quater Target(%): </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Current Target"
                  onClick={handleInputClick}
                  ref={targetRef}
                />
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  marginLeft: "40px",
                }}
              >
                <label
                  style={{
                    textAlign: "left",
                    width: "180px",
                    marginLeft: "-38px",
                    marginRight: "60px",
                  }}
                >
                  Responsible Person:{" "}
                </label> */}
              {/* <Select
                  value={selectedResources}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  onChange={(selectedOptions) => setSelectedResources(selectedOptions)}
                  isMulti
                  options={
                    resources &&
                    resources.map((resource,index) => ({
                      value: resource,
                      label: resource,
                    }))
                  }
                  maxWidth={100}
                  sx={{ width: 200, ml: 150 }}
                /> */}
              {/* <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={selectedResources}
                  onChange={handleResourceChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected}
                  MenuProps={MenuProps}
                >
                  {resources &&
                    resources.map((resource)=> (
                    <MenuItem key={resource} value={resource}>
                      <Checkbox checked={selectedResources === resource} />
                      <ListItemText primary={resource} />
                    </MenuItem>
                  ))}
                </Select>
                </FormControl> */}
              {/* <select
                  className="input2"
                  value={selectedResources}
                  onChange={handleResourceChange}
                  placeholder="Select a Person"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                  multiple // Enable multiple selection
                >
                  <option value="">Responsible Person...</option>
                  {resources &&
                    resources.map((resource) => (
                      <option
                        style={{
                          background: "#fff",
                          borderRadius: "3px",
                          padding: "0.5rem",
                        }}
                        key={resource}
                        value={resource}
                      >
                        {resource}
                      </option>
                    ))}
                </select> */}
              {/* <label>Responsible Person: </label>
                <select
                  className="input2"
                  value={selectedResource}
                  onChange={handleResourceChange}
                  placeholder="Select a Person"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Responsible Person...</option>
                  {resources &&
                    resources.map((resource) => (
                      <option key={resource} value={resource}>
                        {resource}
                      </option>
                    ))}
                </select> */}
              {/* </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  marginLeft: "40px",
                }}
              >
                <div style={{ marginLeft: "-38px", marginTop: "10px" }}>
                  <label
                    style={{
                      textAlign: "left",
                      width: "180px",
                      marginLeft: "-2px",
                      marginRight: "60px",
                    }}
                  >
                    Responsible Person:{" "}
                  </label>
                  <Autocomplete
                    options={resources || []}
                    multiple
                    style={{ width: 515, backgroundColor: "#f9f6f6" }}
                    value={selectedResources}
                    onChange={(event, newValue) => {
                      setSelectedResources(newValue);
                    }}
                    defaultValue={[]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="standard"
                        placeholder="Select a Person"
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
              </div>

              <div className="btn-addPillar" style={{ marginTop: "-20px" }}>
                <button className="pillar-btn" style={{ borderRadius: "25px" }}>
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
        </div>
        <div>
          {/* setSumOfIndicators(totalIndicatorWeight);

setCurrentProgramWeight(programWeight); */}
          <div
            style={{
              width: "400px",
              marginLeft: "110px",
              marginTop: "10px",
            }}
          >
            <Typography>
              <>
                Total Weight of Indicators used:{" "}
                <strong style={{ color: "#309366" }}>{sumOfIndicators}%</strong>
                <Typography>
                  Unused Percentage Weight:{" "}
                  <strong style={{ color: "#f44336" }}>
                    {currentProgramWeight - sumOfIndicators}%
                  </strong>
                </Typography>
              </>
            </Typography>
          </div>

          {isFormSubmitted && (
            <>
              <hr style={{ width: "400px", marginLeft: "70px" }} />
              <div className="new-div2" style={{ marginLeft: "190px" }}>
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
                  {/* <Typography variant="caption" color="text.secondary">
                    Previous Performance:{postedData.prevPerformance}
                  </Typography> */}
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
                      onClick={() => handleUpdateDialog(selectedPerfomanceArea.id)}
                    >
                      <ModeEditIcon sx={{ fontSize: "20px", color: "green" }} />
                    </IconButton>
                    <IconButton
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={() => handleDelete(selectedPerfomanceArea.id)}
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

export default AddNewIndicator;
