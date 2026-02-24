import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";

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
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
import { useStateContext } from "../../context/ContextProvider";

function Row({ program }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  console.log(program.name);
  console.log("Total indicators: ", program.indicators.length);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

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
                      Annual Target for {currentYear}(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Target for {currentYear}(%)
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
    currentYear: currentYear,
    daysRemaining: daysRemaining,
  };
};

export default function IncompleteWorkPlan() {
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
  const [selectedPerfomance, setSelectedPerfomance] = useState([]);
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState("");
  const [selectedProgramIndex, setSelectedProgramIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();
  const [workplanStatus, setWorkplanStatus] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const [selectedAppraisee, setSelectedAppraisee] = useState("");
  const [workpanIda, setWorkpanIda] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();

  const reasonRef = useRef(null);

  const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];

  const tabItem3Styles = useGmailTabItemStyles({ color: indicatorColors[2] });

  const handleUpdateDialog = () => {
    setModalOpen(true);
  };
  const handleWorkplanStatusChange = (event) => {
    setWorkplanStatus(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const getIncompleteAppraiseeWorkplan = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userName = urlParams.get("username");
      const workplanParsed = urlParams.get("workplanData");

      const decodedWorkplanData = JSON.parse(
        decodeURIComponent(workplanParsed)
      );

      console.log(decodedWorkplanData);

      setPerformanceAreas(decodedWorkplanData.areasOfPerformance);
      console.log(decodedWorkplanData.areasOfPerformance);
      setPlanStatus(decodedWorkplanData.workplanStatus);
      setSelectedAppraisee(decodedWorkplanData.user_email);
      setWorkpanIda(decodedWorkplanData.id);
    } catch (error) {
      console.error(error);
    }
  };
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
    getIncompleteAppraiseeWorkplan();
  }, []);

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);
    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);
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

  const submitWorkPlan = (e) => {
    e.preventDefault();

    const workplan = {
      appraiser_email: "tdube1",
      areasOfPerformance: performanceAreas,
      user_email: userName, //muchoko
      evaluator_email: "pmuleya",
      evaluationPeriod: evaluationPeriod,
      workplanStatus: "Approved",
    };
    // [
    //   {
    //     description: "Outputs Evaluation",
    //     percent: 30,
    //     performanceArea: "Outputs Evaluation",
    //     programs: [
    //       {
    //         contributedPillar: {
    //           current_date: "2023-05-03",
    //           description: "string",
    //           pillar: "Pillar",
    //         },
    //         indicators: [
    //           {
    //             allowable_variance: 10,
    //             annual_target: 20,
    //             description: "Collection of revenue",
    //             measurement_unit: "%",
    //             previous_year_Perfomenace: 540,
    //             quarterly_target: 40,
    //             weight: 4,
    //           },
    //         ],
    //         name: "Managing within the budget 2",
    //         weight: 15,
    //       },
    //     ],
    //     section: "A1",
    //     weight: 30,
    //   },
    // ],​/workplan​/approveWorkplan​/${workpanId}`

    axiosClient.post("workplan/save", workplan).then((res) => {
      console.log(res);
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
        navigate("/approved");
      });
  };
  const handleWorkPlanReject = (event) => {
    event.preventDefault();
    const reason = reasonRef.current.value;

    if (!reason) {
      setMessage("Rejection Reason is Required");
      return;
    }

    console.log(reason);

    if (workpanIda === 0) {
      // Handle the case when workpanIda is not set
      console.error("workpanIda is not set");
      return;
    }
    axiosClient
      .get(
        `/workplan/disapproveWorkplan/{id}?id=${workpanIda}&message=${reason}`
      )
      .then((res) => {
        console.log(res);
        swal({
          text: `You have Rejected Workplan for ${selectedAppraisee}`,
          icon: "success",
          button: "OK",
        });
        // navigate("/rejected");
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
            WORK PLAN FOR : {selectedAppraisee}
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
                  Workplan Status:{" "}
                  {planStatus === "PendingApproval"
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
                            Evaluation Period
                          </TableCell>

                          <TableCell align="center">
                            Total Number of Indicators
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {area.programs &&
                          area.programs.map((program, index) => (
                            <Row key={index} program={program} />
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

                  {/* <div
                    className="btn-saveWorkPlan"
                    style={{
                      display: "flex",
                      marginLeft: "670px",
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
                          WorkPlan Approved!
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
                  </div> */}
                </div>
              </div>
            </TabPanel>
          ))}
      </div>
    </>
  );
}
