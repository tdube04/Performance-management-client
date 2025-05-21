import React, { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./quarters.scss";

import swal from "sweetalert";
import Popover from "@mui/material/Popover";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CloseQuarter() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const quaterNameRef = useRef(null);
  const allowableDaysRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const periodRef = useRef(null);
  const yearRef = useRef(null);

  const [message, setMessage] = useState(null);
  const [selectedIncrementDecrement, setSelectedIncrementDecrement] = useState(
    ""
  );

  const [errors, setErrors] = useState([]);

  const handleIncrementChange = (event) => {
    if (event && event.target) {
      setSelectedIncrementDecrement(event.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation before submitting

    const period = periodRef.current.value;
    // const year = yearRef.current.value;
    console.log(period);

    let errors = [];

    if (!period) {
      setMessage("Please enter a period");
      return;
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    axiosClient
      .put(`/evaluation_periods/close?id=${period}`)
      .then((res) => {
        if (res.data === "cant find the period") {
          swal({
            text: "Can't Find the Evaluation Period",
            icon: "warning",
            button: "OK",
          });
        } else {
          swal({
            text: "Evaluation Period Successfully Closed",
            icon: "success",
            button: "OK",
          }).then(() => {
            console.log(res.data);
            // navigate("/admin/dashboard");
          });
        }
        periodRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
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
        {" "}
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
        <br />
        <form onSubmit={handleSubmit}>
          {/* <div style={{ display: "flex", gap: "10px" }}> */}
          {/* <div>
              <label>From</label>
              <br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="custom-date-picker"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Start Date"
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          background: "#f9f6f6",
                          borderRadius: "8px",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <p style={{ marginTop: "25px" }}>-</p>
            <div>
              <label style={{ width: "170px" }}>To</label>
              <br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="custom-date-picker"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="End Date"
                      InputProps={{
                        ...params.InputProps,
                        style: {
                          background: "#f9f6f6",
                          borderRadius: "8px",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div> */}

          <label style={{ width: "170px" }}>Period</label>
          <br />
          <input
            type="text"
            placeholder="e.g 2023-Q1 "
            className="input-pillar"
            ref={periodRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />

          {/* <br />
          <label style={{ width: "170px" }}>Year</label>
          <br />
          <input
            type="text"
            placeholder="e.g 2023 "
            className="input-pillar"
            ref={yearRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          /> */}
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
            <div className="alert alert-danger">
              <p>{message}</p>
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
}
