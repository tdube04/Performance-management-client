import React, { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Typography from "@mui/material/Typography";
import { FormControl, FormLabel } from "@mui/material";
// import Dropdown from "./Dropdown";
// import Signatures from "./Signatures";
import { TextField } from "@material-ui/core";
import axiosClient from "../../authentication/axios-client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useStateContext } from "../../context/ContextProvider";
import ArticleIcon from "@mui/icons-material/Article";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

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

// Generate Order Data
function createData(id, section, description, weight, weightedscore) {
  return { id, section, description, weight, weightedscore };
}

const rows = [
  createData(0, "A1", "Outcomes Evaluation", "30", "0.3", 312.44),
  createData(1, "A2", "Outputs Evaluation", "15", "0.7", 866.99),
  createData(2, "B", "Service Delivery Standards", "10", "2", 100.81),
  createData(
    3,
    "C",
    "Resources and Organization Capacity",
    "20",
    "1.4",
    654.39
  ),
  createData(4, "D", "Cross Cutting Priorities", "25", "0.8", 212.79),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function SummaryScores() {
  const [performanceAreas, setPerformanceAreas] = useState([]);
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [profileData, setProfileData] = useState(null);
  const [responseBody, setResponseBody] = useState(null);
  const [planStatus, setPlanStatus] = useState("");
  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();
  const [totalOveralWeightedScore, setTotalOveralWeightedScore] = useState(0);
  const navigate = useNavigate();
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [currentOpenQuarter, setCurrentOpenQuarter] = useState(null);
  const [periodMismatch, setPeriodMismatch] = useState(false);
  const [confirmedQuarter, setConfirmedQuarter] = useState(null);
  const [dismissedConfirmation, setDismissedConfirmation] = useState(false);
  
  // Store appraiser and evaluator names
  const [appraiserName, setAppraiserName] = useState("");
  const [evaluatorName, setEvaluatorName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);

        console.log("My Appraiser profile");
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

  // Fetch current open quarter from backend
  useEffect(() => {
    const fetchQuarterStatus = async () => {
      try {
        const response = await axiosClient.get("/evaluation_periods/current-status");
        const quarterData = response.data;
        
        if (quarterData.hasOpenQuarter && quarterData.currentQuarter) {
          setCurrentOpenQuarter(quarterData.currentQuarter);
          console.log("Current open quarter from backend:", quarterData.currentQuarter);
        } else {
          console.log("No open quarter found in backend");
        }
      } catch (error) {
        console.error("Error fetching quarter status:", error);
      }
    };

    fetchQuarterStatus();
  }, []);

  useEffect(() => {
    console.log(profileData);
    // This effect logs profile data changes - no additional API calls needed here
  }, [profileData]);

  // useEffect(() => {
  //   axiosClient.get("/Performance_Area/allAreas").then((response) => {
  //     setPerformanceAreas(response.data);
  //     console.log(response.data);
  //   });
  // }, []);

  let totalWeightedScore = 0;

  rows.forEach((row) => {
    const weightedScore = parseFloat(row.weightedscore);
    totalWeightedScore += weightedScore;
  });

  // Reset dismissed confirmation when quarter changes or when viewing a different quarter's scorecard
  useEffect(() => {
    if (confirmedQuarter && currentOpenQuarter && confirmedQuarter !== currentOpenQuarter) {
      // User is viewing a scorecard from a previous quarter - reset dismissed state
      setDismissedConfirmation(false);
    }
  }, [currentOpenQuarter, confirmedQuarter]);

  useEffect(() => {
    const fetchData = async () => {
      const appraiseeWorkplanArray = [];
      if (profileData) {
        try {
          // Use backend quarter if available, otherwise fall back to calendar-based period
          const periodToUse = currentOpenQuarter || evaluationPeriod;
          
          const response = await axiosClient.get("/scorecard/searchScorecard", {
            params: {
              period: periodToUse,
              username: userName,
            },
          });
          console.log("Appraisee Scorecard");
          console.log(response.data);

          setResponseBody(response.data);
          
          // Get appraiser name from the scorecard
          const scorecardData = response.data.content && response.data.content[0];
          if (scorecardData && scorecardData.appraiser) {
            try {
              const appraiserResponse = await axiosClient.get(`/User/{id}?id=${scorecardData.appraiser}`);
              if (appraiserResponse.data) {
                setAppraiserName(`${appraiserResponse.data.name || ''} ${appraiserResponse.data.surname || ''}`.trim());
              }
            } catch (e) {
              console.log("Could not fetch appraiser name:", e);
              setAppraiserName(scorecardData.appraiser);
            }
          }
          
          // Check if there's data for the current period
          if (
            response.data.content &&
            response.data.content.length > 0 &&
            response.data.content[0] &&
            response.data.content[0].areasOfPerformance
          ) {
            const scorecardPeriod = response.data.content[0].evaluationPeriod;
            
            // Check if the scorecard period matches the current open quarter
            if (currentOpenQuarter && scorecardPeriod !== currentOpenQuarter) {
              setPeriodMismatch(true);
              console.log("Period mismatch: scorecard period is", scorecardPeriod, "but current open quarter is", currentOpenQuarter);
            } else {
              setPeriodMismatch(false);
            }
            
            const areasOfPerformance =
              response.data.content[0].areasOfPerformance;
            console.log("performance Scorecard", areasOfPerformance);
            setPerformanceAreas(areasOfPerformance);
            console.log("performance Scorecard", performanceAreas);
            setPlanStatus(response.data.content[0].scorecardStatus);
            setTotalOveralWeightedScore(
              response.data.content[0].total_overal_weighted_score
            );
            console.log("Total Overall Weighted Score:", response.data.content[0].total_overal_weighted_score);
            setHasData(true);
            
            // Check if scorecard needs confirmation
            const status = response.data.content[0].scorecardStatus;
            const alreadyConfirmed = response.data.content[0].appraiseeConfirmed;
            
            // Track the quarter for which the scorecard was confirmed
            if (alreadyConfirmed) {
              setConfirmedQuarter(scorecardPeriod);
            }
            
            if ((status === "Approved" || status === "EvaluatorApproved") && !alreadyConfirmed) {
              setNeedsConfirmation(true);
            } else if (alreadyConfirmed) {
              setHasConfirmed(true);
            }
          } else {
            setHasData(false);
          }
        } catch (error) {
          console.error(error);
          setHasData(false);
        }
      }
    };

    fetchData();
  }, [profileData, currentOpenQuarter]);

  return (
    <React.Fragment>
      <div style={{ marginLeft: "30px" }}>
        {/* Confirmation Alert Banner */}
        {needsConfirmation && (
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: "#fff" }} />
              <div>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                  Scorecard Ready for Confirmation
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                  Your appraiser has approved your result scorecard. Please review and confirm acceptance.
                </Typography>
              </div>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate("/confirm-scorecard")}
              sx={{
                backgroundColor: "#fff",
                color: "#667eea",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  transform: "scale(1.05)"
                }
              }}
            >
              Confirm Now
            </Button>
          </div>
        )}

        {/* Already Confirmed Banner - Only show when scorecard matches current open quarter and not dismissed */}
        {hasConfirmed && !periodMismatch && currentOpenQuarter && confirmedQuarter === currentOpenQuarter && !dismissedConfirmation && (
          <div style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CheckCircleIcon sx={{ fontSize: 32, color: "#fff" }} />
              <div>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                  Scorecard Confirmed
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                  Your result scorecard has been confirmed and forwarded to Human Capital for processing.
                </Typography>
              </div>
            </div>
            <IconButton
              onClick={() => setDismissedConfirmation(true)}
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}

        {/* No Data or Period Mismatch Message */}
        {(hasData || periodMismatch) && (
          <div style={{
            backgroundColor: !hasData || periodMismatch ? '#fff3e0' : 'transparent',
            border: '1px solid #ff9800',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            textAlign: 'center',
            display: hasData && !periodMismatch ? 'none' : 'block'
          }}>
            <Typography variant="h6" color="warning" gutterBottom>
              {periodMismatch ? 'Period Mismatch' : 'No Scorecard Data'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {periodMismatch 
                ? `Scorecard data is from ${responseBody?.content?.[0]?.evaluationPeriod}, but current quarter is ${currentOpenQuarter}. Total shown may be from different period.`
                : `No scorecard found for ${currentOpenQuarter || evaluationPeriod}. Submit performance data first.`}
              <br/><strong>Debug: hasData={String(hasData)}, periodMismatch={String(periodMismatch)}, total={totalOveralWeightedScore?.toFixed(2) ?? 'null'}</strong>
            </Typography>
          </div>
        )}

        <Typography
          variant="h5"
          align="center"
          fontWeight={"bold"}
          color="darkgreen"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginLeft: "10px",
          }}
        >
          Summary Scores IRBM Performance Contract Evaluation
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "10px",
            marginTop: "50px",
          }}
        >
          <Title
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              padding: "20px",
              marginTop: "50px",
            }}
          >
            <Typography>Current Quarter Summary Scores</Typography>
          </Title>
          <div
            style={{ marginLeft: "15px", marginTop: "10px", display: "flex" }}
          >
            <div style={{ marginRight: "20px" }}>
              <Typography className="" sx={{ fontSize: 12 }}>
                <strong>
                  Current Year Of Assessment:{" "}
                  <span style={{ color: "#309366" }}>
                    {currentOpenQuarter || evaluationPeriod}
                  </span>
                </strong>
              </Typography>
            </div>
            <div>
              <Typography className="" sx={{ fontSize: 12 }}>
                <strong>
                  Current Quarter Ends In:{" "}
                  <span style={{ color: "#f44336" }}>{daysRemaining} days</span>
                </strong>
              </Typography>
            </div>
          </div>
          {/* <div style={{ position: "absolute", top: 60, right: 20 }}>
            <ArticleIcon
              sx={{
                color: "#309366",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "",
                  transform: "scale(1.3)",
                },
              }}
            />{" "}
    
          </div> */}
          <FormControl
            style={{
              //   boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              //   borderRadius: "10px",
              padding: "20px",
              marginTop: "15px",
            }}
          >
            {/* <Dropdown /> */}
          </FormControl>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            marginTop: "5px",
          }}
        >
          <Typography>
            Results Scorecard Status:{" "}
            <span
              style={{
                color:
                  planStatus === "WorkingScorecard"
                    ? "orange"
                    : planStatus === "ResultsScorecard"
                    ? "orange"
                    : "green",
              }}
            >
              {planStatus === "WorkingScorecard"
                ? "Not yet submitted for Approval"
                : planStatus === "ResultsScorecard"
                ? "Pending Approval"
                : planStatus}
            </span>
          </Typography>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ width: "900px" }}>
            {" "}
            <Table size="extra large" style={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Section</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Weight (%)
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Weighted Score
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
{performanceAreas.map((area, index) => area.performanceArea && (
                    <TableRow key={area.id || index}>
                      <TableCell>{area.section || 'N/A'}</TableCell>
                      <TableCell>{area.performanceArea}</TableCell>
                      <TableCell>{(area.weight || 0).toFixed(0)}%</TableCell>
                      <TableCell>{(area.performance_area_score || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: "center", color: "#999" }}>
                        No performance areas data available
                      </TableCell>
                    </TableRow>
                  )}
                <TableRow>
                  <TableCell colSpan={3} style={{ fontWeight: "bold" }}>
                    Total Weighted Score
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: totalOveralWeightedScore >= 5 ? "blue" :
                          totalOveralWeightedScore >= 4 ? "green" :
                          totalOveralWeightedScore >= 3 ? "orange" :
                          totalOveralWeightedScore >= 1 ? "red" : "gray",
                      }}
                    >
{totalOveralWeightedScore?.toFixed(2) ?? "0.00"}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div
            style={{
              marginLeft: "50px",
            }}
          >
            {" "}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "darkblue",
                  marginRight: "5px",
                }}
              ></div>
              <span>6 - Clearly exceeds set targets beyond variance</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "blue",
                  marginRight: "5px",
                }}
              ></div>
              <span>5- Performance above set targets but within variance</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "green",
                  marginRight: "5px",
                }}
              ></div>
              <span>4 - Met all agreed set targets</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "orange",
                  marginRight: "5px",
                }}
              ></div>
              <span>3 - Performance below set targets but within variance</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  marginRight: "5px",
                }}
              ></div>
              <span>2 - Performance below set targets and below variance</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  marginRight: "5px",
                }}
              ></div>
              <span>1 - Nothing was accomplished</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            marginLeft: "95px",
            marginTop: "50px",
          }}
        >
          <div>
            <Typography
              style={{
                color: "green",
                fontWeight: "bold",
                marginLeft: "200px",
              }}
            >
              Summary Scores IRBM Performance Contract Evaluation
            </Typography>

            <Typography>
              <b>Name of Appraisee :</b> {(profileData && (profileData.name || profileData.surname)) 
                ? `${profileData.name || ''} ${profileData.surname || ''}`.trim()
                : (responseBody && responseBody.content && responseBody.content[0] && responseBody.content[0].user_email
                  ? responseBody.content[0].user_email
                  : "__________")}
            </Typography>
            {/* <Typography>
              <b>Signature:</b> T. Dube
            </Typography> */}
            <Typography>
              <b>Date Submitted:</b> {responseBody && responseBody.content && responseBody.content[0] && responseBody.content[0].dateSubmitted 
                ? new Date(responseBody.content[0].dateSubmitted).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                : "__________"}
            </Typography>
          </div>
          <div>
            <Typography>
              <b>Name of Appraiser :</b> {appraiserName || (responseBody && responseBody.content && responseBody.content[0] && responseBody.content[0].appraiser) || "__________"}
            </Typography>

            {/* <Typography>
              <b>Signature:</b> A. Muchoko{" "}
            </Typography> */}

            <Typography>
              <b>Date Approved:</b> {responseBody && responseBody.content && responseBody.content[0] && responseBody.content[0].dateApproved 
                ? new Date(responseBody.content[0].dateApproved).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                : "__________"}
            </Typography>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
