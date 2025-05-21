import { MaterialReactTable } from "material-react-table";
import {
  citiesList,
  data,
  usStateList,
  getCurrentEvaluationPeriod,
} from "./makeData";

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import queryString from "query-string";

const EvaluatorFinalResultsScorecard = () => {
  const navigate = useNavigate();
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [workPlanData, setWorkPlanData] = useState([]);
  const [appraiseeProfileData, setAppraiseeProfileData] = useState([]);
  const [selectedUserWorkplan, setSelectedUserWorkplan] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const evaluationPeriod = getCurrentEvaluationPeriod();
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

  const getIncompleteAppraisee = async () => {
    try {
      const appraisees = profileData.appraisees;
      const appraiseeProfileDataArray = [];

      console.log("Appraisees names");
      console.log(appraisees);

      for (let i = 0; i < appraisees.length; i++) {
        const response = await axiosClient.get(
          `/User/{id}?id=${appraisees[i]}`
        );
        console.log("Appraisee profile");
        console.log(response.data);
        appraiseeProfileDataArray.push(response.data);
      }
      setAppraiseeProfileData(appraiseeProfileDataArray);
      console.log("Appraisees profile Info:", appraiseeProfileData);
    } catch (error) {
      console.error(error);
    }
  };
  const getIncompleteAppraiseeWorkplan = async () => {
    try {
      const appraisees = profileData.appraisees;
      const appraiseeWorkplanArray = [];

      for (let i = 0; i < appraisees.length; i++) {
        const response = await axiosClient.get(
          "/scorecard/searchScorecardByAppraisee",
          {
            params: {
              period: evaluationPeriod,
              scorecardStatus: "Approved",
              User_email: appraisees[i],
            },
          }
        );
        console.log("Appraisee Results Scorecard");
        appraiseeWorkplanArray.push(response.data);
        console.log(response.data);
        setWorkPlanData(appraiseeWorkplanArray);
        console.log(workPlanData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profileData) {
      getIncompleteAppraisee();
      getIncompleteAppraiseeWorkplan();
    }
  }, [profileData]);

  useEffect(() => {
    console.log(workPlanData);
  }, [workPlanData]);

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      filterVariant: "text",
      size: 100,
    },
    {
      accessorKey: "surname",
      header: "Surname",
      filterVariant: "text",
      size: 80,
    },

    {
      accessorKey: "positionName",
      header: "Position",
      filterVariant: "text",
      size: 80,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      filterVariant: "text",
      size: 80,
    },
    {
      accessorKey: "evaluationPeriod",
      header: "Evaluation Period",
      filterVariant: "text",
      size: 80,
    },
    {
      accessorKey: "scorecardStatus",
      header: "Scorecard Status",
      filterVariant: "text",
      size: 80,
      cellRenderer: (cellData) => {
        if (cellData === "ResultsScorecard") {
          return "Pending Scorecard";
        } else {
          return cellData;
        }
      },
    },
  ]);

  return (
    <div style={{ marginLeft: "100px" }}>
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
          Current Quater Approved Results Scorecard for Appraisees
        </Typography>
      </Paper>
      {appraiseeProfileData && workPlanData && (
        <MaterialReactTable
          columns={columns}
          enableRowSelection
          getRowSurname={(row) => row.surname}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          data={appraiseeProfileData
            .map((appraisee, index) => ({
              ...appraisee,
              evaluationPeriod: workPlanData[index]?.evaluationPeriod,
              scorecardStatus: workPlanData[index]?.scorecardStatus,
            }))
            .filter(
              (appraisee) => appraisee.scorecardStatus === "Approved"
            )}
          initialState={{ showColumnFilters: false }}
          muiTableBodyRowProps={({ row, index }) => ({
            onClick: (event) => {
              if (row.scorecardStatus === "Approved") {
                handleRowClick({
                  ...row,
                  scorecardStatus: "Pending Scorecard",
                });
              } else {
                // handleRowClick(row);
              }

              const selectedWorkplan = workPlanData.find(
                (workplan) => workplan.user_email === row.original.username
              );
              console.log(selectedWorkplan);

              setSelectedUserWorkplan(selectedWorkplan);

              const parsedWorkplanData = JSON.parse(
                JSON.stringify(selectedWorkplan)
              );
              const encodedWorkplanData = encodeURIComponent(
                JSON.stringify(parsedWorkplanData)
              );

              const queryParams = queryString.stringify({
                username: row.original.username,
                workplanData: encodedWorkplanData,
              });
              const workplanUrl = `/selected-approved-results-scorecard?${queryParams}`;
              navigate(workplanUrl);
            },
            sx: {
              cursor: "pointer",
            },
          })}
        />
      )}
    </div>
  );
};

export default EvaluatorFinalResultsScorecard;
