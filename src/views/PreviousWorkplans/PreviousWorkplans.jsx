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
import { darken } from "@mui/material";

const PreviousWorkplans = () => {
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
  const [planStatus, setPlanStatus] = useState("Pending Approval");

  const evaluationPeriod = getCurrentEvaluationPeriod();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
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

  const getAppraiser = async () => {
    try {
      const appraisees = profileData.appraisees;
      const appraiseeProfileDataArray = [];

      console.log("Appraisees names");
      console.log(appraisees);

      for (let i = 0; i < appraisees.length; i++) {
        const response = await axiosClient.get(
          `/User/${appraisees[i]}`
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
  const geAppraiseeWorkplans = async () => {
    try {
      const appraiseeWorkplanArray = [];
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      const currentYear = new Date().getFullYear();
      const futureYears = [];
      for (let year = 2023; year <= currentYear + 10; year++) {
        futureYears.push(year);
      }
      const periods = futureYears.flatMap((year) =>
        quarters.map((quarter) => `${year}-${quarter}`)
      );
      const statuses = [
        "Approved",
        "Incomplete",
        "Rejected",
        "pendingApproval",
      ];
     console.log(evaluationPeriod);

      for (const status of statuses) {
        const response = await axiosClient.get(
          "/workplan/searchWorkplanByAppraisee",
          {
            params: {
              period: getCurrentEvaluationPeriod().evaluationPeriod,
              planStatus: status,
              User_email: userName,
            },
          }
        );

        if (response.data && Object.keys(response.data).length !== 0) {
          appraiseeWorkplanArray.push(response.data);
        }
      }

      console.log("Appraisee workplans");
      console.log(appraiseeWorkplanArray);

      setWorkPlanData(appraiseeWorkplanArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(workPlanData);
  }, [workPlanData]);

  useEffect(() => {
    if (profileData) {
      // getIncompleteAppraisee();
      geAppraiseeWorkplans();
    }
  }, [profileData]);

  const columns = useMemo(() => [
    {
      accessorKey: "appraiser_email",
      header: "Appraiser Email",
      filterVariant: "text",
      size: 250,
    },
    {
      accessorKey: "evaluationPeriod",
      header: "Evaluation Period",
      filterVariant: "text",
      size: 250,
    },
    {
      accessorKey: "workplanStatus",
      header: "Workplan Status",
      filterVariant: "text",
      size: 250,
    },
  ]);

  return (
    <div style={{ marginLeft: "240px" }}>
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
         Repository For Previous Workplans
        </Typography>
      </Paper>
      {workPlanData && (
        <MaterialReactTable
          columns={columns}
          enableRowSelection
          getRowSurname={(row) => row.surname}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          data={workPlanData}
          initialState={{ showColumnFilters: false }}
          muiTableBodyRowProps={({ row, index }) => ({
            onClick: (event) => {
              const selectedWorkplan = workPlanData.find(
                (workplan) => workplan.user_email === userName
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
              const workplanUrl = `/selected-repository-workplan?${queryParams}`;
              navigate(workplanUrl);
            },
            sx: {
              cursor: "pointer",
            },
          })}
          muiTablePaperProps={{
            elevation: 0,

            sx: {
              borderRadius: "0",

              border: "1px dashed #e0e0e0",
            },
          }}
          muiTableBodyProps={{
            sx: (theme) => ({
              "& tr:nth-of-type(odd)": {
                backgroundColor: darken(theme.palette.background.default, 0.1),
              },
            }),
          }}
        />
      )}
    </div>
  );
};
export default PreviousWorkplans;
