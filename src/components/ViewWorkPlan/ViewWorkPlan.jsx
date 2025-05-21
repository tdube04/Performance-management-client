import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import "./viewWorkPlan.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import CircularProgress from "@material-ui/core/CircularProgress";

import WorkPlanData from "../../components/WorkPlanData/workplandata";
import SummaryScores from "../../components/SummaryScores/SummaryScores";
import Signatures from "../../components/Signatures/Signatures";
import axiosClient from "../../authentication/axios-client";
import { useTheme, useMediaQuery } from "@material-ui/core";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { borderRadius } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";

import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
import swal from "sweetalert";
import queryString from "query-string";
import { useStateContext } from "../../context/ContextProvider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

function Row({
  program,
  area,
  planStatus,
  performanceAreasParsed,
  profileData,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sumOfIndicators, setSumOfIndicators] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedComment, setClickedComment] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageUpdate, setMessageUpdate] = useState(null);

  const classes = useStyles();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  console.log(program.name);
  console.log("Total indicators: ", program.indicators.length);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const handleUpdateProgramWeight = () => {
    setModalOpen(true);
  };

  const handleUpdateWorkplan = (indicator) => {
    const workplanUrl = "/updateWorkPlan";

    const programWeight = program.weight;
    const indicators = program.indicators;
    const totalIndicatorWeight = indicators.reduce(
      (sum, indicator) => sum + indicator.weight,
      0
    );
    setSumOfIndicators(totalIndicatorWeight);

    navigate(workplanUrl, {
      state: {
        indicator,
        program,
        area,
        programWeight,
        totalIndicatorWeight,
        planStatus,
      },
    });
  };

  const handleAddIndicator = (indicator) => {
    const parsedPerformancesData = JSON.parse(
      JSON.stringify(performanceAreasParsed)
    );
    const encodedPerformancesData = encodeURIComponent(
      JSON.stringify(parsedPerformancesData)
    );

    const queryParams = queryString.stringify({
      performancesData: encodedPerformancesData,
    });
    const workplanUrl = `/add-indicator?${queryParams}`;

    const programWeight = program.weight;
    const indicators = program.indicators;
    const totalIndicatorWeight = indicators.reduce(
      (sum, indicator) => sum + indicator.weight,
      0
    );
    setSumOfIndicators(totalIndicatorWeight);

    // Check if the program weight is equal to the total weight of the indicators
    if (
      programWeight === totalIndicatorWeight ||
      totalIndicatorWeight > programWeight
    ) {
      swal({
        text: "Total weight of indicators cannot exceed program weight",
        icon: "error",
        button: "OK!",
      });
    } else {
      navigate(workplanUrl, {
        state: { program, area, programWeight, totalIndicatorWeight },
      });
    }
  };
  const handleInputClick = () => {
    setMessage("");
    setMessageUpdate("");
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>{" "}
        <TableCell
          component="th"
          scope="row"
          style={{ color: "#16160E", fontWeight: 550 }}
        >
          {program.name}
        </TableCell>
        <TableCell align="center">{program.weight}</TableCell>
        <TableCell align="center">{evaluationPeriod}</TableCell>
        <TableCell align="center">{program.indicators.length} </TableCell>
        {/* <TableCell align="center">
          {profileData.grade &&
            parseInt(profileData.grade.replace(/[^0-9]/g, "")) > 1 && (
              <IconButton
                disabled={
                  planStatus.toLowerCase() === "pendingapproval" ||
                  planStatus.toLowerCase() === "approved"
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleUpdateProgramWeight()}
              >
                <ModeEditIcon
                  sx={{
                    fontSize: "20px",
                    color:
                      planStatus.toLowerCase() === "pendingapproval" ||
                      planStatus.toLowerCase() === "approved"
                        ? "gray"
                        : "green",
                  }}
                />
              </IconButton>
            )}
        </TableCell> */}
      </TableRow>
      <TableRow style={{ maxWidth: "80%" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="caption" gutterBottom component="div">
                Program Indicators
              </Typography>
              <Table
                size="medium"
                aria-label="purchases"
                style={{ maxWidth: "50%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%" }}>Indicator</TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Measurement Unit
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Weight(%)
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Incremental/Decremental
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Annual Target for 2024(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Current Quarter Target(%)
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
                    </TableCell>

                    <TableCell
                      align="right"
                      style={{ width: "10%" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.indicators &&
                    program.indicators.map((indicator, index) => (
                      <TableRow>
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          style={{ width: "10%" }}
                        >
                          {indicator.description}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.measurement_unit}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.weight}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.incremental_or_decremental}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.annual_target}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.allowable_variance}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.quarterly_target}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.responsibleDivision}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            disabled={
                              planStatus.toLowerCase() === "pendingapproval" ||
                              planStatus.toLowerCase() === "approved"
                            }
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleUpdateWorkplan(indicator)}
                          >
                            <ModeEditIcon
                              sx={{
                                fontSize: "20px",
                                color:
                                  planStatus.toLowerCase() ===
                                    "pendingapproval" ||
                                  planStatus.toLowerCase() === "approved"
                                    ? "gray"
                                    : "green",
                              }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddIndicator(program)}
                        disabled={
                          planStatus === "pendingApproval" ||
                          planStatus === "Approved"
                        }
                      >
                        Add Indicator
                      </Button>
                    </TableCell>
                    {/* <TableCell colSpan={5} align="center">
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddIndicator(program)}
                      >
                        Add Indicator
                      </Button>
                      
                    </TableCell> */}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
              Update Program Weight
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
                Enter Weight(%)
              </label>

              <input
                // defaultValue={selectedPerfomance.performanceArea}
                type="text"
                className="input-pillar animate__animated animate__bounceIn"
                // ref={programWeightRef}
                // onClick={handleInputClick}
              />
            </div>

            <div className="btn-outcome-program">
              <button
                className="btn-outcome animate__animated animate__pulse"
                style={{ borderRadius: "25px" }}
                // onClick={handleUpdate}
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
    </React.Fragment>
  );
}
Row.propTypes = {
  program: PropTypes.object.isRequired,
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const label = { inputProps: { "aria-label": "Checkbox demo" } };
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
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

export default function ViewWorkPlan() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const [value, setValue] = React.useState(0);
  const [performanceAreas, setPerformanceAreas] = React.useState([]);
  const [clicked, setClicked] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedPerfomance, setSelectedPerfomance] = useState([]);
  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState("");
  const [selectedProgramIndex, setSelectedProgramIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [workplanStatus, setWorkplanStatus] = useState("");

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  const [responseBody, setResponseBody] = useState([]);
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [profileData, setProfileData] = useState(" ");
  const [error, setError] = useState(null);
  const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];
  const [isHovered, setIsHovered] = useState(false);

  const [planStatus, setPlanStatus] = useState("");
  const [workplanId, setWorkplanId] = useState(null);

  const [workplanComment, setWorkplanComment] = useState("");
  const [clickedComment, setClickedComment] = useState(false);

  const tabItem3Styles = useGmailTabItemStyles({ color: indicatorColors[2] });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // useEffect(() => {
  //   axiosClient.get("/Performance_Area/allAreas").then((response) => {
  //     setPerformanceAreas(response.data);
  //     console.log(response.data);

  //   });
  // }, []);

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
          setResponseBody(response.data);
          console.log(appraiseeWorkplanArray);

          if (
            response.data.content[0] &&
            response.data.content[0].areasOfPerformance
          ) {
            const areasOfPerformance =
              response.data.content[0].areasOfPerformance;
            console.log("performance Workplan", areasOfPerformance);
            setPerformanceAreas(areasOfPerformance);
            setPlanStatus(response.data.content[0].workplanStatus);
            setWorkplanId(response.data.content[0].id);
            setWorkplanComment(response.data.content[0].statusComments);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [profileData]);

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);
    setSelectedPerfomanceArea(area.performanceArea);
    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);

    // const updatedPerformanceArea = performanceAreas.find(
    //   (area) => area.performanceArea === selectedPerfomanceArea
    // );
  };

  const handleWorkplanStatusChange = (event) => {
    setWorkplanStatus(event.target.value);
  };

  const handleOutcomeItemClick = (program, index) => {
    console.log("Program clicked", program);
    console.log("Outcome ", program);
    console.log("Program index selected", index);

    setSelectedOutcomes(program);

    setSelectedProgramIndex(index);
  };

  const handleInputClick = () => {
    setMessage("");
  };

  const handleSubmitWorkplan = (e) => {
    e.preventDefault();
    if (planStatus === "PendingApproval") {
      alert("Your Workplan is Waiting for approval so you cannot edit it");
    } else if (planStatus === "Approved") {
      alert("Your Workplan has been approved so you cannot submit it again");
    } else {
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
            const myWorkplanId = res.data.content[0].id;

            console.log(res.data.content[0].areasOfPerformance);
            const areasOfPerformanceData =
              res.data.content[0].areasOfPerformance || [];

            const hasEmptyIndicators = areasOfPerformanceData.some(
              (performanceArea) => {
                return (
                  performanceArea &&
                  performanceArea.programs &&
                  performanceArea.programs.some((program) => {
                    return program.indicators.length === 0;
                  })
                );
              }
            );

            if (hasEmptyIndicators) {
              swal({
                text:
                  "Programs with no indicators detected.Please ensure that each program has at least one indicator with data",
                icon: "warning",
                button: "OK!",
              });

              return;
            }

            const updatedWorkplan = {
              ...workplan.content[0],
              workplanStatus: "pendingApproval",
            };

            console.log("updatedWorkplan", updatedWorkplan);

            try {
              axiosClient
                .put(
                  `/workplan/updateWorkplan/${myWorkplanId}`,
                  updatedWorkplan
                )
                .then((res) => {
                  console.log("Backend Response:", res);
                  if (res.status === 200) {
                    swal({
                      text: "Workplan Submitted Successfully",
                      icon: "success",
                      button: "OK!",
                    });

                    setPlanStatus("pendingApproval");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (error) {
              console.log("An error occurred:", error);
            }
          } else {
            swal({
              text: "You have no workplan to submit!",
              icon: "warning",
              button: "OK!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleWorkPlanApprove = (event) => {
    event.preventDefault();
    if (workplanId === 0) {
      // Handle the case when workpanIda is not set
      console.error("workpan is not present");
      return;
    }
    axiosClient
      .get(`/workplan/approveWorkplan/{id}?id=${workplanId}`)
      .then((res) => {
        console.log(res);
        swal({
          text: res.data,
          icon: "success",
          button: "OK",
        });
        setPlanStatus("Approved");
        setLoading(false);
      });
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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 2 }}>
          <strong style={{ marginLeft: "145px", textAlign: "center" }}>
            {" "}
            MY WORK PLAN
          </strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 300, marginTop: 10, display: "flex" }}>
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
      {clickedComment && (
        <div
          className="comment-container"
          style={{
            marginLeft: 150,
            marginTop: 10,
            textAlign: "center",
            width: "1000px",
          }}
        >
          <Typography variant="caption">
            The Zimbabwe Revenue Authority, or ZIMRA, is the body responsible
            for collecting taxes and other revenue streams for the government in
            Zimbabwe. It derives its mandate from the Revenue Authority Act,
            passed by the parliament of Zimbabwe in 2002 and other related
            legislation.
            {/* {workplanComment} */}
          </Typography>
        </div>
      )}

      <div style={{ position: "absolute", top: 60, right: 40 }}>
        {planStatus === "Rejected" ? (
          <div style={{ marginLeft: 20 }}>
            <Typography
              className=""
              onClick={() => setClickedComment(!clickedComment)}
              style={{ cursor: "pointer" }}
            >
              Rejection Comment <CommentIcon />{" "}
              <span style={{ color: "#309366" }}></span>
            </Typography>
          </div>
        ) : null}
      </div>
      <div className={classes.root}>
        <Box
          sx={{
            mt: 1,
            ml: 4,
            width: "95%",
            typography: "body1",
            fontWeight: "bold",
            borderRadius: 20,
            backgroundColor: "#e7e7e7",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            // textColor="secondary"
            // indicatorColor="secondary"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {performanceAreas &&
              performanceAreas.map((area, index) => (
                <Tab
                  classes={tabItem3Styles}
                  key={index}
                  label={area && area.performanceArea}
                  onClick={() => handlePerformanceClick(area, index)}
                  sx={{
                    fontSize: 8,
                    color: "black",
                    fontWeight: "bold",
                    fontStyle: "sans-serif",
                  }}
                />
              ))}
            {/* <Tab label="Summary Scores" />
          <Tab label="Signatures" /> */}
          </Tabs>
        </Box>

        {performanceAreas.map((area, index) => (
          <TabPanel key={index} value={value} index={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                {area && area.section} - IRBM {area && area.performanceArea} (
                <span style={{ color: "green" }}>{area && area.weight}%</span>)
              </h6>
              <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                Workplan Status:{" "}
                {planStatus === "pendingApproval"
                  ? "Pending Approval"
                  : planStatus}
              </Typography>
            </div>

            <div className="">
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: 1450,
                    height: 520,
                  },
                }}
              >
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    {/* <caption>A basic table example with a caption</caption> */}
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>Program</TableCell>
                        <TableCell align="center">Weight&nbsp;(%)</TableCell>
                        <TableCell align="center">
                          Current Evaluation Period
                        </TableCell>

                        <TableCell align="center">
                          Total Number of Indicators
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {area &&
                        area.programs &&
                        area.programs.map((program, index) => (
                          <Row
                            key={index}
                            program={program}
                            area={area}
                            planStatus={planStatus}
                            performanceAreasParsed={performanceAreas}
                            profileData={profileData}
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {/* <Typography
                  style={{ marginLeft: "150px", marginRight: "50px" }}
                >
                  Total Weight:
                </Typography>
                <Typography
                  style={{
                    color: "#5c5c11",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginRight: "350px",
                  }}
                >
                  30.0%
                </Typography> */}
              </div>
            </div>
            <br />
            <div>
              <Typography
                style={{
                  color: "green",
                }}
              >
                Section A1 : Delivery of Mandates / Operations in the Agency
                Integrated Performance Agreement - Evaluation of Outcomes
              </Typography>
              <Typography style={{}}>
                Current Evaluation Period : 01 July - 30 September 2024
              </Typography>
              <Typography>Name of Appraiser : _____________ </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography>Designation : _____________ </Typography>

                <div
                  className="btn-saveWorkPlan"
                  style={{ marginLeft: "550px" }}
                >
                  {/* {planStatus !== "WorkingScorecard" &&
                    planStatus !== "Approved" && (
                      <button
                        onClick={handleSubmitWorkplan}
                        className="workplan-btn"
                        style={{
                          borderRadius: "25px",
                          marginLeft: "180px",
                          width: "160px",
                          marginTop: "-70px",
                        }}
                      >
                        Submit For Approval
                      </button>
                    )} */}
                  {planStatus !== "pendingApproval" &&
                  planStatus !== "Rejected" &&
                  planStatus !== "Approved" ? (
                    <>
                      <button
                        onClick={handleSubmitWorkplan}
                        className="workplan-btn"
                        style={{
                          borderRadius: "25px",
                          marginLeft: "180px",
                          width: "160px",
                          marginTop: "-70px",
                        }}
                      >
                        Submit For Approval
                      </button>
                    </>
                  ) : planStatus === "Approved" ? (
                    <div
                      className="btn-saveWorkPlan"
                      style={{
                        display: "flex",
                        marginLeft: "110px",
                        marginTop: "-10px",
                        width: "400px",
                      }}
                    >
                      <p
                        style={{
                          borderRadius: "9px",
                          height: "25px",
                          width: "50%",
                          backgroundColor: "#69b33e",
                          paddingLeft: "19px",
                          fontWeight: "bold",
                        }}
                      >
                        WorkPlan Approved!
                      </p>
                    </div>
                  ) : planStatus === "Rejected" ? (
                    <button
                      onClick={handleSubmitWorkplan}
                      className="workplan-btn"
                      style={{
                        borderRadius: "25px",
                        marginLeft: "180px",
                        width: "200px",
                        marginTop: "-70px",
                      }}
                    >
                      Re-Submit For Approval
                    </button>
                  ) : planStatus === "pendingApproval" &&
                    profileData.grade === "1" ? (
                    <button
                      onClick={handleWorkPlanApprove}
                      className="workplan-btn"
                      style={{
                        borderRadius: "25px",
                        marginLeft: "180px",
                        width: "160px",
                        marginTop: "-70px",
                      }}
                      disabled={loading} // Disable the button when loading is true
                    >
                      {loading ? (
                        <CircularProgress size={20} /> // Display circular progress bar when loading is true
                      ) : (
                        "Approve Workplan"
                      )}
                    </button>
                  ) : planStatus === "pendingApproval" ? (
                    <p
                      style={{
                        borderRadius: "9px",
                        height: "25px",
                        width: "110%",
                        backgroundColor: "#69b33e",
                        paddingLeft: "19px",
                        fontWeight: "bold",
                      }}
                    >
                      Waiting For Approval!
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </TabPanel>
        ))}
      </div>
    </>
  );
}
