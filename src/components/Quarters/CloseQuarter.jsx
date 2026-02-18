import React, { useState, useRef, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./quarters.scss";

import swal from "sweetalert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";

export default function CloseQuarter() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const periodRef = useRef(null);

  const [message, setMessage] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [evaluationPeriods, setEvaluationPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all evaluation periods on component mount
  useEffect(() => {
    fetchEvaluationPeriods();
  }, []);

  const fetchEvaluationPeriods = async () => {
    try {
      const response = await axiosClient.get("/evaluation_periods/all");
      // Filter to only show Open periods that can be closed
      const openPeriods = response.data.filter(
        (period) => period.periodStatus.toLowerCase() === "open"
      );
      setEvaluationPeriods(openPeriods);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching evaluation periods:", error);
      setLoading(false);
    }
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPeriod) {
      setMessage("Please select an evaluation period");
      return;
    }

    axiosClient
      .put(`/evaluation_periods/close?id=${selectedPeriod}`)
      .then((res) => {
        if (res.data === "cant find the period") {
          swal({
            text: "Can't Find the Evaluation Period",
            icon: "warning",
            button: "OK",
          });
        } else if (res.data.includes("WARNING")) {
          // Early closure with warning - still proceed but warn user
          swal({
            text: res.data,
            icon: "warning",
            button: "OK",
          }).then(() => {
            fetchEvaluationPeriods();
            setSelectedPeriod("");
          });
        } else if (res.data.includes("You can only close")) {
          swal({
            text: res.data,
            icon: "warning",
            button: "OK",
          });
        } else {
          swal({
            text: "Evaluation Period Successfully Closed. The workplan template has been archived.",
            icon: "success",
            button: "OK",
          }).then(() => {
            // Refresh the list after closing
            fetchEvaluationPeriods();
            setSelectedPeriod("");
          });
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          text: "Error closing evaluation period",
          icon: "error",
          button: "OK",
        });
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <div>
      <Paper
        elevation={1}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "400px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5 }}>
          CLOSE THE EVALUATION PERIOD
        </Typography>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          mt: 15,
          ml: 40,
          p: 2,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
          borderTop: "7px solid #309366",
          position: "relative",
          elevation: 3,
        }}
      >
        <h6>Close Evaluation Period</h6>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
          When you close a quarter, the current workplan template (including all 
          performance areas, programs, and weights) will be automatically archived 
          for historical reference and auditing purposes.
        </p>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth style={{ marginBottom: "15px" }}>
            <InputLabel id="period-select-label">Select Evaluation Period</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={selectedPeriod}
              label="Select Evaluation Period"
              onChange={handlePeriodChange}
              onClick={handleInputClick}
              ref={periodRef}
            >
              {loading ? (
                <MenuItem value="">
                  <em>Loading...</em>
                </MenuItem>
              ) : evaluationPeriods.length === 0 ? (
                <MenuItem value="">
                  <em>No open evaluation periods available</em>
                </MenuItem>
              ) : (
                evaluationPeriods.map((period) => (
                  <MenuItem key={period.period} value={period.period}>
                    {period.period} - {period.periodStatus} 
                    ({new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <div
            className="btn-addPillar"
            style={{
              display: "flex",
              justifyContent: "center",
              marginRight: "100px",
            }}
          >
            <button 
              className="pillar-btn" 
              style={{ borderRadius: "25px" }}
              disabled={!selectedPeriod || loading}
            >
              Close & Archive Template
            </button>
          </div>
          {message && (
            <div className="alert alert-danger" style={{ marginTop: "10px" }}>
              <p>{message}</p>
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
}
