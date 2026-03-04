import React, { useMemo, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
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

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let quarter;
  let daysRemaining;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    const endOfQuarter = new Date(currentYear, 2, 31);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    const endOfQuarter = new Date(currentYear, 5, 30);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    const endOfQuarter = new Date(currentYear, 8, 30);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    const endOfQuarter = new Date(currentYear, 11, 31);
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    daysRemaining: daysRemaining,
  };
};

const PreviousScorecards = () => {
  const navigate = useNavigate();
  const { userName } = useStateContext();
  const [scorecardData, setScorecardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appraiserNames, setAppraiserNames] = useState({});

  useEffect(() => {
    const fetchApprovedScorecards = async () => {
      try {
        const appraiseeScorecardArray = [];
        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        const currentYear = new Date().getFullYear();
        const years = [];
        
        // Get past years (from 2020 to current year)
        for (let year = 2020; year <= currentYear; year++) {
          years.push(year);
        }
        
        const periods = years.flatMap((year) =>
          quarters.map((quarter) => `${year}-${quarter}`)
        );

        // Fetch approved scorecards for all past periods
        for (const period of periods) {
          try {
            const response = await axiosClient.get("/scorecard/searchScorecard", {
              params: {
                period: period,
                username: userName,
              },
            });

            console.log(`Scorecards for period ${period}:`, response.data);

            if (response.data && response.data.content && response.data.content.length > 0) {
              const scorecards = response.data.content.filter(
                (sc) => (sc.scorecardStatus === "Approved" || sc.scorecardStatus === "EvaluatorApproved") && sc.user_email === userName
              );
              console.log(`Approved scorecards for period ${period}:`, scorecards);
              
              for (const sc of scorecards) {
                // Fetch appraiser name if not already fetched
                if (sc.appraiser && !appraiserNames[sc.appraiser]) {
                  try {
                    const appraiserResponse = await axiosClient.get(`/User/{id}?id=${sc.appraiser}`);
                    if (appraiserResponse.data) {
                      setAppraiserNames(prev => ({
                        ...prev,
                        [sc.appraiser]: `${appraiserResponse.data.name || ''} ${appraiserResponse.data.surname || ''}`.trim() || sc.appraiser
                      }));
                    }
                    console.log(`Appraiser info for ${sc.appraiser}:`, appraiserResponse.data);
                  } catch (e) {
                    // Keep original email if fetch fails
                  }
                }
                
                appraiseeScorecardArray.push({
                  ...sc,
                  evaluationPeriod: sc.evaluationPeriod || period,
                  overallScore: sc.total_overal_weighted_score || 0,
                  status: sc.scorecardStatus || "Approved",
                });

                console.log(`Added scorecard for period ${period}:`, appraiseeScorecardArray[appraiseeScorecardArray.length]);
                
              }
            }
          } catch (error) {
            // Continue to next period if this one fails
            console.log(`No scorecard for period ${period}`);
          }
        }

        // Remove duplicates based on scorecard ID
        const uniqueScorecards = appraiseeScorecardArray.filter((scorecard, index, self) => 
          index === self.findIndex((s) => s.id === scorecard.id)
        );
        
        setScorecardData(uniqueScorecards);
        console.log(uniqueScorecards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scorecards:", error);
        setLoading(false);
        setScorecardData([]);
      }
    };

    fetchApprovedScorecards();
  }, [userName]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'evaluationPeriod',
        header: 'Evaluation Period',
        Cell: ({ row }) => row.original.evaluationPeriod || 'N/A',
        filterVariant: 'text',
        size: 180,
      },
      {
        accessorKey: 'scorecardStatus',
        header: 'Status',
        Cell: ({ cell }) => {
          const status = cell.getValue();
          return status === 'EvaluatorApproved' ? 'Approved' : (status || 'Approved');
        },
        filterVariant: 'select',
        filterSelectOptions: ['Approved', 'EvaluatorApproved'],
        size: 150,
      },
      {
        accessorKey: 'appraiser',
        header: 'Appraiser Name',
        Cell: ({ row }) => {
          const appraiserEmail = row.original.appraiser;
          return appraiserNames[appraiserEmail] || appraiserEmail || 'N/A';
        },
        filterVariant: 'text',
        size: 200,
      },
      {
        accessorKey: 'total_overal_weighted_score',
        header: 'Overall Score',
        Cell: ({ cell }) => {
          const score = cell.getValue();
          return score ? score.toFixed(2) : '0.00';
        },
        filterVariant: 'range',
        filterFn: 'between',
        size: 120,
      },
      {
        accessorKey: 'dateSubmitted',
        header: 'Date Submitted',
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? new Date(date).toLocaleDateString() : '_______________';
        },
        filterVariant: 'text',
        size: 150,
      },
      {
        accessorKey: 'dateApproved',
        header: 'Date Approved',
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? new Date(date).toLocaleDateString() : '_______________';
        },
        filterVariant: 'text',
        size: 150,
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const parsedScorecardData = JSON.stringify(row.original);
              const encodedScorecardData = encodeURIComponent(parsedScorecardData);
              
              const queryParams = queryString.stringify({
                username: row.original.user_email,
                scorecardData: encodedScorecardData,
              });
              
              navigate(`/selected-repository-scorecard?${queryParams}`);
            }}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
        ),
        size: 80,
      },
    ],
    [navigate, appraiserNames]
  );

  if (loading) {
    return (
      <div style={{ marginLeft: '100px', textAlign: 'center', padding: '50px' }}>
        <Typography>Loading approved scorecards...</Typography>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '100px' }}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "100%",
          mb: 5,
          mt: 2
        }}
      >
        <Typography
          variant="caption"
          sx={{ textAlign: "center", fontSize: "17px" }}
        >
          REPOSITORY FOR PREVIOUS RESULT SCORECARDS
        </Typography>
      </Paper>
      
      {scorecardData.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', m: 2 }}>
          <Typography variant="h6" color="textSecondary">
            No approved scorecards found in the repository.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Approved scorecards from previous quarters will appear here.
          </Typography>
        </Paper>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={scorecardData}
          initialState={{ showColumnFilters: false }}
        />
      )}
    </div>
  );
};

export default PreviousScorecards;
