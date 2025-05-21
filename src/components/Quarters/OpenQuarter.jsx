import React, { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import swal from "sweetalert";
import Popover from "@mui/material/Popover";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";

export default function OpenQuarter() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const quaterNameRef = useRef(null);
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

    const quaterName = quaterNameRef.current.value;
    const year = parseInt(yearRef.current.value);

    let errors = [];

    if (!quaterName || !year) {
      setMessage("Please fill in all required fields");
      return;
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
 

    axiosClient
      .post(`/evaluation_periods/open?quarter_name=${quaterName}&year=${year}`)
      .then((res) => {
        swal({
          text: "Quater Opened Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          console.log(res.data);
          // navigate("/admin/dashboard");
       
        });
        yearRef.current.value = "";
        quaterNameRef.current.value = "";
      
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
        <h6>Open an Quarter Evaluation Period </h6>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Quarter Period</label>
          <br />
          <input
            type="text"
            placeholder="e.g Q1"
            className="input-pillar"
            ref={quaterNameRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />
          <br />
          <label style={{ width: "170px" }}>Year</label>
          <br />
          <input
            type="text"
            placeholder="e.g 2023 "
            className="input-pillar"
            ref={yearRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />

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
