import React, { useState, useEffect, useRef, useMemo } from "react";

import Card from "@mui/material/Card";
import Widgets from "../../components/Widgets/Widgets";
import axiosClient from "../../authentication/axios-client";
import { MaterialReactTable } from "material-react-table";
import Paper from "@mui/material/Paper";
import { useStateContext } from "../../context/ContextProvider";
import Typography from "@mui/material/Typography";
import { darken } from "@mui/material";

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

export default function AdminHomePage() {
  const [data, setData] = useState([]);

  const [appraiseeProfileData, setAppraiseeProfileData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [numberOfStaff, setNumberOfStaff] = useState(0);
  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  useEffect(() => {
    axiosClient.get("/getAllUsers").then((response) => {
      setAppraiseeProfileData(response.data);
      setNumberOfStaff(response.data.length);
      console.log(response.data);
    });
  }, []);
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
      accessorKey: "divisionName",
      header: "Division",
      filterVariant: "text",
      size: 80,
    },
    {
      accessorKey: "ec_number",
      header: "EC Number",
      filterVariant: "text",
      size: 80,
      cellRenderer: ({ value }) => {
        if (value === "pendingApproval") {
          return "Pending Approval";
        } else {
          return value;
        }
      },
    },
  ]);

  return (
    <>
      <div className="widgets">
        <Widgets numberOfStaff={numberOfStaff} />
      </div>

      {/* <div className="listContainer">
        <div className="listTitle">All Users</div>
      </div> */}
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
            Current Quarter Staff Members
          </Typography>
        </Paper>
        {appraiseeProfileData && (
          <MaterialReactTable
            columns={columns}
            enableRowSelection
            getRowSurname={(row) => row.surname}
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
            data={appraiseeProfileData}
            initialState={{ showColumnFilters: false }}
            muiTableBodyRowProps={({ row, index }) => ({
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
                  backgroundColor: darken(
                    theme.palette.background.default,
                    0.1
                  ),
                },
              }),
            }}
          />
        )}
      </div>
      <div style={{ marginLeft: "290px", marginTop: "25px", display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
          <Typography className="" sx={{ fontSize: 15 }}>
            <strong>
              Current Year Of Assessment:{" "}
              <span style={{ color: "#309366" }}>{evaluationPeriod}</span>
            </strong>
          </Typography>
        </div>
        <div>
          <Typography className="" sx={{ fontSize: 15 }}>
            <strong>
              Current Quarter Ends In:{" "}
              <span style={{ color: "#f44336" }}>{daysRemaining} days</span>
            </strong>
          </Typography>
        </div>
      </div>
    </>
  );
}
