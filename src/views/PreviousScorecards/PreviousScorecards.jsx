  import React, { useMemo } from 'react';
  import { MaterialReactTable } from 'material-react-table';
  import { citiesList, data, usStateList } from './makeData';
  
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
  
  const PreviousScorecards = () => {
    const columns = useMemo(
      () => [
        {
          accessorKey: 'salary',
          header: 'Year',
          Cell: () => {
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            const years = [];
            for (let year = 2023; year <= 2090; year++) {
              years.push(year);
            }
            const randomYear = years[Math.floor(Math.random() * years.length)];
            const randomQuarter = quarters[Math.floor(Math.random() * quarters.length)];
            return `${randomQuarter} ${randomYear}`;
          },
          filterVariant: 'range-slider',
          filterFn: 'betweenInclusive', // default (or between)
          muiTableHeadCellFilterSliderProps: {
            marks: true,
            max: 2090, //custom max (as opposed to faceted max)
            min: 2023, //custom min (as opposed to faceted min)
            step: 1,
            // valueLabelFormat: (value) =>
            //   value.toLocaleString('en-US', {
            //     style: 'currency',
            //     currency: 'USD',
            //   }),
          },
        },
        {
          header: 'Status',
          accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
          id: 'isActive',
          filterVariant: 'checkbox',
          Cell: ({ cell }) =>
            cell.getValue() === 'true' ? 'Approved' : 'Approved',
          size: 170,
        },
        {
          accessorKey: 'name',
          header: 'Appraiser Name',
          filterVariant: 'text', // default
          size: 100,
        },
        {
          accessorKey: 'age',
          header: 'Overal Score',
          filterVariant: 'range',
          filterFn: 'between',
          size: 80,
        },
       
        {
          accessorKey: 'city',
          header: 'Evaluator Email',
          filterVariant: 'select',
          filterSelectOptions: citiesList, //custom options list (as opposed to faceted list)
        },
        {
          accessorKey: 'state',
          header: 'Section',
          filterVariant: 'multi-select',
          filterSelectOptions: usStateList, //custom options list (as opposed to faceted list)
        },
      ],
      [],
    );
  
    return (
      <div style={{ marginLeft: '100px' }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            width: "100%",
            mb:5,
            mt:2
          }}
        >
          <Typography
            variant="caption"
            sx={{ textAlign: "center", fontSize: "17px" }}
          >
           REPOSITORY FOR PREVIOUS RESULT SCORECARDS
          </Typography>
        </Paper>
      <MaterialReactTable
        columns={columns}
        data={data}
        initialState={{ showColumnFilters: false }}
      />
    </div>
    );
  };
  
  export default PreviousScorecards;
  
  // import React, { useMemo } from 'react';
  // import Box from "@mui/material/Box";
  // import Paper from "@mui/material/Paper";
  // import Table from "@mui/material/Table";
  // import TableBody from "@mui/material/TableBody";
  // import TableCell from "@mui/material/TableCell";
  // import TableContainer from "@mui/material/TableContainer";
  // import TableHead from "@mui/material/TableHead";
  // import TableRow from "@mui/material/TableRow";
  // import Typography from "@mui/material/Typography";
  // import TablePagination from "@mui/material/TablePagination";
  
  // import { MaterialReactTable } from 'material-react-table';
  // import { citiesList, data, usStateList } from './makeData';
   
  // export default function PreviousWorkplans() {
  //   const [workPlans, setWorkPlans] = React.useState([]);
  //   const [page, setPage] = React.useState(0);
  //   const [rowsPerPage, setRowsPerPage] = React.useState(6);
  
  //   React.useEffect(() => {
  //     async function fetchWorkPlans() {
  //       const response = await fetch("your_api_endpoint");
  //       const data = await response.json();
  //       setWorkPlans(data);
  //     }
  //     fetchWorkPlans();
  //   }, []);
  
  //   const handleChangePage = (event, newPage) => {
  //     setPage(newPage);
  //   };
  
  //   const handleChangeRowsPerPage = (event) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //   };
  
  //   const emptyRows =
  //     rowsPerPage - Math.min(rowsPerPage, workPlans.length - page * rowsPerPage);
  
  //   return (
  //     <Box
  //       sx={{
  //         display: "column",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         gap: 2,
  //       }}
  //     >
  //       {/* Header */}
  //       <Paper
  //         elevation={3}
  //         sx={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "100%",
  //           height: "50px",
  //           backgroundColor: "#f5f5f5",
  //           boxShadow: "0px 0px 6px -1px darkgreen",
  //         }}
  //       >
  //         <Typography variant="h5" sx={{ fontWeight: "bold" }}>
  //           Previous Work Plans
  //         </Typography>
  //       </Paper>
  //       {/* Table */}
  //       <TableContainer
  //         component={Paper}
  //         sx={{ boxShadow: "0px 0px 6px -1px darkgreen" }}
  //       >
  //         <Table>
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Year</TableCell>
  //               <TableCell>Quarter</TableCell>
  //               <TableCell>Workplan</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {workPlans
  //               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //               .map((workPlan) => (
  //                 <TableRow key={workPlan.id}>
  //                   <TableCell>{workPlan.year}</TableCell>
  //                   <TableCell>{workPlan.quarter}</TableCell>
  //                   <TableCell>{workPlan.workplan}</TableCell>
  //                 </TableRow>
  //               ))}
  //             {emptyRows > 0 && (
  //               <TableRow style={{ height: 53 * emptyRows }}>
  //                 <TableCell colSpan={3} />
  //               </TableRow>
  //             )}
  //           </TableBody>
  //         </Table>
  //         <TablePagination
  //           rowsPerPageOptions={[6, 12, 18]}
  //           component="div"
  //           count={workPlans.length}
  //           rowsPerPage={rowsPerPage}
  //           page={page}
  //           onPageChange={handleChangePage}
  //           onRowsPerPageChange={handleChangeRowsPerPage}
  //         />
  //       </TableContainer>
  //     </Box>
  //   );
  // }