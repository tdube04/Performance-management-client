import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { borderRadius } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@mui/icons-material/Add";
import "animate.css/animate.min.css";
import "./performanceAreas.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { UpdateDisabledRounded } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import axiosClient from "../../authentication/axios-client";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@mui/material/IconButton";

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

export default function AddPerformanceArea() {
  const [performances, setPerformances] = useState([]);

  const [newPerformances, setNewPerformances] = useState([]);

  const [selectedPerfomance, setSelectedPerfomance] = useState([]);

  const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);

  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState(0);

  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  const [showPerformances, setShowPerformances] = useState(false);

  const [totalWeight, setTotalWeight] = useState(0);

  const [totalPerformances, setTotalPerformances] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [id, setId] = useState(0);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const sectionRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);

  const sectionUpdateRef = useRef(null);
  const percentUpdateRef = useRef(null);
  const performanceUpdateRef = useRef(null);

  const weightRef = useRef(null);
  const weightUpdateRef = useRef(null);

  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageUpdate, setMessageUpdate] = useState(null);
  const [showAddOutcome, setShowAddOutcome] = useState(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [showAddPerformance, setShowAddPerformance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/Performance_Area/allAreas");
        setPerformances(response.data);
        console.log(response.data);

        let totalWeight = 0;
        response.data.forEach((performance) => {
          totalWeight += performance.weight;
        });
        setTotalWeight(totalWeight);
        setTotalPerformances(response.data.length);

        console.log("Total Weight:", totalWeight);
        console.log(totalPerformances);
      } catch (error) {
        // Handle the error here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);

    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);
  };

  const handleAddPerformanceClick = () => {
    setShowAddPerformance(true);
    setShowOutcomeForm(false);
    setShowAddOutcome(false);
  };

  const handleSubmitPerfomance = (e) => {
    e.preventDefault();

    let errors = [];

    if (!performanceRef.current.value) {
      errors.push("Performance Area is required.");
      setMessage("Performance Area is required");
      return;
    } else if (!isNaN(performanceRef.current.value)) {
      errors.push("Performance Area must not be a number.");
      setMessage("Please enter a valid Performance Area");
      return;
    }

    if (!sectionRef.current.value) {
      setMessage("Performance Section is required.");
      return;
    }

    if (!percentRef.current.value) {
      setMessage("Percentage Weight is required.");
      return;
    } else {
      const weight = parseFloat(percentRef.current.value);
      if (isNaN(weight) || weight < 1 || weight > 100) {
        setMessage("Please enter a valid weight between 1 and 100.");
        return;
      }
    }
    console.log("updatedPerformanceArea");
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const updatedPerformanceArea = { ...performances };

    const newPerformance = {
      performanceArea: performanceRef.current.value
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      weight: percentRef.current.value.trim(),
      section: sectionRef.current.value.trim().toUpperCase(),
    };

    Object.assign(updatedPerformanceArea, newPerformance);

    axiosClient
      .post("Performance_Area/save/", updatedPerformanceArea)
      .then((response) => {
        console.log(response.data);

        if (response.status === 200) {
          swal({
            text: response.data,
            icon: "success",
            button: "OK!",
          }).then(() => {
            setPerformances((prevPerformances) => {
              const newPerformancesAreas = [...prevPerformances];
              newPerformancesAreas.push({
                performanceArea: newPerformance.performanceArea,
                weight: newPerformance.weight,
                section: newPerformance.section,
              });
              setNewPerformances(newPerformancesAreas);
              console.log(newPerformancesAreas);
              return newPerformancesAreas;
            });

            const myTotalWeightOfPerformance =
              totalWeight + parseInt(newPerformance.weight);

            const myTotalNumberOfPerformances = totalPerformances + 1;

            console.log(myTotalWeightOfPerformance);
            setTotalWeight(myTotalWeightOfPerformance);
            setTotalPerformances(myTotalNumberOfPerformances);
          });
          performanceRef.current.value = "";
          sectionRef.current.value = "";
          percentRef.current.value = "";
        } else if (response.status === 400) {
          setMessage(response.data);
          swal({
            text: response.data,
            icon: "error",
            button: "OK",
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        swal({
          text: err.response.data,
          icon: "error",
          button: "OK",
        });
      });
  };

  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let errors = [];

    if (!performanceUpdateRef.current.value) {
      errors.push("Performance Area is required.");
      setMessageUpdate("Performance Area is required");
      return;
    } else if (!isNaN(performanceUpdateRef.current.value)) {
      errors.push("Performance Area must not be a number.");
      setMessageUpdate("Please enter a valid Performance Area");
      return;
    }
    if (!sectionUpdateRef.current.value) {
      setMessageUpdate("Performance Section is required.");
      return;
    }
    if (!percentUpdateRef.current.value) {
      errors.push("Weight is required.");
      setMessageUpdate("Percentage Weight is required.");
      return;
    } else {
      const weight = parseFloat(percentUpdateRef.current.value);
      if (isNaN(weight) || weight < 1 || weight > 100) {
        errors.push("Weight must be a number between 1 and 100.");
        setMessageUpdate("Please enter a valid weight between 1 and 100.");
      }
    }
    const updatedPerformance = {
      ...selectedPerfomance,

      performanceArea: performanceUpdateRef.current.value
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      weight: percentUpdateRef.current.value.trim(),
      section: sectionUpdateRef.current.value.trim().toUpperCase(),
    };
    console.log(updatedPerformance);

    try {
      const response = await axiosClient.post(
        `/Performance_Area/update/${id}`,
        updatedPerformance
      );

      console.log(response.status);
      if (response.status === 200) {
        swal({
          text: "Performance Area updated successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          setPerformances((prevPerformances) => {
            const updatedPerformances = prevPerformances.map((performance) => {
              if (performance.id === selectedPerfomance.id) {
                return {
                  ...performance,
                  performanceArea: updatedPerformance.performanceArea,
                };
              }
              return performance;
            });
            return updatedPerformances;
          });

          setModalOpen(false);
        });
      }
    } catch (error) {
      swal({
        text: error.message,
        icon: "error",
        button: "OK!",
      });
      console.log(error);
      console.log("Failed to update performance area.");
    }
  };
  // const handleDelete = (id,) => {
  //   axiosClient
  //     .post(`/Performance_Area/${id}`)
  //     .then((response) => {
  //       console.log("Performance area deleted successfully.");

  //       setPerformances((prevData) =>
  //         prevData.filter((area) => area.id !== id)
  //       );

  //       const myTotalWeightOfPerformance =
  //         totalWeight - selectedPerfomance.weight;

  //       const myTotalNumberOfPerformances = totalPerformances - 1;

  //       console.log(myTotalWeightOfPerformance);
  //       setTotalWeight(myTotalWeightOfPerformance);
  //       setTotalPerformances(myTotalNumberOfPerformances);

  //       // setTotalPerformances((prevPerformances) => {
  //       //   const updatedPerformances = prevPerformances.map((performance) => {
  //       //     if (performance.id === selectedPerfomance.id) {
  //       //       return {
  //       //         ...performance,
  //       //         performanceArea: updatedPerformance.performanceArea,
  //       //       };
  //       //     }
  //       //     return performance;
  //       //   });
  //       //   return updatedPerformances;
  //       // });
  //       // window.location.replace("/admin/add-performance-area");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       console.log("Failed to delete performance area.");
  //     });
  // };

  const handleDelete = (id, selectedPerformance) => {
    axiosClient
      .post(`/Performance_Area/${selectedPerformance.id}`)
      .then((response) => {
        console.log("Performance area deleted successfully.");
        setPerformances((prevData) =>
          prevData.filter((area) => area.id !== id)
        );
        const myTotalWeightOfPerformance =
          totalWeight - selectedPerformance.weight;
        const myTotalNumberOfPerformances = totalPerformances - 1;
        console.log(myTotalWeightOfPerformance);
        setTotalWeight(myTotalWeightOfPerformance);
        setTotalPerformances(myTotalNumberOfPerformances);
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete performance area.");
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };
  const handleInputChange = () => {
    setMessage("");
    const inputText = sectionRef.current.value;
    const upperCaseText = inputText.toUpperCase();
    sectionRef.current.value = upperCaseText;
  };

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "300px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        <Typography variant="body2" sx={{ textAlign: "center", ml: 6 }}>
          ADD PERFORMANCE AREAS
        </Typography>
      </Paper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: 170,
          marginTop: 40,
        }}
      >
        <Typography style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Current Total Weight:
          <span style={{ fontWeight: "bold", color: "green" }}>
            {" "}
            {totalWeight}%
          </span>
        </Typography>
        <Typography
          style={{ fontWeight: "bold", fontSize: "1.2rem", marginLeft: "1rem" }}
        >
          Percentage Weight left:
          <span style={{ fontWeight: "bold", color: "#e62e00" }}>
            {" "}
            {100 - totalWeight}%
          </span>
        </Typography>
        <Typography
          style={{ fontWeight: "bold", fontSize: "1.2rem", marginLeft: "1rem" }}
        >
          Performance Areas Present:
          <span style={{ fontWeight: "bold", color: "#6E1B06" }}>
            {" "}
            {totalPerformances}
          </span>
        </Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="add-performance">
          <Box
            sx={{
              mt: 2,
              marginLeft: showPerformances ? 100 : 10,
              transition: "margin-left 0.5s ease-in-out",
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 460,
                height: 400,
              },
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                borderTop: "7px solid #309366",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  <ListSubheader sticky>ADD A PERFORMANCE AREA</ListSubheader>
                </Typography>
              </div>
              <br />
              <form onSubmit={handleSubmitPerfomance}>
                {message && (
                  <div className="alert alert-danger animate__animated animate__bounceIn">
                    <p>{message}</p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Performance Area
                  </label>

                  <input
                    placeholder="Performance Area"
                    type="text"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={performanceRef}
                    onClick={handleInputClick}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Section
                  </label>
                  <input
                    placeholder="Section"
                    type="text"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={sectionRef}
                    onClick={handleInputChange}
                    onKeyUp={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Weight(%)
                  </label>

                  <input
                    placeholder="Percentage weight"
                    type="number"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={percentRef}
                    onClick={handleInputClick}
                    // style={{width:"80px" }}
                  />
                  {/* <p  style={{marginTop:"7px" }}>%</p> */}
                </div>
                <div className="btn-outcome-program">
                  <button
                    className="btn-outcome animate__animated animate__pulse"
                    style={{ borderRadius: "25px" }}
                  >
                    Add
                  </button>
                </div>
              </form>
            </Paper>
          </Box>
        </div>
        <div className="new-div">
          <Sheet
            variant="outlined"
            sx={{
              width: 550,
              height: 390,
              maxHeight: 390,
              overflow: "auto",
              borderRadius: "sm",
              mt: 3,
              ml: 10,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            <List>
              <ListItem nested key={performance.id}>
                <ListSubheader sticky sx={{ mt: -2, textAlign: "center" }}>
                  Available Perfomance Areas
                </ListSubheader>
                <List>
                  {performances.map((performance, index) => (
                    <ListItem
                      key={performance.performanceArea}
                      onClick={() => handlePerformanceClick(performance, index)}
                      endAction={
                        <div>
                          <IconButton
                            sx={{
                              fontSize: "15px",
                              color: "green",
                              marginRight: "8px",
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleUpdateDialog(performance.id)}
                          >
                            <ModeEditIcon />
                          </IconButton>
                          <IconButton
                            sx={{
                              fontSize: "15px",
                              color: "red",
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() =>
                              handleDelete(performance.id, performance)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      }
                    >
                      <ListItemButton>
                        <strong>{performance.section}</strong> -{" "}
                        {performance.performanceArea} ({performance.weight}%)
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </ListItem>
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
                  Update a Performance Area
                </Typography>
              </div>
              <br />
              <form>
                {messageUpdate && (
                  <div className="alert alert-danger animate__animated animate__bounceIn">
                    <p>{messageUpdate}</p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Performance Area
                  </label>

                  <input
                    defaultValue={selectedPerfomance.performanceArea}
                    type="text"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={performanceUpdateRef}
                    onClick={handleInputClick}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Section
                  </label>

                  <input
                    defaultValue={selectedPerfomance.section}
                    type="text"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={sectionUpdateRef}
                    onClick={handleInputClick}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <label style={{ textAlign: "left", width: "180px" }}>
                    Enter Weight(%)
                  </label>

                  <input
                    defaultValue={selectedPerfomance.weight}
                    type="text"
                    className="input-pillar animate__animated animate__bounceIn"
                    ref={percentUpdateRef}
                    onClick={handleInputClick}
                  />
                </div>
                <div className="btn-outcome-program">
                  <button
                    className="btn-outcome animate__animated animate__pulse"
                    style={{ borderRadius: "25px" }}
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
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
    </>
  );
}
