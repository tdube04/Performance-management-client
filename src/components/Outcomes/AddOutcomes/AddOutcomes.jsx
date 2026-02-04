import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import axiosClient from "../../../authentication/axios-client";
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

const AddOutcomes = () => {
  const sectionRef = useRef();
  const weightRef = useRef(null);
  const outcomeRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);
  const [performances, setPerformances] = useState([]);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const [performanceAreas, setPerformanceAreas] = useState([]);

  const [newPerformances, setNewPerformances] = useState([]);

  const [selectedPerfomance, setSelectedPerfomance] = useState("");

  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");

  const [selectedProgram, setSelectedProgram] = useState("");

  const [programIndex, setProgramIndex] = useState(null);

  const [message, setMessage] = useState(null);

  const [selectedArea, setSelectedArea] = useState(null);

  const [openIndex, setOpenIndex] = React.useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [id, setId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/Performance_Area/allAreas");
        setPerformanceAreas(response.data);
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
  };

  const performanceArea = performanceAreas.find(
    (area) => area.id === selectedPerfomance
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add null checks for refs
    if (!outcomeRef.current || !weightRef.current) {
      setMessage("Form inputs are not properly initialized");
      return;
    }

    const outcomeName = outcomeRef.current.value.trim().toUpperCase();
    const weight = weightRef.current.value.trim();

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

    if (!performanceArea) {
      setMessage("Please select a Performance");
      return;
    }
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
      console.log(response.data);
      if (response.status === 200) {
        setPerformanceAreas((prevPerformanceAreas) => {
          return prevPerformanceAreas.map((area) => {
            if (area.performanceArea === performanceArea.performanceArea) {
              return {
                ...area,
                programs: [
                  ...(area.programs || []),
                  {
                    programName: outcomeName,
                    weight: weight,
                  },
                ],
              };
            } else {
              return area;
            }
          });
        });
        console.log(performanceAreas);

        swal({
          text: response.data,
          icon: "success",
          button: "OK",
        })
          .then(() => {})
          .catch();

      } else {
        swal({
          text: response.data,
          icon: "error",
          button: "OK",
        });
      }

      
      setSelectedPerfomance("")
      if (outcomeRef.current) outcomeRef.current.value = "";
      if (weightRef.current) weightRef.current.value = "";
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

    if (outcome === "") {
      setMessage("Please enter a program name");
      return;
    }
    if (myWeight === "") {
      setMessage("Please enter a percentage weight");
      return;
    }
    console.log("index", programIndex);


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
        console.log(program);
        return program;
      }),
    };
    console.log("Updated ....:", updatedPerformance);
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

        console.log(selectedPerfomance);
        setPerformances((prevPerformances) => {
          const updatedPerformances = prevPerformances.map((performance) => {
            console.log(performance.id);

            if (performance.id === id) {
              return {
                ...performance,
                programs: performance.programs.map((program) => {
                  if (program.programName === selectedProgramName) {
                    return {
                      ...program,
                      programName: updatedProgramName,
                    };
                  }
                  return program;
                }),
              };
            }
            return performance;
          });
          console.log(selectedPerfomance);
          return updatedPerformances;
        });

        setModalOpen(false);
      });
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
        } else {
          setMessage("Failed to delete Program");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete a program.");
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5 }}>
          ADD PROGRAMS FOR A PERFORMANCE AREA
        </Typography>
      </Paper>
      <div style={{ marginLeft: "290px", marginTop: "25px", display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Paper
            variant="outlined"
            sx={{
              mt: 7,
              ml: 10,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            {selectedPerfomance && (
              <div>
                <Typography style={{ color: "#309366" }}>
                  Selected Performance: {selectedArea.performanceArea}
                </Typography>
                <Typography style={{ color: "#309366" }}>
                  Current Total Performance: {selectedArea.weight}%
                </Typography>
              </div>
            )}
            <Typography variant="caption" sx={{ mt: 3, textAlign: "center" }}>
              <ListSubheader sticky>ADD A PERFORMANCE PROGRAM</ListSubheader>
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "500px" }}>
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
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Enter Program: </label>
                <input
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
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Percentage Weight"
                  onClick={handleInputClick}
                  ref={weightRef}
                />
              </div>

              <div className="btn-addPillar">
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
        <div className="new-div">
          <Sheet
            variant="outlined"
            sx={{
              width: 570,
              height: 340,
              maxHeight: 390,
              overflow: "auto",
              borderRadius: "sm",
              mt: 7,
              ml: 9,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            <List
              sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListSubheader sticky sx={{ mt: -2, textAlign: "center" }}>
                Available Performance Areas
              </ListSubheader>
              {performanceAreas.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <React.Fragment key={item.id}>
                    <ListItem
                      onClick={() => handlePerformanceClick(item, index)}
                    >
                      <ListItemIcon>
                        <AssessmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {item.performanceArea}{" "}
                            <span
                              style={{ color: "#787B06" }}
                            >{`(${item.weight}%)`}</span>
                          </span>
                        }
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                            backgroundColor: "#DEDDE9",
                          },
                        }}
                      />
                      {isOpen ? (
                        <ExpandLess style={{ marginLeft: "auto" }} />
                      ) : (
                        <ExpandMore style={{ marginLeft: "auto" }} />
                      )}
                    </ListItem>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div">
                        {item.programs &&
                          item.programs.map((program) => (
                            <ListItem
                              key={program.programName}
                              onClick={() => handleProgramClick(program, index)}
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
                                    onClick={() => handleUpdateDialog(item.id)}
                                  >
                                    <ModeEditIcon sx={{ fontSize: "15px" }} />
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
                                        program.programName,
                                        program.weight
                                      )
                                    }
                                  >
                                    <DeleteIcon sx={{ fontSize: "15px" }} />
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
                                primary={`${program.programName}(${program.weight}%)`}
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
                );
              })}
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
                    outcomeRef.current ? outcomeRef.current.value : "",
                    weightRef.current ? weightRef.current.value : ""
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
    </>
  );
};

export default AddOutcomes;
