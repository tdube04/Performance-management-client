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
  }, [userName, profileData]);

  useEffect(() => {
    console.log(profileData);
    if (profileData && profileData.appraiserEmail) {
      const responseAppraiser = axiosClient.get(`/searchUser?name=tdube1`);
      console.log(responseAppraiser.data);
    }
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

  useEffect(() => {
    const fetchData = async () => {
      const appraiseeWorkplanArray = [];
      if (profileData) {
        try {
          const response = await axiosClient.get("/scorecard/searchScorecard", {
            params: {
              period: evaluationPeriod,
              username: userName,
            },
          });
          console.log("Appraisee Scorecard");
          console.log(response.data);

          setResponseBody(response.data);
          if (
            response.data.content[0] &&
            response.data.content[0].areasOfPerformance
          ) {
            const areasOfPerformance =
              response.data.content[0].areasOfPerformance;
            console.log("performance Scorecard", areasOfPerformance);
            setPerformanceAreas(areasOfPerformance);
            console.log("performance Scorecard", performanceAreas);
            setPlanStatus(response.data.content[0].scorecardStatus);
            setTotalOveralWeightedScore(
              response.data.content[0].total_overal_weighted_score
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [profileData]);

  return (
    <React.Fragment>
      <div style={{ marginLeft: "30px" }}>
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
                  <span style={{ color: "#309366" }}>{evaluationPeriod}</span>
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
          <div style={{ position: "absolute", top: 60, right: 20 }}>
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
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                transition: "transform 0.1s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              INSTRUCTIONS
            </span>
          </div>
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
                {performanceAreas.map((area) => {
                  if (area.performanceArea) {
                    return (
                      <TableRow key={area.id}>
                        <TableCell>{area.section}</TableCell>
                        <TableCell>{area.performanceArea}</TableCell>
                        <TableCell>{area.weight}</TableCell>
                        <TableCell>{area.performance_area_score}</TableCell>
                      </TableRow>
                    );
                  } else {
                    return null;
                  }
                })}
                <TableRow>
                  <TableCell colSpan={3} style={{ fontWeight: "bold" }}>
                    Total Weighted Score
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color:
                          totalOveralWeightedScore >= 1 &&
                          totalOveralWeightedScore <= 2
                            ? "red"
                            : totalOveralWeightedScore >= 3 &&
                              totalOveralWeightedScore <= 3.9
                            ? "orange"
                            : totalOveralWeightedScore >= 4 &&
                              totalOveralWeightedScore <= 4.9
                            ? "green"
                            : totalOveralWeightedScore >= 5 &&
                              totalOveralWeightedScore <= 6
                            ? "blue"
                            : "inherit",
                      }}
                    >
                      {totalOveralWeightedScore}
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
              <b>Name of Appraisee :</b> {profileData && profileData.name} {""}{" "}
              {profileData && profileData.surname}
            </Typography>
            {/* <Typography>
              <b>Signature:</b> T. Dube
            </Typography> */}
            <Typography>
              <b>Date Submitted:</b>__________
            </Typography>
          </div>
          <div>
            <Typography>
              <b>Name of Appraiser :</b> __________
            </Typography>

            {/* <Typography>
              <b>Signature:</b> A. Muchoko{" "}
            </Typography> */}

            <Typography>
              <b>Date Approved:</b>__________
            </Typography>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
