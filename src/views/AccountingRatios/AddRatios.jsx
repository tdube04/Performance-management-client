import React, { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import swal from "sweetalert";
import Popover from "@mui/material/Popover";
import axiosClient from "../../authentication/axios-client";
import { useNavigate } from "react-router-dom";

export default function AddRatios() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const ratioNameRef = useRef(null);

  const programRef = useRef(null);

  const [message, setMessage] = useState(null);
  const [selectedIncrementDecrement, setSelectedIncrementDecrement] = useState(
    ""
  );
  const [selectedMeasurement, setSelectedMeasurement] = useState("");
  const [otherMeasurement, setOtherMeasurement] = useState("");
  const [errors, setErrors] = useState([]);

  const handleIncrementChange = (event) => {
    if (event && event.target) {
      setSelectedIncrementDecrement(event.target.value);
    }
  };

  const handleMeasurementChange = (event) => {
    const selectedValue = event.target.value;
    if (event && event.target) {
      setSelectedMeasurement(event.target.value);
    }
    if (selectedValue !== "Other") {
      setOtherMeasurement("");
    }
  };
  const handleOtherMeasurementChange = (event) => {
    setOtherMeasurement(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = [];

    if (
      !ratioNameRef.current.value ||
      !selectedIncrementDecrement ||
      !selectedMeasurement
    ) {
      setMessage("Please fill in all required fields");
    }

    if (!programRef.current.value) {
      errors.push("Program is required.");
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    const formData = {
      ratioName: ratioNameRef.current.value,
      increamental_decreamental: selectedIncrementDecrement,
      measurement_unit: selectedMeasurement,
      program: programRef.current.value,
    };

    axiosClient
      .post("/ratios/save", formData)
      .then((res) => {
        swal({
          text: "Accounting Ratio saved Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          navigate("/admin/view-all-accounting-ratios");
        });
        ratioNameRef.current.value = "";
        programRef.current.value = "";
        setSelectedIncrementDecrement("");
        setSelectedMeasurement("");
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
          width: "300px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        <Typography variant="body2" sx={{ textAlign: "center", ml: 7 }}>
          ADD ACCOUNTING RATIOS
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
        <h6>Add Accounting Ratios</h6>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Add Ratio Name</label>
          <br />
          <input
            type="text"
            className="input-pillar"
            ref={ratioNameRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />

          <br />
          <label>Program Name</label>
          <br />
          <input
            type="text"
            className="input-pillar"
            ref={programRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />

          <br />
          <label>Measurement Unit: </label>

          <select
            className="input2 animate__animated animate__bounceIn"
            value={selectedMeasurement}
            onChange={handleMeasurementChange}
            placeholder="Measurement Unit"
            style={{
              width: 275,
              backgroundColor: "#f9f6f6",
            }}
          >
            <option value="">Select a Measurement Unit...</option>
            <option value="%">%</option>
            <option value="$">$</option>
            <option value="Hours">Hours</option>
            <option value="Days">Days</option>
            <option value="Other">Other</option>
          </select>
          <br />

          {selectedMeasurement === "Other" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                marginLeft: "200px",
              }}
            >
              <input
                className="input2 animate__animated animate__bounceIn"
                type="text"
                placeholder="Enter Measurement Unit"
                value={otherMeasurement}
                onChange={handleOtherMeasurementChange}
                style={{
                  width: 250,
                  backgroundColor: "#f9f6f6",
                  marginTop: 10,
                }}
              />
            </div>
          )}

          <br />
          <label>Selector Ratio Type</label>
          <select
            className="input2 animate__animated animate__bounceIn"
            value={selectedIncrementDecrement}
            onChange={handleIncrementChange}
            placeholder="Incremental/Decremental"
            style={{
              width: 275,
              backgroundColor: "#f9f6f6",
            }}
          >
            <option value="">Select Increment/Decrement...</option>
            <option value="Incremental">Incremental</option>
            <option value="Decremental">Decremental</option>
          </select>

          <div className="btn-addPillar">
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
