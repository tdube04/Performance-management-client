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
import "./createWorkPlan.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { UpdateDisabledRounded } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axiosClient from "../../authentication/axios-client";
import Popover from "@mui/material/Popover";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useStateContext } from "../../context/ContextProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontSize: 12,
}));

export default function CreateWorkPlan() {
  const classes = useStyles();

  const [data, setData] = useState([]);

  const [selectedPerfomance, setSelectedPerfomance] = useState([]);

  const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);

  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState(0);

  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [anchorEl2, setAnchorEl2] = useState(null);

  const outcomeRef = useRef(null);
  const sectionRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);
  const descriptionRef = useRef(null);
  const measurement_unitRef = useRef(null);
  const weightRef = useRef(null);
  const quarterly_targetRef = useRef(null);
  const annual_targetRef = useRef(null);
  const allowable_varianceRef = useRef(null);
  const previous_year_PerfomenaceRef = useRef(null);
  const indicatorRef = useRef(null);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(null);
  const [showAddOutcome, setShowAddOutcome] = useState(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [showViewIndicators, setShowViewIndicators] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [profileData, setProfileData] = useState(" ");
  const [error, setError] = useState(null);

  const handleDeleteDocument = (index) => {
    const updatedDocuments = [...attachedDocuments];
    updatedDocuments.splice(index, 1);
    setSelectedDocument(null);
    // Update the state with the modified document list
    // You can use a state management library like Redux or pass a callback function from the parent component to handle the state update
  };

  const handleAddDocument = () => {
    // Logic to add a new document
    // You can open a file picker or show a form to upload a document
    // Once a document is added, update the state with the new document list
    // You can use a state management library like Redux or pass a callback function from the parent component to handle the state update
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const indicatorClick = () => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClosePop = () => {
    setAnchorEl2(null);
  };

  const handleViewAttachmentClick = () => {
    setAttachedDocuments(["Document 1", "Document 2", "Document 3"]);
    setModalOpen(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const opened = Boolean(anchorEl2);
  const id2 = opened ? "simple-popover" : undefined;
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
    if (profileData) {
      axiosClient
        .get("/scorecard/searchScorecard", {
          params: {
            ec_number: profileData.ec_number,
            name: profileData.name,
          },
        })
        .then((response) => {
          console.log("Appraisee Workplan");
          console.log(response.data.content[1].areasOfPerformnce);
          setScorecardData(response.data.content[1].areasOfPerformnce);
        });
    }
  }, [profileData]);

  useEffect(() => {
    if (!scorecardData || scorecardData.length === 0) {
      axiosClient.get("/Performance_Area/allAreas").then((response) => {
        setData(response.data);
        console.log(response.data);
      });
    }
  }, [scorecardData]);
  // const getMyWorkPlan = async () => {
  //   try {
  //     const response = await axiosClient.get("/scorecard/searchScorecard", {
  //       params: {
  //         ec_number: "5134",
  //         name: "Anesu",
  //       },
  //     });
  //     console.log("Appraisee Workplan");
  //     // appraiseeWorkplanDataArray.push(response.data);
  //     console.log(response.data);
  //     // setWorkPlanData(appraiseeWorkplanDataArray);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);
    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);
  };
  const handleOutcomeClick = (outcome) => {
    console.log("Outcome clicked", outcome);

    setSelectedOutcomes(outcome);
    // setShowAddOutcome(true);
    // setShowOutcomeForm(false);
    // setShowViewIndicators(false);
  };

  const handleAddOutcomeClick = () => {
    setShowAddOutcome(true);
    setShowOutcomeForm(false);
    setShowViewIndicators(false);
  };

  const handleIndicatorClick = () => {
    setShowViewIndicators(true);
    setShowOutcomeForm(false);
    setShowAddOutcome(false);
  };

  const handleOutcomeItemClick = (program, index) => {
    console.log("Outcome clicked 11", program);
    console.log("Outcome 11", program);
    console.log("Program index selected 11", index);

    setSelectedOutcomes(program);
    handleOutcomeClick(program);
    setShowAddOutcome(false);
    setShowViewIndicators(false);
    setShowOutcomeForm(true);
    setSelectedProgramIndex(index);
  };

  // const handleProgramSelect = (event) => {
  //   const index = event.target.value;
  //   console.log("Program selected", index);
  //   setSelectedProgramIndex(index);
  // };

  const handleSubmitOutcome = (e) => {
    e.preventDefault();

    let errors = [];

    if (!outcomeRef.current.value) {
      errors.push("Outcome is required.");
      setMessage("Please fill in all required fields");
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const updatedPerformanceArea = { ...selectedPerfomance };

    const newProgram = {
      name: outcomeRef.current.value,
    };

    // updatedPerformanceArea.programs.push(newProgram);

    if (updatedPerformanceArea.programs) {
      updatedPerformanceArea.programs.push(newProgram);
    } else {
      updatedPerformanceArea.programs = [newProgram];
    }

    axiosClient
      .post(
        `Performance_Area/update/${selectedPerfomance.id}`,
        updatedPerformanceArea
      )
      .then((res) => {
        console.log(res);
        swal({
          text: "Outcome Saved Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          // window.location.replace("/admin/addOutcomes");
        });
        outcomeRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitPerfomance = (e) => {
    e.preventDefault();

    let errors = [];

    if (!performanceRef.current.value) {
      errors.push("Perfomance Area is required.");
      setMessage("Please fill in all required fields");
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const updatedPerformanceArea = { ...data };

    const newPerformance = {
      performanceArea: performanceRef.current.value,
      wieght: percentRef.current.value,
      section: sectionRef.current.value,
    };

    Object.assign(updatedPerformanceArea, newPerformance);

    axiosClient
      .post("Performance_Area/save/", updatedPerformanceArea)
      .then((res) => {
        console.log(res);
        swal({
          text: "Performance Area Saved Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          window.location.replace("/admin/addOutcomes");
        });
        performanceRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitIndicators = (e) => {
    e.preventDefault();

    const updatedPerformanceArea = { ...selectedPerfomance };

    console.log(updatedPerformanceArea);
    const newIndicatorData = {
      description: indicatorRef.current.value,
      measurement_unit: measurement_unitRef.current.value,
      weight: weightRef.current.value,
    };
    if (
      updatedPerformanceArea.programs &&
      Array.isArray(updatedPerformanceArea.programs)
    ) {
      const selectedProgram = updatedPerformanceArea.programs[0];
      if (!selectedProgram.indicators) {
        selectedProgram.indicators = [];
      }
      selectedProgram.indicators.push(newIndicatorData);
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
    newPerformanceArea.programs[0].indicators = [newIndicatorData];
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

    const evaluationPeriod = "2023-Q3";

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
          console.log(
            "There is an existing scorecard, so update it" + res.data.content
          );
          console.log("My ID: " + res.data.content[1].id);
          const scorecardId = res.data.content[1].id;
          const existingAreasOfPerformance =
            res.data.content[1].areasOfPerformnce || [];
          console.log("My Areas: ");
          console.log(res.data.content[1].areasOfPerformnce);
          const areasOfPerformance = [
            ...existingAreasOfPerformance,
            newPerformanceArea,
          ];
          const updatedScorecard = scorecard.content[1].areasOfPerformnce.push(
            areasOfPerformance
          );
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
                measurement_unitRef.current.value = "";
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

          const areasOfPerformance = [newPerformanceArea];
          const data = {
            appraiser,
            areasOfPerformance,
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
              measurement_unitRef.current.value = "";
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

  // const handleSubmitIndicators = (e) => {
  //   e.preventDefault();

  //   const updatedPerformanceArea = { ...selectedPerfomance };

  //   console.log(updatedPerformanceArea);
  //   const newIndicatorData = {
  //     description: indicatorRef.current.value,
  //     measurement_unit: measurement_unitRef.current.value,
  //     weight: weightRef.current.value,
  //   };
  //   if (
  //     updatedPerformanceArea.programs &&
  //     Array.isArray(updatedPerformanceArea.programs)
  //   ) {
  //     const selectedProgram = updatedPerformanceArea.programs[0];
  //     if (!selectedProgram.indicators) {
  //       selectedProgram.indicators = [];
  //     }
  //     selectedProgram.indicators.push(newIndicatorData);
  //   } else {
  //     throw new Error("The programs array is null or not an array");
  //   }

  //   const appraiser = {
  //     ecNumber: "5660",
  //     email: "tdube1",
  //     firstName: "Tafadzwa",
  //     lastName: "Dube",
  //     position: {
  //       divisionName: "ICT",
  //       positionName: "GT",
  //       sectionName: "Innovation Hub",
  //     },
  //     signature: "signed",
  //     signatureStatus: "signed",
  //   };
  //   const areasOfPerformnce = [updatedPerformanceArea];
  //   const employee = {
  //     ecNumber: "5134",
  //     email: "amuchoko",
  //     name: "Anesu",
  //     position: {
  //       divisionName: "ICT",
  //       positionName: "GT",
  //       sectionName: "Innovation Hub",
  //     },
  //     signature: "signed",
  //     signatureStatus: "signed",
  //   };

  //   const evaluationPeriod = "2023-Q3";

  //   const evaluator = {
  //     ecNumber: "5660",
  //     email: "tdube1",
  //     firstName: "Tafadzwa",
  //     lastName: "Dube",
  //     position: {
  //       divisionName: "ICT",
  //       positionName: "GT",
  //       sectionName: "Innovation Hub",
  //     },
  //   };

  //   const data = {
  //     appraiser,
  //     areasOfPerformnce,
  //     employee,
  //     evaluationPeriod,
  //     evaluator,
  //   };

  //   axiosClient
  //     .post("/scorecard/saveScorecard", data)
  //     .then((res) => {
  //       console.log(res.data);
  //       swal({
  //         text: "Indicator Saved Successfully",
  //         icon: "success",
  //         button: "OK!",
  //       });
  //       indicatorRef.current.value = "";
  //       measurement_unitRef.current.value = "";
  //       weightRef.current.value = "";
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <>
      <div>
        <Paper
          elevation={1}
          sx={{
            ml: 50,
            mb: 5,
            display: "flex",
            backgroundColor: "white",
            width: "300px",
            alignItems: "center",
            borderRadius: "6px",
          }}
        >
          {" "}
          <Typography sx={{ ml: 7 }}>CREATE WORKPLAN</Typography>
        </Paper>
      </div>
      <Box display="flex" style={{ height: "700px" }}>
        <div className="" style={{ overflow: "scroll" }}>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                width: 500,
                height: 650,
              },
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                mt: 5,
                ml: 20,
                p: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                borderTop: "20px solid #309366",
                position: "relative",
                elevation: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: 450,
                    height: 45,
                  },
                }}
              >
                <div className={classes.root}>
                  <Typography
                    className={classes.heading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                      color: "black",
                    }}
                  >
                    Select Performance Area To Create WorkPlan
                  </Typography>

                  {data &&
                    data.map((area, index) => (
                      <Accordion
                        key={index}
                        onClick={() => handlePerformanceClick(area, index)}
                      >
                        <AccordionSummary
                          style={{ backgroundColor: "#e2e2e2" }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1c-content"
                          id="panel1c-header"
                        >
                          <div className={classes.column}>
                            <Typography
                              className={classes.heading}
                            ></Typography>
                          </div>
                          <div>
                            <Typography
                              className={classes.secondaryHeading}
                              sx={{ fontSize: 12, color: "black" }}
                            >
                              {area.section} {area.performanceArea}
                            </Typography>
                          </div>
                        </AccordionSummary>
                        <div>Programs </div>
                        <AccordionDetails className={classes.details}>
                          <div className={classes.column} />
                          <Box sx={{ width: "100%" }}>
                            <Grid
                              container
                              rowSpacing={2}
                              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                              <Grid item xs={8}>
                                {area.programs &&
                                  area.programs.map((program, index) => (
                                    <Item
                                      sx={{
                                        marginBottom: 2,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                      // onClick={() =>
                                      //   handleOutcomeItemClick(program, index)
                                      // }
                                      key={index}
                                    >
                                      {program.programName}({program.weight})
                                      <MoreVertIcon
                                        onClick={handleClick}
                                        sx={{ marginLeft: "auto" }}
                                      />
                                      <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                          vertical: "top",
                                          horizontal: "left",
                                        }}
                                        transformOrigin={{
                                          vertical: "center",
                                          horizontal: "right",
                                        }}
                                        PaperProps={{
                                          style: {
                                            borderRadius: "11px",
                                          },
                                        }}
                                      >
                                        <Typography
                                          sx={{ p: 2 }}
                                          onClick={() =>
                                            handleOutcomeItemClick(
                                              program,
                                              index
                                            )
                                          }
                                        >
                                          Add Indicator
                                        </Typography>

                                        <Typography
                                          sx={{ p: 2 }}
                                          onClick={() => handleIndicatorClick()}
                                        >
                                          View Indicator
                                        </Typography>
                                      </Popover>
                                    </Item>
                                  ))}
                              </Grid>

                              <br />
                            </Grid>
                          </Box>
                        </AccordionDetails>
                        <Divider />
                        <AccordionActions></AccordionActions>
                      </Accordion>
                    ))}
                </div>
              </Box>
            </Paper>
          </Box>
        </div>
        {showAddOutcome && (
          <div className="add-outcome">
            <Box
              sx={{
                mt: 2,
                marginLeft: 20,
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 428,
                  height: 350,
                },
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  borderTop: "20px solid #309366",
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
                  <Typography variant="body2" sx={{ mt: 6 }}>
                    {selectedPerfomance.section} -{" "}
                    {selectedPerfomance.performanceArea}
                  </Typography>
                </div>
                <br />
                <form onSubmit={handleSubmitOutcome}>
                  {message && (
                    <div className="alert alert-danger animate__animated animate__bounceIn">
                      <p>{message}</p>
                    </div>
                  )}
                  <label>Enter Outcome</label>
                  <div>
                    <input
                      type="text"
                      className="input-pillar animate__animated animate__bounceIn"
                      ref={outcomeRef}
                      onClick={handleInputClick}
                    />
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
        )}
        {showOutcomeForm && (
          <div className="outcome-form">
            <Box
              sx={{
                mt: 2,
                marginLeft: 20,
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 428,
                  height: 700,
                },
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  borderTop: "20px solid #309366",
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
                  <Typography variant="body2" sx={{ mt: 6 }}>
                    {selectedPerfomance.section} -{" "}
                    {selectedOutcomes.programName}
                  </Typography>
                </div>
                <br />
                <form
                  onSubmit={handleSubmitIndicators}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left" }}>
                      {" "}
                      Outcome Indicator
                    </label>

                    <input
                      type="text"
                      className="input-pillar"
                      ref={indicatorRef}
                      onClick={handleInputClick}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left" }}>
                      {" "}
                      Measurement Unit
                    </label>

                    <input
                      type="text"
                      className="input-pillar"
                      ref={measurement_unitRef}
                      onClick={handleInputClick}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left" }}>Weight</label>

                    <input
                      type="text"
                      className="input-pillar"
                      onClick={handleInputClick}
                      ref={weightRef}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left" }}>
                      Responsible Division{" "}
                    </label>

                    <input
                      type="text"
                      className="input-pillar"
                      onClick={handleInputClick}
                    />
                  </div>

                  <div className="btn-outcome-program">
                    <button
                      className="btn-outcome"
                      style={{ borderRadius: "25px" }}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </Paper>
            </Box>
          </div>
        )}
        {showViewIndicators && (
          <div className="add-outcome">
            <Box
              sx={{
                mt: 2,
                marginLeft: 20,
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 428,
                  height: 400,
                },
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  borderTop: "20px solid #309366",
                  position: "relative",
                }}
                style={{ overflow: "scroll", scrollbarWidth: "thin" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ mt: 6 }}>
                    {selectedPerfomance.section} -{" "}
                    {selectedPerfomance.performanceArea}
                  </Typography>
                </div>
                <br />

                <Box sx={{ width: "100%", marginLeft: 10 }}>
                  {data &&
                    data.map((area, index) => (
                      <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid item xs={8}>
                          {area.programs &&
                            area.programs.map((program, index) => (
                              <div key={index}>
                                {program.indicators &&
                                  program.indicators.map((indicator, index) => (
                                    <Item
                                      onClick={handleViewAttachmentClick}
                                      sx={{
                                        marginBottom: 2,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {indicator.description} (
                                      {indicator.weight}){" "}
                                      <MoreVertIcon
                                        onClick={indicatorClick}
                                        sx={{ marginLeft: "auto" }}
                                      />
                                      <Popover
                                        id={id2}
                                        open={opened}
                                        anchorEl={anchorEl2}
                                        onClose={handleClosePop}
                                        anchorOrigin={{
                                          vertical: "top",
                                          horizontal: "left",
                                        }}
                                        transformOrigin={{
                                          vertical: "center",
                                          horizontal: "right",
                                        }}
                                        PaperProps={{
                                          style: {
                                            borderRadius: "11px",
                                          },
                                        }}
                                      >
                                        <Typography sx={{ p: 2 }}>
                                          Delete
                                        </Typography>

                                        <Typography
                                          sx={{ p: 2 }}
                                          onClick={handleViewAttachmentClick}
                                        >
                                          View Evidence
                                        </Typography>
                                      </Popover>
                                    </Item>
                                  ))}
                              </div>
                            ))}
                        </Grid>

                        <br />
                      </Grid>
                    ))}
                </Box>
              </Paper>
            </Box>
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Attached Documents"}
              </DialogTitle>
              <DialogContent>
                <ul>
                  {attachedDocuments.map((doc, index) => (
                    <li key={index}>
                      {doc}{" "}
                      <IconButton
                        aria-label="Delete"
                        onClick={() => handleDeleteDocument(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModalOpen(false)} color="primary">
                  Close
                </Button>
                <IconButton aria-label="Add" onClick={handleAddDocument}>
                  <AddIcon />
                </IconButton>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </Box>
    </>
  );
}
