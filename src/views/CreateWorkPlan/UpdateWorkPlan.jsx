import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const UpdateWorkPlan = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const sectionRef = useRef(null);
  const weightRef = useRef(null);
  const indicatorRef = useRef(null);
  const outcomeRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);
  const prevPerformanceRef = useRef(null);
  const annualTargetRef = useRef(null);
  const varianceRef = useRef(null);
  const targetRef = useRef(null);

  const location = useLocation();

  const { userName, setUserName, userType, setUserType } = useStateContext();

  const [performances, setPerformances] = useState([]);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const [performanceAreas, setPerformanceAreas] = useState([]);

  const [selectedPerfomance, setSelectedPerfomance] = useState("");

  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");

  const [selectedProgram, setSelectedProgram] = useState("");

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

  const [currentIndicatorData, setCurrentIndicatorData] = useState(null);

  const [currentPerformanceData, setCurrentPerformanceData] = useState(null);

  const [sumOfIndicators, setSumOfIndicators] = useState(null);

  const [currentProgramWeight, setCurrentProgramWeight] = useState(null);

  const [selectedMeasurement, setSelectedMeasurement] = useState(
    currentIndicatorData && currentIndicatorData.measurement_unit
  );

  const [currentPlanStatus, setCurrentPlanStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);

        setProfileData(response.data);

        setResources(response.data.appraisees);

        console.log("My Appraiser resource", resources);

        console.log("My Appraiser profile");

        console.log("Current Measurement unit: ", selectedMeasurement);
        console.log(response.data);

        const {
          indicator,
          program,
          area,
          programWeight,
          totalIndicatorWeight,
          planStatus,
        } = location.state || {};

        console.log("Indicator Data: ", indicator);

        setCurrentIndicatorData(indicator);
        console.log(
          "Current Measurement Unit: ",
          currentIndicatorData && currentIndicatorData.measurement_unit
        );

        setCurrentProgramData(program);

        setCurrentPlanStatus(planStatus);

        setCurrentPerformanceData(area);

        setSumOfIndicators(totalIndicatorWeight);

        setCurrentProgramWeight(programWeight);
      } catch (error) {
        setError(error.message);

        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

  useEffect(() => {
    console.log(currentIndicatorData);
    if (currentIndicatorData) {
      console.log(currentIndicatorData.measurement_unit);
    }
  }, [currentIndicatorData]);
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

  // const handleResourceChange = (event) => {
  //   const selectedOptions = Array.from(event.target.options)
  //     .filter((option) => option.selected)
  //     .map((option) => option.value);
  //   setSelectedResources(selectedOptions);
  // };

  const handleProgramChange = async (event) => {
    if (event && event.target) {
      setSelectedProgram(event.target.value);
      console.log("Selected program:", event.target.value);
    }
    setIsProgramSelected(true);
    // Calculate the total indicator weight for the selected program
    const updatedPerformanceArea = performanceAreas.find(
      (area) => area.performanceArea === selectedPerfomance
    );
    if (updatedPerformanceArea) {
      const selectedProgramData = updatedPerformanceArea.programs.find(
        (program) => program.name === selectedProgram
      );
      if (selectedProgramData) {
        const indicators = selectedProgramData.indicators || [];
        const totalWeight = indicators.reduce((sum, indicator) => {
          return sum + parseFloat(indicator.weight);
        }, 0);
        setTotalIndicatorWeight(totalWeight);
      } else {
        setTotalIndicatorWeight(0);
      }
    }
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
      ////////////////////////////////////////////////////////////////////////////////////////////////
      const selectedPerformanceArea = performanceAreas.find(
        (area) => area.performanceArea === selectedPerfomance
      );

      // Find the program with the selected program name
      const myselectedProgram = selectedPerformanceArea?.programs.find(
        (program) => program.programName === event.target.value
      );

      console.log("My Selected program weight:", myselectedProgram.weight);
      setProgramWeight(myselectedProgram.weight);
      ////////////////////////////////////////////////////////////////////////////////////////////////
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
      }
      setTotalIndicatorWeight(totalWeight);
      console.log("Total Indicators Weight:", totalWeight);
      ////////////////////////////////////////////////////////////////////////////////////////////////

      const difference =
        parseInt(myselectedProgram.weight, 10) - parseInt(totalWeight, 10);
      console.log(
        "programWeight:",
        myselectedProgram.weight,
        "totalIndicatorWeight:",
        totalWeight
      );
      setWeightDifference(difference);
      console.log("setWeightDifference:", weightDifference);
    } catch (error) {
      console.log(error);
    }
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

  const performanceArea = performanceAreas.find(
    (area) => area.id === selectedPerfomance
  );

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleUpdate = async (e, outcome, myWeight) => {
    e.preventDefault();

    // const programName = selectedProgram.programName;
    // const weight = selectedProgram.weight;

    console.log("index", programIndex);

    // Update the selected program in the selected performance area
    // const updatedPerformanceArea = { ...selectedPerfomanceArea };
    // updatedPerformanceArea.programs[programIndex] = {
    //   ...updatedPerformanceArea.programs[programIndex],
    //   programName: outcome,
    //   weight: myWeight,
    // };

    const updatedPerformance = {
      ...selectedPerfomanceArea,

      programs: selectedPerfomanceArea.programs.map((program, index) => {
        if (index === programIndex) {
          return {
            ...program,
            programName: outcome,
            weight: myWeight,
          };
          console.log("program");
        }
        return program;
      }),
    };
    // Assign the updated `programs` array back to `selectedPerfomanceArea`
    const updatedSelectedPerformanceArea = {
      ...selectedPerfomanceArea,
      programs: updatedPerformance.programs,
    };
    console.log("Updated programs:", updatedSelectedPerformanceArea);

    try {
      const response = await axiosClient.post(
        `/Performance_Area/update/${id}`,
        updatedSelectedPerformanceArea
      );
      console.log(response.data);
      swal({
        text: response.data,
        icon: "success",
        button: "OK!",
      }).then(() => {
        // window.location.replace("/admin/addOutcomes");
      });

      setPerformances((prevData) =>
        prevData.map((area) =>
          area.id === id ? { ...area, updated: true } : area
        )
      );
    } catch (error) {
      console.log(error.message);
      swal({
        text: error.message,
        icon: "error",
        button: "OK!",
      });
      console.log("Failed to update program.");
    }
  };
  const handleDelete = (program, weight) => {
    axiosClient
      .post(`/Performance_Area/deletePrograms/${program}`, {
        programName: program,
        weight: weight,
      })
      .then((response) => {
        console.log(response.data);
        console.log(program);
        if (response && response.status === 200) {
          setPerformances((prevData) =>
            prevData.filter((area) => area.id !== id)
          );
          swal({
            text: response.data,
            icon: "success",
            button: "OK!",
          });
          window.location.replace("/admin/addOutcomes");
        } else {
          setMessage("Failed to delete Program");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete a program.");
      });
  };

  const handleUpdateIndicators = (e) => {
    e.preventDefault();

    console.log(currentIndicatorData.measurement_unit);

    const defaultMeasurementUnit = currentIndicatorData
      ? currentIndicatorData.measurement_unit
      : "";
    let finalIndicatorsWeight = currentProgramWeight - sumOfIndicators;

    if (
      weightRef.current.value > currentProgramWeight ||
      (sumOfIndicators !== 0 && weightRef.current.value > finalIndicatorsWeight)
    ) {
      if (weightRef.current.value > sumOfIndicators) {
        setMessage(
          "Indicator weight must be equal to and not greater than " +
            currentProgramWeight +
            "%"
        );
      } else {
        setMessage(
          "Indicator weight must be equal to or less than " +
            finalIndicatorsWeight +
            "%"
        );
      }
      return;
    }
    if (!weightRef.current.value) {
      setMessage("Percentage Weight is required.");
      return;
    }

    const updatedPerformanceArea = performanceAreas.find(
      (area) => area.performanceArea === currentPerformanceData.performanceArea
    );

    console.log(updatedPerformanceArea);

    console.log("selectedResources", selectedResources);

    const newIndicatorData = {
      description: indicatorRef.current.value,
      measurement_unit: selectedMeasurement || defaultMeasurementUnit,
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
          // There is an existing scorecard, so update it
          console.log("There is an existing scorecard, so update it", res.data);
          console.log("My ID: " + res.data.content[0].id);
          const workplanId = res.data.content[0].id;

          const existingAreasOfPerformance =
            res.data.content[0].areasOfPerformance || [];
          console.log("My Areas: ");
          console.log(res.data.content[0].areasOfPerformance);

          // Find the existing performance area
          const existingPerformanceArea = existingAreasOfPerformance.find(
            (area) =>
              area.performanceArea === currentPerformanceData.performanceArea
          );

          if (existingPerformanceArea) {
            // Performance area already exists, find the existing program
            const existingProgram = existingPerformanceArea.programs.find(
              (program) => program.name === currentProgramData.name
            );

            if (existingProgram) {
              // Program already exists, update its indicators array
              const existingIndicators = existingProgram.indicators;

              // Find the index of the indicator, if it already exists
              const indicatorIndex = existingIndicators.findIndex(
                (indicator) =>
                  indicator.description === currentIndicatorData.description
              );

              const existingIndicatorData = existingIndicators.find(
                (indicator) =>
                  indicator.description === currentIndicatorData.description
              );
              console.log(existingIndicatorData);

              if (existingIndicatorData) {
                existingIndicatorData.description = indicatorRef.current.value;

                if (selectedMeasurement) {
                  existingIndicatorData.measurement_unit = selectedMeasurement;
                } else {
                  existingIndicatorData.measurement_unit =
                    currentIndicatorData.measurement_unit;
                }

                if (selectedIncrementDecrement) {
                  existingIndicatorData.incremental_or_decremental = selectedIncrementDecrement;
                } else {
                  existingIndicatorData.incremental_or_decremental =
                    currentIndicatorData.incremental_or_decremental;
                }

                existingIndicatorData.weight = weightRef.current.value;

                existingIndicatorData.quarterly_target =
                  targetRef.current.value;

                existingIndicatorData.annual_target =
                  annualTargetRef.current.value;

                existingIndicatorData.allowable_variance =
                  varianceRef.current.value;

                if (selectedDivision) {
                  existingIndicatorData.responsibleDivision = selectedDivision;
                } else {
                  existingIndicatorData.responsibleDivision =
                    currentIndicatorData.responsibleDivision;
                }

                if (selectedSection) {
                  existingIndicatorData.responsibleSection = selectedSection;
                } else {
                  existingIndicatorData.responsibleSection =
                    currentIndicatorData.responsibleSection;
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
                  existingAreasOfPerformance.indexOf(existingPerformanceArea)
                ] = existingPerformanceArea;

                // Update the scorecard with the updated areas of performance
                const updatedWorkplan = {
                  ...workplan.content[0],
                  areasOfPerformance: existingAreasOfPerformance,
                };

                // Send the updated Workplan to the server
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
                          text: "Indicator info Saved Successfully",
                          icon: "success",
                          button: "OK!",
                        });
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
                // Indicator doesn't exist, add it to the indicators array
                console.log("Indicator doesn't exist");
              }
            } else {
              console.log("Program doesn't exist");
            }
          }
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 12, p: 1 }}>
          <strong> UPDATE YOUR WORKPLAN</strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 340, marginTop: 10, display: "flex" }}>
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
            <h4>Modify Indicator Details </h4>

            <form onSubmit={handleUpdateIndicators} style={{ width: "550px" }}>
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
                  defaultValue={
                    currentIndicatorData && currentIndicatorData.description
                  }
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
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
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.incremental_or_decremental
                  }
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedIncrementDecrement}
                  onChange={handleIncrementChange}
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={
                      currentIndicatorData &&
                      currentIndicatorData.incremental_or_decremental
                    }
                  >
                    {currentIndicatorData &&
                      currentIndicatorData.incremental_or_decremental}
                  </option>
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
                  defaultValue={
                    currentIndicatorData && currentIndicatorData.weight
                  }
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
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.measurement_unit
                  }
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedMeasurement}
                  onChange={handleMeasurementChange}
                  placeholder="Measurement Unit"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={
                      currentIndicatorData &&
                      currentIndicatorData.measurement_unit
                    }
                  >
                    {currentIndicatorData &&
                      currentIndicatorData.measurement_unit}
                  </option>
                  <option value="%">%</option>
                  <option value="$">$</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Other">Other</option>
                </select>
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
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.responsibleDivision
                  }
                  className="input2"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  placeholder="Select a division…"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">
                    {currentIndicatorData &&
                      currentIndicatorData.responsibleDivision}
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
                    currentIndicatorData &&
                    currentIndicatorData.responsibleSection
                  }
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
                  <option value="">
                    {currentIndicatorData &&
                      currentIndicatorData.responsibleSection}
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

              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Responsible person: </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder=" Name"
                  onClick={handleInputClick}
                  ref={indicatorRef}
                />
              </div> */}

              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Previous Performance(%): </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Performance"
                  onClick={handleInputClick}
                  ref={prevPerformanceRef}
                />
              </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label> Annual Target for 2023(%): </label>
                <input
                  defaultValue={
                    currentIndicatorData && currentIndicatorData.annual_target
                  }
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
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.allowable_variance
                  }
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
                <label> Target for 2023: </label>
                <input
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.quarterly_target
                  }
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
                  defaultValue={
                    currentIndicatorData &&
                    currentIndicatorData.responsibleResources
                  }
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
              {/* <label>Responsible Person: </label> */}
              {/* <select
                  className="input2"
                  value={selectedResources}
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
                  
                    defaultValue="John Doe"
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
                  Update
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
          <div
            style={{
              width: "400px",
              marginLeft: "110px",
              marginTop: "10px",
            }}
          >
            <Typography>
              <>
                Total Weight of Indicators <strong>used</strong>:{" "}
                <strong style={{ color: "#f44336" }}>{sumOfIndicators}%</strong>
                <Typography>
                  <strong> Unused</strong> Percentage Weight:{" "}
                  <strong style={{ color: "#309366" }}>
                    {currentProgramWeight - sumOfIndicators}%
                  </strong>
                </Typography>
              </>
            </Typography>
          </div>
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
                      Unsed Percentage Weight:{" "}
                      <strong style={{ color: "#f44336" }}>
                        {weightDifference}%
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

export default UpdateWorkPlan;
