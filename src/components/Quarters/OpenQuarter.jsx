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

export default function OpenQuarter() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [existingPeriods, setExistingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  
  // Generate year options (current year and 2 years before and after)
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    years.push(y);
  }

  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  // Fetch existing periods to show status
  useEffect(() => {
    fetchExistingPeriods();
  }, []);

  const fetchExistingPeriods = async () => {
    try {
      const response = await axiosClient.get("/evaluation_periods/all");
      setExistingPeriods(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching periods:", error);
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedYear || !selectedQuarter) {
      setMessage("Please select both year and quarter");
      return;
    }

    axiosClient
      .post(`/evaluation_periods/open?quarter_name=${selectedQuarter}&year=${selectedYear}`)
      .then((res) => {
        if (res.data === "First create the Quarter through admin") {
          swal({
            text: "Please create the Quarter configuration through admin first",
            icon: "warning",
            button: "OK",
          });
        } else if (res.data === "Incorrect Quarter name") {
          swal({
            text: "Invalid quarter selection",
            icon: "warning",
            button: "OK",
          });
        } else if (res.data.includes("too early")) {
          swal({
            text: res.data,
            icon: "warning",
            button: "OK",
          });
        } else {
          swal({
            text: `Quarter ${selectedYear}-${selectedQuarter} Opened Successfully`,
            icon: "success",
            button: "OK",
          }).then(() => {
            setSelectedYear("");
            setSelectedQuarter("");
            fetchExistingPeriods();
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };

  const getPeriodStatus = (year, quarter) => {
    const period = existingPeriods.find(p => p.period === `${year}-${quarter}`);
    return period ? period.periodStatus : null;
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
          OPEN AN EVALUATION PERIOD FOR A QUARTER
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
        <h6>Open a Quarter Evaluation Period</h6>
        <br />
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth style={{ marginBottom: "15px" }}>
            <InputLabel id="year-select-label">Select Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Select Year"
              onChange={handleYearChange}
              onClick={handleInputClick}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: "15px" }}>
            <InputLabel id="quarter-select-label">Select Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              id="quarter-select"
              value={selectedQuarter}
              label="Select Quarter"
              onChange={handleQuarterChange}
              onClick={handleInputClick}
            >
              {quarters.map((quarter) => {
                const status = getPeriodStatus(selectedYear, quarter);
                return (
                  <MenuItem key={quarter} value={quarter}>
                    {quarter} {status ? `(${status})` : ""}
                  </MenuItem>
                );
              })}
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
            <button className="pillar-btn" style={{ borderRadius: "25px" }}>
              Submit
            </button>
          </div>
          {message && (
            <div className="alert alert-danger" style={{ marginTop: "10px" }}>
              <p>{message}</p>
            </div>
          )}
        </form>
      </Paper>

      {/* Show existing periods status */}
      {!loading && existingPeriods.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            mt: 3,
            ml: 40,
            p: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
            width: "400px",
          }}
        >
          <h6>Current Evaluation Periods</h6>
          <table style={{ width: "100%", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>Period</th>
                <th style={{ textAlign: "left", padding: "5px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {existingPeriods.slice(0, 8).map((period) => (
                <tr key={period.period}>
                  <td style={{ padding: "5px" }}>{period.period}</td>
                  <td style={{ 
                    padding: "5px", 
                    color: period.periodStatus === "Open" ? "green" : "red" 
                  }}>
                    {period.periodStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
}
