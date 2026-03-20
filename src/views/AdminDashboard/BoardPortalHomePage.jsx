import React, { useState, useEffect, useMemo } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import WorkIcon from "@mui/icons-material/Work";
import GradeIcon from "@mui/icons-material/Grade";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useNavigate } from "react-router-dom";

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let quarter;
  let daysRemaining;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    const endOfQuarter = new Date(currentYear, 2, 31);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    const endOfQuarter = new Date(currentYear, 5, 30);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    const endOfQuarter = new Date(currentYear, 8, 30);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    const endOfQuarter = new Date(currentYear, 11, 31);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    daysRemaining: daysRemaining,
  };
};

export default function BoardPortalHomePage() {
  const [allUsers, setAllUsers] = useState([]);
  const [cgProfile, setCgProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userName, token } = useStateContext();
  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  // Simple token check - if no token, redirect to login
  if (!token) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Typography sx={{ color: "#666", fontSize: "18px" }}>
          Please login to access this page...
        </Typography>
      </Box>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/getAllUsers");
        const users = response.data;
        setAllUsers(users);
        
        // Filter for Commissioner General (grade = "1")
        const cg = users.find(user => user.grade === "1");
        setCgProfile(cg);
        
        console.log("All Users:", users);
        console.log("Commissioner General:", cg);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewWorkplan = () => {
    if (cgProfile) {
      navigate(`/board-dashboard/view-workplan?userName=${cgProfile.ec_number}`);
    }
  };

  const handleViewScorecard = () => {
    if (cgProfile) {
      navigate(`/board-dashboard/view-scorecard?userName=${cgProfile.ec_number}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Typography sx={{ color: "#666", fontSize: "18px" }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
        py: 6,
        px: 4,
        ml: 36,
      }}
    >
      {/* Header Section - Steve Jobs Inspired */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          animation: "fadeIn 0.8s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(-20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 300,
            color: "#1a1a1a",
            letterSpacing: "-0.5px",
            mb: 2,
            fontSize: { xs: "28px", md: "42px" },
          }}
        >
          Executive Performance Review
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: "#666",
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Commissioner General's Performance Contract Dashboard
        </Typography>
      </Box>

      {/* Status Cards Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mb: 6,
          flexWrap: "wrap",
        }}
      >
        {/* Quarter Status Card */}
        <Card
          sx={{
            minWidth: "220px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="overline" sx={{ color: "#999", fontSize: "12px" }}>
              Current Period
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#309366", mt: 1 }}
            >
              {evaluationPeriod}
            </Typography>
          </CardContent>
        </Card>

        {/* Days Remaining Card */}
        <Card
          sx={{
            minWidth: "220px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="overline" sx={{ color: "#999", fontSize: "12px" }}>
              Quarter Ends In
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "#f44336", mt: 1 }}
            >
              {daysRemaining} days
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Commissioner General Profile Card */}
      {cgProfile ? (
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            animation: "slideUp 0.6s ease-out",
            "@keyframes slideUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Card
            sx={{
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              overflow: "visible",
              position: "relative",
            }}
          >
            {/* Header Gradient */}
            <Box
              sx={{
                height: "120px",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                borderRadius: "24px 24px 0 0",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "-50px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Avatar
                  sx={{
                    width: "100px",
                    height: "100px",
                    bgcolor: "#309366",
                    fontSize: "40px",
                    fontWeight: 300,
                    border: "4px solid white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  {cgProfile.name?.[0]}{cgProfile.surname?.[0]}
                </Avatar>
              </Box>
            </Box>

            <CardContent sx={{ pt: 8, pb: 4, px: 4 }}>
              {/* Name & Title */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    color: "#1a1a1a",
                    mb: 1,
                  }}
                >
                  {cgProfile.name} {cgProfile.surname}
                </Typography>
                <Chip
                  label="Commissioner General"
                  sx={{
                    bgcolor: "#1a1a2e",
                    color: "white",
                    fontWeight: 500,
                    px: 1,
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Details Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 3,
                  mb: 4,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <PersonIcon sx={{ fontSize: 28, color: "#309366", mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "#999", mb: 0.5 }}>
                    EC Number
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                    {cgProfile.ec_number}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <GradeIcon sx={{ fontSize: 28, color: "#309366", mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "#999", mb: 0.5 }}>
                    Grade
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                    {cgProfile.grade}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <BusinessIcon sx={{ fontSize: 28, color: "#309366", mb: 1 }} />
                  <Typography variant="body2" sx={{ color: "#999", mb: 0.5 }}>
                    Division
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                    {cgProfile.divisionName || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Position */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <WorkIcon sx={{ fontSize: 28, color: "#309366", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#999", mb: 0.5 }}>
                  Position
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                  {cgProfile.positionName || "Commissioner General"}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 4,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleViewWorkplan}
                  startIcon={<WorkIcon />}
                  sx={{
                    bgcolor: "#1a1a2e",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    boxShadow: "0 4px 15px rgba(26, 26, 46, 0.3)",
                    "&:hover": {
                      bgcolor: "#2d2d4a",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(26, 26, 46, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  View Workplan
                </Button>
                <Button
                  variant="contained"
                  onClick={handleViewScorecard}
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    bgcolor: "#309366",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    boxShadow: "0 4px 15px rgba(48, 147, 102, 0.3)",
                    "&:hover": {
                      bgcolor: "#2d7a54",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(48, 147, 102, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  View Scorecard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            maxWidth: "500px",
            mx: "auto",
          }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              py: 6,
              px: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <PendingIcon sx={{ fontSize: 60, color: "#999", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              No Commissioner General Found
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              There is no user with grade "1" (Commissioner General) in the system.
            </Typography>
          </Card>
        </Box>
      )}

      {/* Footer Note */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="body2" sx={{ color: "#999" }}>
          {cgProfile ? (
            <>Showing performance data for {cgProfile.name} {cgProfile.surname}</>
          ) : (
            <>No executive profile available</>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
