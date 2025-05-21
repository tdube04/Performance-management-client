import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client";
import CircularProgress from "@mui/material/CircularProgress";

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  let quarter;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }

  return `${currentYear}-${quarter}`;
};

export default function SelectedIncompleteWorkPlan() {
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [workPlanData, setWorkPlanData] = useState([]);
  const [appraiseeProfileData, setAppraiseeProfileData] = useState([]);
  const [selectedUserWorkplan, setSelectedUserWorkplan] = useState([]);

  const evaluationPeriod = getCurrentEvaluationPeriod();

  const getIncompleteAppraisee = async () => {
    try {
      const appraisees = profileData.appraisees;
      for (let i = 0; i < appraisees.length; i++) {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        console.log("Appraisee profile");
        console.log(response.data);
        setAppraiseeProfileData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getIncompleteAppraiseeWorkplan = async () => {
    try {
      const appraisees = profileData.appraisees;
      for (let i = 0; i < appraisees.length; i++) {
        const response = await axiosClient.get(
          "/workplan/searchWorkplanByUser",
          {
            params: {
              period: evaluationPeriod,
              planStatus: "Incomplete",
              User_email: appraisees[i],
            },
          }
        );
        console.log("Appraisee workplan");
        console.log(response.data);
        setWorkPlanData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      getIncompleteAppraiseeWorkplan();
    }
  }, [profileData]);

  useEffect(() => {
    if (profileData) {
      getIncompleteAppraisee();
    }
  }, [profileData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  const handleWorkPlanClick = (workplan, workplanIndex) => {
    console.log("Workplan clicked", workplan);
    setSelectedUserWorkplan(workplan);
  };
  return (
    <Box
      sx={{
        display: "grid",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 1200,
          height: 60,
        },
      }}
    >
      {" "}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <Typography
          variant="caption"
          sx={{ textAlign: "center", fontSize: "17px" }}
        >
          Year of Assessment: 2023
        </Typography>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", fontSize: "17px" }}
        >
          Current Quarter
        </Typography>
      </Paper>
      <Paper
        elevation={3}
        sx={{ display: "flex", backgroundColor: "green", width: "100%" }}
      >
        <Typography
          variant="body2"
          sx={{ mt: 2, color: "white", fontWeight: "bold" }}
        >
          Name
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, ml: 35, color: "white", fontWeight: "bold" }}
        >
          EC Number
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, ml: 35, color: "white", fontWeight: "bold" }}
        >
          Title
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, ml: 35, color: "white", fontWeight: "bold" }}
        >
          Status
        </Typography>
      </Paper>
      {appraiseeProfileData &&
        appraiseeProfileData.map((profile, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ display: "flex", width: "100%" }}
          >
            <Typography variant="body2" sx={{ mt: 2 }}>
              {appraiseeProfileData.name} {appraiseeProfileData.surname}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, ml: 30 }}>
              {appraiseeProfileData.ec_number}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, ml: 30 }}>
              {appraiseeProfileData.grade}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, ml: 30, color: "brown" }}>
              {appraiseeProfileData.positionName}
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
