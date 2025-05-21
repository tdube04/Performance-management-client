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

const Rejected = () => {
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
          "/workplan/searchWorkplanByAppraisee",
          {
            params: {
              period: evaluationPeriod,
              planStatus: "Rejected",
              User_email: appraisees[i],
            },
          }
        );
        console.log("Appraisee workplan Approved");
        appraiseeWorkplanArray.push(response.data);
        console.log(response.data);
        setWorkPlanData(appraiseeWorkplanArray);
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
      accessorKey: "workplanStatus",
      header: "Workplan Status",
      filterVariant: "text",
      size: 80,
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
          Current Quater Rejected Workplans for Appraisees
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
              workplanStatus: workPlanData[index]?.workplanStatus,
            }))
            .filter(
              (appraisee, index) =>
                workPlanData[index]?.workplanStatus === "Rejected"
            )}
          initialState={{ showColumnFilters: false }}
          muiTableBodyRowProps={({ row, index }) => ({
            onClick: (event) => {
              // handleRowClick(row);

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
              const workplanUrl = `/selected-incomplete-workplan?${queryParams}`;
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
export default Rejected;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import { useStateContext } from "../../context/ContextProvider";
// import axiosClient from "../../authentication/axios-client";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import IconButton from "@mui/material/IconButton";
// import Grid from "@mui/material/Grid";
// import queryString from "query-string";

// const getCurrentEvaluationPeriod = () => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

//   let quarter;

//   if (currentMonth >= 1 && currentMonth <= 3) {
//     quarter = "Q1";
//   } else if (currentMonth >= 4 && currentMonth <= 6) {
//     quarter = "Q2";
//   } else if (currentMonth >= 7 && currentMonth <= 9) {
//     quarter = "Q3";
//   } else {
//     quarter = "Q4";
//   }

//   return `${currentYear}-${quarter}`;
// };

// export default function Rejected() {
//   const navigate = useNavigate();
//   const {
//     userName,
//     setUserName,
//     userType,
//     setUserType,
//     token,
//     setToken,
//   } = useStateContext();
//   const [profileData, setProfileData] = useState(null);
//   const [error, setError] = useState(null);
//   const [workPlanData, setWorkPlanData] = useState([]);
//   const [appraiseeProfileData, setAppraiseeProfileData] = useState([]);
//   const [selectedUserWorkplan, setSelectedUserWorkplan] = useState([]);

//   const evaluationPeriod = getCurrentEvaluationPeriod();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosClient.get(`/User/{id}?id=${userName}`);
//         setProfileData(response.data);
//         console.log("My Appraiser profile");
//         console.log(response.data);
//       } catch (error) {
//         setError(error.message);
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, [userName]);

//   const getIncompleteAppraisee = async () => {
//     try {
//       const appraisees = profileData.appraisees;
//       const appraiseeProfileDataArray = [];

//       console.log("Appraisees names");
//       console.log(appraisees);

//       for (let i = 0; i < appraisees.length; i++) {
//         const response = await axiosClient.get(
//           `/User/{id}?id=${appraisees[i]}`
//         );
//         console.log("Appraisee profile");
//         console.log(response.data);
//         appraiseeProfileDataArray.push(response.data);
//       }
//       setAppraiseeProfileData(appraiseeProfileDataArray);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const getIncompleteAppraiseeWorkplan = async () => {
//     try {
//       const appraisees = profileData.appraisees;
//       const appraiseeWorkplanArray = [];

//       for (let i = 0; i < appraisees.length; i++) {
//         const response = await axiosClient.get(
//           "/workplan/searchWorkplanByAppraisee",
//           {
//             params: {
//               period: evaluationPeriod,
//               planStatus: "Rejected",
//               User_email: appraisees[i],
//             },
//           }
//         );
//         console.log("Appraisee workplan Approved");
//         appraiseeWorkplanArray.push(response.data);
//         console.log(response.data);
//         setWorkPlanData(appraiseeWorkplanArray);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (profileData) {
//       getIncompleteAppraisee();
//       getIncompleteAppraiseeWorkplan();
//     }
//   }, [profileData]);

//   // useEffect(() => {
//   //   if (profileData) {
//   //     getIncompleteAppraisee();
//   //   }
//   // }, [profileData]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!profileData) {
//     return <div>Loading...</div>;
//   }
//   const handleWorkPlanClick = (
//     workplan,
//     appraiseeClicked,
//     workplanIndex,
//     event
//   ) => {
//     event.preventDefault();
//     console.log("Workplan clicked", workplan);
//     setSelectedUserWorkplan(workplan);

//     const parsedWorkplanData = JSON.parse(JSON.stringify(workplan));
//     const encodedWorkplanData = encodeURIComponent(JSON.stringify(parsedWorkplanData));

//     const queryParams = queryString.stringify({
//       username: appraiseeClicked,
//       workplanData: encodedWorkplanData,
//     });
//     const workplanUrl = `/selected-incomplete-workplan?${queryParams}`;
//     navigate(workplanUrl);
//     // const parsedWorkplanData = JSON.parse(JSON.stringify(selectedUserWorkplan));
//     // const workplanUrl = `/selected-incomplete-workplan?username=${appraiseeClicked}`;

//     // window.location.href = workplanUrl;
//   };
//   return (
//     <Box
//       sx={{
//         display: "grid",
//         flexWrap: "wrap",
//         "& > :not(style)": {
//           ml: 15,
//           width: 920,
//           height: 60,
//         },
//       }}
//     >
//       {" "}
//       <Paper
//         elevation={0}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "white",
//           width: "100%",
//         }}
//       >
//         <Typography
//           variant="caption"
//           sx={{ textAlign: "center", fontSize: "17px" }}
//         >
//           Year of Assessment: 2023
//         </Typography>
//         <Typography
//           variant="caption"
//           sx={{ textAlign: "center", fontSize: "17px" }}
//         >
//           Current Quarter
//         </Typography>
//       </Paper>
//       <Paper
//         elevation={3}
//         sx={{ display: "flex", backgroundColor: "green", width: "100%", p: 2 }}
//       >
//         <Typography
//           variant="body2"
//           sx={{ color: "white", fontWeight: "bold", p: 2 }}
//         >
//           Name
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{ ml: 35, color: "white", fontWeight: "bold", p: 2 }}
//         >
//           Period
//         </Typography>

//         <Typography
//           variant="body2"
//           sx={{ ml: 35, color: "white", fontWeight: "bold", p: 2 }}
//         >
//           Status
//         </Typography>
//       </Paper>
//       {workPlanData &&
//         workPlanData.map((workplan, index) => (
//           <Paper
//             elevation={3}
//             sx={{ display: "flex", width: "100%" }}
//             onClick={(event) =>
//               handleWorkPlanClick(workplan, workplan.user_email, index, event)
//             }
//           >
//             <Typography variant="body2" sx={{ mt: 2 }}>
//               {workplan.user_email}
//             </Typography>
//             <Typography variant="body2" sx={{ mt: 2, ml: 30 }}>
//               {workplan.evaluationPeriod}
//             </Typography>
//             <Typography variant="body2" sx={{ mt: 2, ml: 30 }}>
//               {workplan.grade}
//             </Typography>
//             <Typography variant="body2" sx={{ mt: 2, ml: 30, color: "brown" }}>
//               {workplan.workplanStatus}
//             </Typography>
//           </Paper>
//         ))}
//     </Box>
//   );
// }
