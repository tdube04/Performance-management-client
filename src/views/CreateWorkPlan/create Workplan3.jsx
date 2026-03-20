import React, { useState, useEffect, useRef } from "react";
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
import IconButton from "@mui/material/IconButton";
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
    currentYear: currentYear,
    daysRemaining: daysRemaining,
  };
};

const CreateWorkPlan = () => {
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

  const { evaluationPeriod, currentYear, daysRemaining } = getCurrentEvaluationPeriod();

  const [performanceAreas, setPerformanceAreas] = useState([]);

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

  const [programWeight, setProgramWeight] = useState(0);

  const [otherMeasurement, setOtherMeasurement] = useState("");

  const [divisions, setDivisions] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState("");

  const [postedData, setPostedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
        console.log("My Appraiser profile");
        console.log(response.data);
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
      try {
        const response = await axiosClient.get("/Performance_Area/allAreas");
        setPerformanceAreas(response.data);
        console.log(performanceAreas);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    console.log(evaluationPeriod, daysRemaining);
  }, []);

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

  const handleProgramChange = (event) => {
    if (event && event.target) {
      setSelectedProgram(event.target.value);
    }
    const selectedPerformanceArea = performanceAreas.find(
      (area) => area.performanceArea === selectedPerfomance
    );

    // Find the program with the selected program name
    const myselectedProgram = selectedPerformanceArea?.programs.find(
      (program) => program.programName === selectedProgram
    );

    // Update the program weight state
    if (myselectedProgram) {
      setProgramWeight(myselectedProgram.weight);
      console.log("weight", programWeight);
    } else {
      setProgramWeight(0);
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

  const handleOtherMeasurementChange = (event) => {
    setOtherMeasurement(event.target.value);
  };

  const handleDivisionChange = (event) => {
    if (event && event.target) {
      setSelectedDivision(event.target.value);
    }
  };

  const performanceArea = performanceAreas.find(
    (area) => area.id === selectedPerfomance
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const outcomeName = outcomeRef.current.value;
    const weight = weightRef.current.value;
    if (outcomeName === "") {
      setMessage("Please enter a outcome name");
      return;
    }
    if (weight === "") {
      setMessage("Please enter a percentage weight");
      return;
    }

    const performanceArea = performanceAreas.find(
      (area) => area.performanceArea === selectedPerfomance
    );

    console.log(performanceArea.weight);

    console.log(performanceArea.id);
    if (!performanceArea) {
      setMessage("Please select a Performance");
      return;
    }
    try {
      const response = await axiosClient.post(
        `Performance_Area/addProgram/${performanceArea.performanceArea}`,
        {
          programName: outcomeName,
          weight: weight,
        }
      );
      if (response.status === 200) {
        swal({
          text: response.data,
          icon: "success",
          button: "OK",
        });
        setPostedData({
          performance: selectedPerfomance,
          program: selectedProgram,
          indicator: indicatorRef.current.value,
          weight: weightRef.current.value,
          measurement: selectedMeasurement,
          division: selectedDivision,
          prevPerformance:prevPerformanceRef.current.value,
          annualTarget:annualTargetRef.current.value,
          variance: varianceRef.current.value,
          target:targetRef.current.value

         
        });
        // window.location.replace("/admin/addOutcomes");
      } else {
        swal({
          text: response.data,
          icon: "error",
          button: "OK",
        });
      }

      // Update the divisions state with the updated division
      // setPerformanceAreas((prevAreas) => {
      //   const updatedAreas = prevAreas.map((area) => {
      //     if (area.id === selectedPerfomance) {
      //       return response.data;
      //     }
      //     return area;
      //   });
      //   return updatedAreas;
      // });
      // console.log("Updated:", updatedAreas);

      outcomeRef.current.value = "";
      weightRef.current.value = "";
    } catch (error) {
      console.log(error);

      swal({
        text: error.response.data,
        icon: "error",
        button: "OK",
      });
    }
  };

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleUpdate = async (e, outcome, myWeight) => {
    e.preventDefault();

    // const programName = selectedProgram.programName;
    // const weight = selectedProgram.weight;
    if (outcome === "") {
      setMessage("Please enter a program name");
      return;
    }
    if (myWeight === "") {
      setMessage("Please enter a percentage weight");
      return;
    }
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
        window.location.replace("/admin/addOutcomes");
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

  const handleSubmitIndicators = (e) => {
    e.preventDefault();

    // const updatedPerformanceArea = { ...selectedPerfomance };

    const updatedPerformanceArea = performanceAreas.find(
      (area) => area.performanceArea === selectedPerfomance
    );

    console.log(updatedPerformanceArea);

    const newIndicatorData = {
      description: indicatorRef.current.value,
      measurement_unit: selectedMeasurement,
      weight: weightRef.current.value,
      name: selectedProgram, // Add programName property with the selected program value
    };

    console.log(newIndicatorData);
    if (
      updatedPerformanceArea.programs &&
      Array.isArray(updatedPerformanceArea.programs)
    ) {
      const myselectedProgram = updatedPerformanceArea.programs.find(
        (program) => program.programName === selectedProgram
      );
      if (!myselectedProgram) {
        throw new Error("Selected program not found");
      }
      if (!myselectedProgram.indicators) {
        myselectedProgram.indicators = [];
      }
      myselectedProgram.indicators.push(newIndicatorData);
    } else {
      throw new Error("The programs array is null or not an array");
    }

    const appraiser = {
      ecNumber: "5660",
      email: "tdube1",
      firstName: "Tafadzwa",
      lastName: "Dube",
      position: {
        divisionName: "ICT",
        positionName: "GT",
        sectionName: "Innovation Hub",
      },
      signature: "signed",
      signatureStatus: "signed",
    };

    const newPerformanceArea = { ...updatedPerformanceArea };
    newPerformanceArea.programs[1].indicators = [newIndicatorData];

    const employee = {
      ecNumber: "5134",
      email: "amuchoko",
      name: "Anesu",
      position: {
        divisionName: "ICT",
        positionName: "GT",
        sectionName: "Innovation Hub",
      },
      signature: "signed",
      signatureStatus: "signed",
    };

    const evaluationPeriod = getCurrentEvaluationPeriod().evaluationPeriod;

    const evaluator = {
      ecNumber: "5660",
      email: "tdube1",
      firstName: "Tafadzwa",
      lastName: "Dube",
      position: {
        divisionName: "ICT",
        positionName: "GT",
        sectionName: "Innovation Hub",
      },
    };

    const searchData = {
      appraiser,
      employee,
      evaluationPeriod,
      evaluator,
    };

    axiosClient
      .get("/scorecard/searchScorecard", {
        params: {
          ec_number: profileData.ec_number,
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
            res.data.content[0].AreasOfPerformance || [];
          console.log("My Areas: ");
          console.log(res.data.content[0].AreasOfPerformance);
          const areasOfPerformance = [
            ...existingAreasOfPerformance,
            newPerformanceArea,
          ];
          // const updatedScorecard = scorecard.content[0].areasOfPerformnce.push(
          //   areasOfPerformnce
          // );
          const updatedScorecard = {
            ...scorecard.content[0],
            AreasOfPerformance: areasOfPerformance,
          };

          console.log("updatedScorecard", updatedScorecard);

          // const updatedAreasOfPerformance = existingAreasOfPerformance.map(
          //   (area) => {
          //     if (area.performanceArea === selectedPerfomance) {
          //       return {
          //         ...area,
          //         programs: [
          //           ...(area.programs || []),
          //           {
          //             contributedPillar: null,
          //             indicators: [newIndicatorData],
          //             name: selectedProgram,
          //             weight: programWeight,
          //           },
          //         ],
          //       };
          //     }
          //     return area;
          //   }
          // );

          // const updatedScorecard = {
          //   ...scorecard.content[0],
          //   areasOfPerformnce: updatedAreasOfPerformance,
          // };
          try {
            axiosClient
              .put(
                `/scorecard/updateScorecard/${scorecardId}`,
                updatedScorecard,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((res) => {
                console.log(res);
                swal({
                  text: "Indicator Saved Successfully",
                  icon: "success",
                  button: "OK!",
                });
                indicatorRef.current.value = "";

                weightRef.current.value = "";
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (error) {
            console.log("An error occurred:", error);
          }
        } else {
          // There is no existing scorecard, so save a new one

          // const areasOfPerformnce = [newPerformanceArea];
          const areasOfPerformnce = [
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

          const data = {
            appraiser,
            areasOfPerformnce,
            employee,
            evaluationPeriod,
            evaluator,
          };
          axiosClient
            .post("/scorecard/saveScorecard", data)
            .then((res) => {
              console.log(res.data);
              console.log("There is no existing scorecard, so save a new one");
              console.log(res.data);
              swal({
                text: "Indicator Saved Successfully",
                icon: "success",
                button: "OK!",
              });
              indicatorRef.current.value = "";
              weightRef.current.value = "";
            })
            .catch((err) => {
              console.log(err);
            });
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
    <div >
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
      <div style={{ marginLeft: 90, marginTop: 10, display: "flex" }}>
        <div style={{ marginRight: 20 }}>
          <Typography className="" sx={{ fontSize: 12 }}>
            <strong>
              Current Year Of Assessment:{" "}
              <span style={{ color: "#309366" }}>{evaluationPeriod}</span>
            </strong>
          </Typography>
        </div>
        <div>
          <Typography className="">
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
            <h4>Add Indicator</h4>
           
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
                <br />

                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedPerfomance}
                  onChange={handlePerformanceChange}
                  placeholder="Select a Performance"
                  style={{
                    marginLeft: "80px",
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a Performance...</option>
                  {performanceAreas &&
                    performanceAreas.map((area) => (
                      <option key={area.id} value={area.performanceArea}>
                        {area.performanceArea} ({area.weight}%)
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
                <label>Enter Program: </label>
                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  placeholder="Program"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a Program...</option>
                  {selectedPerfomance &&
                    performanceAreas &&
                    performanceAreas
                      .find(
                        (area) => area.performanceArea === selectedPerfomance
                      )
                      ?.programs.map((program) => (
                        <option key={program.id} value={program.programName}>
                          {program.programName} ({program.weight}%)
                        </option>
                      ))}
                </select>
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
                />
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
                {/* <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Weight"
                  onClick={handleInputClick}
                  ref={weightRef}
                /> */}

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
                      <option key={division.id} value={division.divisionName}>
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
                <label>Previous Performance(%): </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Performance"
                  onClick={handleInputClick}
                  ref={prevPerformanceRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label> Annual Target for {currentYear}(%): </label>
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
                <label>  Allowable Variance: </label>
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
                <label> Current Quarter Target: </label>
                <input
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Current Target"
                  onClick={handleInputClick}
                  ref={targetRef}
                />
              </div>

              <div className="btn-addPillar" style={{marginTop:"-20px"}}>
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
        {selectedPerfomance && (
          <div>
          <div className="new-div">
            <Sheet
              variant="outlined"
              sx={{
                width: 400,
                height: 320,
                maxHeight: 500,
                overflow: "auto",
                borderRadius: "sm",
                mt: 1,
                ml: -15,
                p: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                borderTop: "15px solid #309366",
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
                {/* {selectedPrograms.length > 0 ? (
                <ul>
                  {selectedPrograms.map((program) => (
                    <li key={program.id}>{program.programName}</li>
                  ))}
                </ul>
              ) : (
                <p>No programs found for the selected performance area.</p>
              )} */}
                {selectedPrograms.length > 0 ? (
                  <div>
                    {selectedPrograms.map((program, index) => (
                      <React.Fragment key={program.id}>
                        <ListItemButton
                          onClick={() => handlePerformanceClick(program, index)}
                        >
                          <ListItemIcon>
                            <AssessmentIcon />
                          </ListItemIcon>
                          <ListItemText primary={program.programName} />
                          {open ? <ExpandLess /> : <ExpandMore />}
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
                                  onClick={() =>
                                    handleProgramClick(indicator, index)
                                  }
                                  sx={{ pl: 4 }}
                                  endAction={
                                    <div>
                                      <IconButton
                                        sx={{
                                          fontSize: "15px",
                                          color: "green",
                                        }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
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
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
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
                                  <ListItemIcon sx={{ fontSize: "extraSmall" }}>
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
                  {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>
                  Select a Performance
                </label>
                <br />

                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedPerfomance}
                  onChange={handlePerformanceChange}
                  placeholder="Select a Performance"
                  style={{
                    marginLeft: "80px",
                    width: 250,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a Performance...</option>
                  {performanceAreas &&
                    performanceAreas.map((area) => (
                      <option key={area.id} value={area.performanceArea}>
                        {area.performanceArea} ({area.weight}%)
                      </option>
                    ))}
                </select>
              </div> */}

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
          <div className="new-div2">
            {/* <Sheet
              variant="outlined"
              sx={{
                width: 400,
                height: 310,
                maxHeight: 500,
                overflow: "auto",
                borderRadius: "sm",
                mt: 1,
                ml: -15,
                p: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                borderTop: "15px solid #f0ec13",
                position: "relative",
                elevation: 3,
              }}
            > */}
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
                  

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    p
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                  
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{}}>
                 
                  </Typography>
                  <Card
                    style={{
                      width: 350,
                      height: 170,
                      marginTop: "20px",
                      borderRadius: "30px",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                      overflow: "hidden",
                    }}
                    sx={{ maxWidth: 350 }}
                  >
                    <CardContent>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                       
                        <Typography
                          display="inline"
                          sx={{
                            color: "#17D61E"
                             
                          }}
                        >
                          
                        </Typography>
                  
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                       
                      </Typography>
                      <br />

                      <Typography variant="caption" color="text.secondary">
                      
                      </Typography>
                      <br />
                  
                        <span>
                          {" "}
                          <Typography display="block" variant="caption">
                         
                          </Typography>
                        </span>
                  

                      <Typography
                        display="inline"
                        variant="body2"
                        color="text.secondary"
                      >
                       
                      </Typography>
                      <Typography
                        display="inline"
                        variant="body2"
                        sx={{ color: "#B7B70E" }}
                      >
                      
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing></CardActions>
                  </Card>
                  <br />
                  <br />
                 
                  {/* <Button variant="outlined" sx={{ mt: 10,borderRadius:20}} color="error">
                Request for Update
              </Button> */}

                  <div
                    className="corner"
                    style={{
                      borderBottomRightRadius: "50px",
                      borderBottomLeftRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p className="daysCounts" style={{ textAlign: "center" }}>
                     Iindicator Details
                    </p>
                  </div>
                </Paper>
            {/* </Sheet> */}
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
                  {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>
                  Select a Performance
                </label>
                <br />

                <select
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedPerfomance}
                  onChange={handlePerformanceChange}
                  placeholder="Select a Performance"
                  style={{
                    marginLeft: "80px",
                    width: 250,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a Performance...</option>
                  {performanceAreas &&
                    performanceAreas.map((area) => (
                      <option key={area.id} value={area.performanceArea}>
                        {area.performanceArea} ({area.weight}%)
                      </option>
                    ))}
                </select>
              </div> */}

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
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWorkPlan;
