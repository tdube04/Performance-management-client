import React, { useState, useEffect } from "react";
import axiosClient from "../../authentication/axios-client";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Alert,
  Fade,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  NewReleases,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const QuarterStatusBadge = () => {
  const [quarterStatus, setQuarterStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuarterStatus = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/evaluation_periods/current-status");
        setQuarterStatus(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching quarter status:", err);
        setError("Failed to load quarter status");
      } finally {
        setLoading(false);
      }
    };

    fetchQuarterStatus();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuarterStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error || !quarterStatus) {
    return null;
  }

  const { hasOpenQuarter, currentQuarter, currentQuarterStatus, daysRemaining, newQuarterOpened } = quarterStatus;

  // If no open quarter
  if (!hasOpenQuarter) {
    return (
      <Fade in={true}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#fff3e0",
            borderLeft: "4px solid #ff9800",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Cancel sx={{ color: "#ff9800", fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="#e65100">
              No Active Quarter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All quarters are currently closed. Please wait for a new quarter to be opened.
            </Typography>
          </Box>
        </Paper>
      </Fade>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* New Quarter Opened Alert */}
      {newQuarterOpened && (
        <Fade in={true}>
          <Alert
            severity="success"
            icon={<NewReleases />}
            sx={{
              mb: 2,
              backgroundColor: "#e8f5e9",
              "& .MuiAlert-icon": {
                color: "#2e7d32",
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              🎉 New Quarter Opened: {newQuarterOpened}
            </Typography>
            <Typography variant="body2">
              A new evaluation period has been opened. Please submit your workplan.
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Current Quarter Status */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          backgroundColor: hasOpenQuarter ? "#e8f5e9" : "#fafafa",
          borderLeft: hasOpenQuarter ? "4px solid #4caf50" : "4px solid #9e9e9e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {hasOpenQuarter ? (
            <CheckCircle sx={{ color: "#4caf50", fontSize: 28 }} />
          ) : (
            <Cancel sx={{ color: "#9e9e9e", fontSize: 28 }} />
          )}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color={hasOpenQuarter ? "#2e7d32" : "text.secondary"}>
              {hasOpenQuarter ? `Current Quarter: ${currentQuarter}` : "No Active Quarter"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {currentQuarterStatus}
            </Typography>
          </Box>
        </Box>

        {hasOpenQuarter && daysRemaining !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ color: daysRemaining <= 7 ? "#f44336" : "#4caf50", fontSize: 20 }} />
            <Chip
              label={`${daysRemaining} days remaining`}
              size="small"
              sx={{
                backgroundColor: daysRemaining <= 7 ? "#ffebee" : "#e8f5e9",
                color: daysRemaining <= 7 ? "#c62828" : "#2e7d32",
                fontWeight: "bold",
                border: `1px solid ${daysRemaining <= 7 ? "#ef9a9a" : "#a5d6a7"}`,
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default QuarterStatusBadge;
