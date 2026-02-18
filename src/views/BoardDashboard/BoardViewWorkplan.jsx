import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import Chip from "@material-ui/core/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useGmailTabItemStyles } from "@mui-treasury/styles/tabs";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function Row({
  program,
  area,
  planStatus,
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const handleIndicatorDialog = (indicator) => {
    setSelectedIndicator(indicator);
    setModalOpen(true);
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
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{ color: "#16160E", fontWeight: 550 }}
        >
          {program.Name}
        </TableCell>
        <TableCell align="center">{program.Weight}</TableCell>
        <TableCell align="center">{currentYear}</TableCell>
        <TableCell align="center">{program.indicators?.length || 0}</TableCell>
      </TableRow>
      <TableRow style={{ maxWidth: "80%" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="caption" gutterBottom component="div">
                Program Indicators
              </Typography>
              <Table size="medium" aria-label="indicators" style={{ maxWidth: "100%" }}>
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
                      Annual Target
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Quarterly Target
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.indicators &&
                    program.indicators.map((indicator, index) => (
                      <TableRow key={index}>
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
                            size="small"
                            onClick={() => handleIndicatorDialog(indicator)}
                          >
                            <InfoIcon
                              sx={{ fontSize: "20px", color: "blue" }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Indicator Details Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
              <InfoIcon sx={{ fontSize: "15px", color: "blue" }} /> Indicator
              Details
            </Typography>
          </div>

          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                width: "100%",
              }}
            >
              <div>
                <strong>Name:</strong> {selectedIndicator?.description}
              </div>
              <div>
                <strong>Weight:</strong> {selectedIndicator?.weight}
              </div>
              <div>
                <strong>Unit:</strong> {selectedIndicator?.measurement_unit}
              </div>
              <div>
                <strong>Type:</strong>{" "}
                {selectedIndicator?.incremental_or_decremental}
              </div>
              <div>
                <strong>Annual Target:</strong>{" "}
                {selectedIndicator?.annual_target}
              </div>
              <div>
                <strong>Quarterly Target:</strong>{" "}
                {selectedIndicator?.quarterly_target}
              </div>
              <div>
                <strong>Variance:</strong> {selectedIndicator?.allowable_variance}
              </div>
              <div>
                <strong>Division:</strong>{" "}
                {selectedIndicator?.responsibleDivision}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Row.propTypes = {
  program: PropTypes.object.isRequired,
};

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let quarter;
  let daysRemaining;
  let dateRange;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    dateRange = `01 January - 31 March ${currentYear}`;
    const endOfQuarter = new Date(currentYear, 2, 31);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    dateRange = `01 April - 30 June ${currentYear}`;
    const endOfQuarter = new Date(currentYear, 5, 30);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    dateRange = `01 July - 30 September ${currentYear}`;
    const endOfQuarter = new Date(currentYear, 8, 30);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    dateRange = `01 October - 31 December ${currentYear}`;
    const endOfQuarter = new Date(currentYear, 11, 31);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    dateRange: dateRange,
    daysRemaining: daysRemaining,
  };
};

export default function BoardViewWorkplan() {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const workplan = location.state?.workplan;

  const [value, setValue] = React.useState(0);
  const [performanceAreas, setPerformanceAreas] = React.useState([]);
  const [planStatus, setPlanStatus] = useState("");
  const [clickedComment, setClickedComment] = useState(false);

  const { evaluationPeriod, dateRange, daysRemaining } = getCurrentEvaluationPeriod();

  const tabItem3Styles = useGmailTabItemStyles({
    color: "#188038",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (workplan) {
      setPerformanceAreas(workplan.areasOfPerformance || []);
      setPlanStatus(workplan.workplanStatus);
    }
  }, [workplan]);

  if (!workplan) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          No workplan data found. Please select a workplan to view.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/board-dashboard/workplan-approvals")}
          sx={{ mt: 2 }}
        >
          Back to Workplans
        </Button>
      </Box>
    );
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

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
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 2 }}>
          <strong style={{ marginLeft: "145px", textAlign: "center" }}>
            WORKPLAN DETAILS
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

      {clickedComment && workplan.statusComments && (
        <div
          className="comment-container"
          style={{
            marginLeft: 150,
            marginTop: 10,
            textAlign: "center",
            width: "1000px",
            backgroundColor: "#fff3cd",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          <Typography variant="caption">
            <strong>Board Comments:</strong> {workplan.statusComments}
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
            aria-label="performance areas tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {performanceAreas &&
              performanceAreas.map((area, index) => (
                <Tab
                  classes={tabItem3Styles}
                  key={index}
                  label={area && area.PerformanceArea}
                  sx={{
                    fontSize: 12,
                    color: "black",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                />
              ))}
          </Tabs>
        </Box>

        {performanceAreas.map((area, index) => (
          <TabPanel key={index} value={value} index={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                {area && area.section} - IRBM {area && area.PerformanceArea} (
                <span style={{ color: "green" }}>{area && area.weight}%</span>)
              </h6>
              <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                Workplan Status:{" "}
                <Chip
                  label={
                    planStatus === "pendingApproval"
                      ? "Pending Approval"
                      : planStatus
                  }
                  color={
                    planStatus === "pendingApproval"
                      ? "warning"
                      : planStatus === "Approved"
                      ? "success"
                      : "error"
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
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
                        area.programs.map((program, programIndex) => (
                          <Row
                            key={programIndex}
                            program={program}
                            area={area}
                            planStatus={planStatus}
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>

            <br />

            {/* Single Elegant Card with All Details */}
            <Card sx={{ 
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)", 
              borderRadius: "8px", 
              border: "1px solid #f5f5f5",
              marginBottom: "50px"
            }}>
              <CardContent sx={{ padding: "40px" }}>
                {/* Evaluation Period - Subtle Header */}
                <Typography style={{ fontSize: "12px", fontWeight: "600", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                  Current Evaluation Period
                </Typography>
                <Typography style={{ fontSize: "18px", fontWeight: "500", color: "#309366", marginBottom: "32px" }}>
                  {dateRange}
                </Typography>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "#f0f0f0", marginBottom: "32px" }}></div>

                {/* Appraisee and Appraiser in Single Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "40px" }}>
                  
                  {/* Appraisee */}
                  <div>
                    <Typography style={{ fontSize: "11px", fontWeight: "700", color: "#ccc", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                      Appraisee
                    </Typography>
                    
                    <div style={{ marginBottom: "24px" }}>
                      <Typography style={{ fontSize: "11px", fontWeight: "600", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        Name
                      </Typography>
                      <Typography style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
                        {workplan.user_email || "_______________"}
                      </Typography>
                    </div>

                    <div>
                      <Typography style={{ fontSize: "11px", fontWeight: "600", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        Date Submitted
                      </Typography>
                      <Typography style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
                        {workplan.dateSubmitted ? new Date(workplan.dateSubmitted).toLocaleDateString() : "_______________"}
                      </Typography>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div style={{ backgroundColor: "#f0f0f0", width: "1px", minHeight: "100%" }}></div>

                  {/* Appraiser */}
                  <div>
                    <Typography style={{ fontSize: "11px", fontWeight: "700", color: "#ccc", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                      Appraiser
                    </Typography>
                    
                    <div style={{ marginBottom: "24px" }}>
                      <Typography style={{ fontSize: "11px", fontWeight: "600", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        Name
                      </Typography>
                      <Typography style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
                        {workplan.evaluator_email || "_______________"}
                      </Typography>
                    </div>

                    <div>
                      <Typography style={{ fontSize: "11px", fontWeight: "600", color: "#bbb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        Date Approved
                      </Typography>
                      <Typography style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
                        {workplan.dateApproved ? new Date(workplan.dateApproved).toLocaleDateString() : "_______________"}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Title and Divider */}
            <div style={{ marginTop: "50px", marginBottom: "30px", paddingBottom: "16px", borderBottom: "1px solid #e0e0e0" }}>
              <Typography style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>
                {area.section} : Delivery of Mandates / Operations in the Agency
              </Typography>
              <Typography style={{ fontSize: "14px", color: "#666", marginTop: "6px" }}>
                Integrated Performance Agreement - Evaluation of Outcomes
              </Typography>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/board-dashboard/workplan-approvals")
                }
                sx={{
                  backgroundColor: "#1a237e",
                  borderRadius: "25px",
                  textTransform: "none",
                  padding: "8px 30px",
                }}
              >
                Back to Workplans
              </Button>
            </div>
          </TabPanel>
        ))}
      </div>
    </>
  );
}
