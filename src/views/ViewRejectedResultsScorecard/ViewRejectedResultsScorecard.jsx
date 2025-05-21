import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";

// import WorkPlanData from "../WorkPlanData/workplandata";
// import SummaryScores from "../SummaryScores/SummaryScores";
// import Signatures from "../Signatures/Signatures";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
import { useStateContext } from "../../context/ContextProvider";

function Row({ program, area, selectedAppraisee }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const appraiserActualWeightRef = useRef(null);
  const classes = useStyles();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  console.log(program.name);
  console.log("Total indicators: ", program.indicators.length);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();
  const handleUpdateRedirect = (indicator) => {
    navigate("/appraiser_add_actual_performance", {
      state: { indicator, program, area, selectedAppraisee },
    });
  };
  const handleInputClick = () => {
    setMessage("");
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
        <TableCell align="center">{program.indicators.length}</TableCell>
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
                    <TableCell sx={{ width: 10 }}>Measurement Unit</TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Weight(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Incremental/Decremental
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Annual Target for 2023(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Target for 2023(%)
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Comment
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Appraisee Score for Q3 2023
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Agreed Weighted Score
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance from Appraiser
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.indicators &&
                    program.indicators.map((indicator, index) => (
                      <TableRow>
                        <TableCell
                          align="center"
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
                          {indicator.previous_year_Perfomenace}
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
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.perfomanceComment}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.appraisee_actual_perfomance !== null &&
                          indicator.appraisee_actual_perfomance !== 0
                            ? indicator.appraisee_actual_perfomance
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.appraiseeScore !== null &&
                          indicator.appraiseeScore !== 0
                            ? indicator.appraiseeScore
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.agreedWeightedScore !== null &&
                          indicator.agreedWeightedScore !== 0
                            ? indicator.agreedWeightedScore
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.appraisor_actual_perfomance !== null &&
                          indicator.appraisor_actual_perfomance !== 0
                            ? indicator.appraisor_actual_perfomance
                            : "___"}
                        </TableCell>
                      </TableRow>
                    ))}
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
              Enter Appraiser Actual Performance
            </Typography>
          </div>
          <br />
          <form
            // onSubmit={handleWorkPlanReject}
            style={{ width: "500px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label>Enter Weight(%): </label>
              <input
                // defaultValue={selectedProgram.programName}
                className="input2 animate__animated animate__bounceIn"
                type="text"
                placeholder="Percentage"
                onClick={handleInputClick}
                ref={appraiserActualWeightRef}
              />
            </div>

            <div className="btn-addPillar">
              <button className="pillar-btn" style={{ borderRadius: "25px" }}>
                Update
              </button>
            </div>
            {/* {message && (
                <div className="alert alert-danger">
                  <p>{message}</p>
                </div>
              )} */}
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

export default function ViewRejectedResultsScorecard() {
  const navigate = useNavigate();
  const { workPlanId } = useParams();
  const location = useLocation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [performanceAreas, setPerformanceAreas] = React.useState([]);
  const [clicked, setClicked] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedPerfomance, setSelectedPerfomance] = React.useState(null);
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState("");
  const [selectedProgramIndex, setSelectedProgramIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();
  const [workplanStatus, setWorkplanStatus] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const [selectedAppraisee, setSelectedAppraisee] = useState("");
  const [workpanIda, setWorkpanIda] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [totalWeightedScore, setTotalWeightedScore] = useState(0);
  const [totalProgramsWeight, setTotalProgramsWeight] = useState(0);

  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();

  const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];

  const tabItem3Styles = useGmailTabItemStyles({ color: indicatorColors[2] });
  // searchWorkplanByAppraisee?period=2023-Q3&planStatus=Incomplete&User_email=amuchoko

  const handleWorkplanStatusChange = (event) => {
    setWorkplanStatus(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const getIncompleteAppraiseeWorkplan = async () => {};
  const executeAfterWorkPlanReject = () => {
    getIncompleteAppraiseeWorkplan();
  };
  // const response = await axiosClient.get(
  //   `searchWorkplanByAppraisee?period=${evaluationPeriod}&planStatus=Incomplete&User_email=${userName}`
  // );
  // const appraiseeWorkplanDataArray = [];
  // console.log(userName);
  // appraiseeWorkplanDataArray.push(response.data);
  // console.log(response.data);
  // setPerformanceAreas(appraiseeWorkplanDataArray);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get("username");
        const workplanParsed = urlParams.get("workplanData");
        const decodedWorkplanData = JSON.parse(
          decodeURIComponent(workplanParsed)
        );

        setPerformanceAreas(decodedWorkplanData.areasOfPerformance);
        setPlanStatus(decodedWorkplanData.scorecardStatus);
        console.log(decodedWorkplanData);
        setSelectedAppraisee(decodedWorkplanData.user_email);
        setWorkpanIda(decodedWorkplanData.id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(performanceAreas);
    if (performanceAreas && performanceAreas.length > 0) {
      const firstPerformanceArea = performanceAreas[0];
      console.log("first Performance Area", firstPerformanceArea);
      setSelectedPerfomance(firstPerformanceArea);
    }
  }, [performanceAreas]);

  useEffect(() => {
    handlePerformanceClick(selectedPerfomance, 0);
  }, [selectedPerfomance, totalWeightedScore, totalProgramsWeight]);
  const handlePerformanceClick = async (area, index) => {
    console.log("Perfomance clicked", area);

    if (area && area.performanceArea) {
      setSelectedPerfomance(area);
      // setSelectedPerfomanceArea(area.performanceArea);
      setSelectedPerfomanceIndex(index);
      console.log("Performance", index);
      const sumOfAgreedWeightedScores = await new Promise((resolve) => {
        const sum = area?.programs?.reduce((sum, program) => {
          const programAgreedWeightedScores = program.indicators.reduce(
            (programSum, indicator) =>
              programSum + indicator.agreedWeightedScore,
            0
          );
          return sum + programAgreedWeightedScores;
        }, 0);
        resolve(sum);
      });
      console.log(sumOfAgreedWeightedScores);
      setTotalWeightedScore(sumOfAgreedWeightedScores);
      const sumOfWeights = area?.programs?.reduce(
        (sum, program) => sum + program.weight,
        0
      );
      console.log(sumOfWeights);
      setTotalProgramsWeight(sumOfWeights);
    }
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
  const handleSubmitResultScorecardApprove = (e) => {
    e.preventDefault();

    axiosClient
      .get("/scorecard/searchScorecard", {
        params: {
          period: evaluationPeriod,
          username: selectedAppraisee,
        },
      })
      .then((res) => {
        const scoreCard = res.data;
        if (scoreCard.content && scoreCard.content.length > 0) {
          // There is an existing scoreCard, so update it
          console.log("There is an existing scoreCard, so update it", res.data);
          console.log("My ID: " + res.data.content[0].id);
          const myScorecardId = res.data.content[0].id;

          console.log(res.data.content[0].areasOfPerformance);

          const updatedScorecard = {
            ...scoreCard.content[0],
            scorecardStatus: "Approved",
          };

          console.log("updated Scorecard", updatedScorecard);

          try {
            axiosClient
              .put(
                `/scorecard/updateScorecard/${myScorecardId}`,
                updatedScorecard
              )
              .then((res) => {
                console.log("Backend Response:", res);
                if (res.status === 200) {
                  swal({
                    text: "Scorecard Approved Successfully",
                    icon: "success",
                    button: "OK!",
                  });
                  // navigate("/resultscorecard");
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
            text: "You have no score card to submit!",
            icon: "warning",
            button: "OK!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleWorkPlanApprove = (event) => {
    event.preventDefault();
    if (workpanIda === 0) {
      // Handle the case when workpanIda is not set
      console.error("workpanIda is not set");
      return;
    }
    axiosClient
      .get(`/workplan/approveWorkplan/{id}?id=${workpanIda}`)
      .then((res) => {
        console.log(res);
        swal({
          text: res.data,
          icon: "success",
          button: "OK",
        });
        // navigate("/approved");
      });
  };
  const handleWorkPlanReject = (event) => {
    event.preventDefault();
    if (workpanIda === 0) {
      // Handle the case when workpanIda is not set
      console.error("workpanIda is not set");
      return;
    }
    axiosClient
      .get(
        `/workplan/disapproveWorkplan/{id}?id=${workpanIda}&message=WorkplanRejected`
      )
      .then((res) => {
        console.log(res);
        swal({
          text: `You have Rejected Results Scorecard for ${selectedAppraisee}`,
          icon: "success",
          button: "OK",
        });
        navigate("/rejected");
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
          <strong style={{ marginLeft: "45px", textAlign: "center" }}>
            {" "}
            RESULTS SCORECARD FOR : {selectedAppraisee}
          </strong>
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
      {/* <div style={{ position: "absolute", top: 60, right: 40 }}>
        <select
          className="input2 animate__animated animate__bounceIn"
          value={workplanStatus}
          onChange={handleWorkplanStatusChange}
          placeholder="Worlpan status"
          style={{
            width: 190,
            height: 40,
            backgroundColor: "#f9f6f6",
          }}
        >
          <option>WORKPLAN STATUS...</option>
          <option value="%">Approve</option>
          <option value="$">Reject</option>
        </select>{" "}
      </div> */}
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
                  label={area.performanceArea}
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

        {performanceAreas &&
          performanceAreas.map((area, index) => (
            <TabPanel key={index} value={value} index={index}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                  {area.section} - IRBM {area.performanceArea} (
                  <span style={{ color: "green" }}>{area.weight}%</span>)
                </h6>
                <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                  Scorecard Status:{" "}
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {planStatus}
                  </span>
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
                      width: 1150,
                      height: 450,
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {area.programs &&
                          area.programs.map((program, index) => (
                            <Row
                              key={index}
                              program={program}
                              area={area}
                              selectedAppraisee={selectedAppraisee}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Typography
                    style={{ marginLeft: "150px", marginRight: "50px" }}
                  >
                    Total Programs Weight:
                  </Typography>
                  <Typography
                    style={{
                      color: "#5c5c11",
                      fontWeight: "bold",
                      marginLeft: "10px",
                      marginRight: "350px",
                    }}
                  >
                    {totalProgramsWeight || totalProgramsWeight === 0
                      ? totalProgramsWeight
                      : "____"}
                    %
                  </Typography>
                  <Typography>
                    Total Weighted Score:{" "}
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      {totalWeightedScore || totalWeightedScore === 0
                        ? totalWeightedScore
                        : "____"}
                    </span>
                  </Typography>
                </div>
                {/* <div style={{ display: "flex", flexDirection: "row" }}>
                  <Typography
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
                  </Typography>
                  <Typography>Total Weighted Score: ____</Typography>
                </div> */}
              </div>
              <br />
              <div>
                <Typography
                  style={{
                    color: "green",
                  }}
                >
                  Section A1 : Operations in the Agency Integrated Performance
                  Agreement - Evaluation of Outcomes
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
                    style={{
                      display: "flex",
                      marginLeft: "640px",
                      marginTop: "-70px",
                    }}
                  >
                    {planStatus !== "Rejected" && planStatus !== "Approved" ? (
                      <>
                        <div>
                          <button
                            onClick={handleWorkPlanApprove}
                            className="workplan-btn"
                            style={{ borderRadius: "25px", marginTop: "1px" }}
                          >
                            Approve
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => handleUpdateDialog()}
                            className="reject-btn"
                            style={{
                              marginTop: "-1px",
                              borderRadius: "25px",
                              borderColor: "#D70E0E",
                              height: "25px",
                              width: "100px",
                              paddingBottom: "4px",
                            }}
                          >
                            Reject
                          </button>
                        </div>
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
                          Scorecard Approved!
                        </p>
                      </div>
                    ) : (
                      <div
                        className="btn-saveWorkPlan"
                        style={{
                          display: "flex",
                          marginLeft: "40px",
                          marginTop: "-10px",
                          width: "400px",
                        }}
                      >
                        <p
                          style={{
                            borderRadius: "9px",
                            height: "25px",
                            width: "85%",
                            backgroundColor: "#69b33e",
                            paddingLeft: "19px",
                            fontWeight: "bold",
                          }}
                        >
                          Waiting for Amendment from Appraisee
                        </p>
                      </div>
                    )}
                  </div>

                  {/* <div
                    className="btn-saveWorkPlan"
                    style={{
                      display: "flex",
                      marginLeft: "670px",
                      marginTop: "-70px",
                    }}
                  >
                    {planStatus !== "Rejected" ? (
                      <>
                        <div>
                          <button
                            onClick={handleSubmitResultScorecardApprove}
                            className="workplan-btn"
                            style={{ borderRadius: "25px", marginTop: "1px" }}
                          >
                            Approve
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={handleWorkPlanReject}
                            className="reject-btn"
                            style={{
                              marginTop: "-1px",
                              borderRadius: "25px",
                              borderColor: "#D70E0E",
                              height: "25px",
                              width: "100px",
                              paddingBottom: "4px",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="btn-saveWorkPlan"
                        style={{
                          display: "flex",
                          marginLeft: "110px",
                          marginTop: "-10px",
                          width: "400px",
                        }}
                      >
                        <p>Waiting for Amendment from Appraisee</p>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
            </TabPanel>
          ))}
      </div>
    </>
  );
}
