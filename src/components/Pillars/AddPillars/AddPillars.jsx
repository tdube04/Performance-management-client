import React, {useState, useRef} from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import axiosClient from "../../../authentication/axios-client";
import swal from "sweetalert";
import Popover from '@mui/material/Popover';


export default function AddPillars() {
  const [showModal, setShowModal] = useState(false);
  const pillarRef = useRef(null);
  const descriptionRef = useRef(null);
  const [message, setMessage] = useState(null);

  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation before submitting

    const pillar= pillarRef.current.value;
    const description= descriptionRef.current.value;

    let errors = [];

    if (!pillar || !description) {
      setMessage("Please fill in all required fields");
    }

    if (!descriptionRef.current.value) {
      errors.push("Description is required.");
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    const formData = {
      pillar: pillarRef.current.value,
      description: descriptionRef.current.value,
    };

    axiosClient
      .post("/Pillars/save", formData)
      .then((res) => {
        swal({
          text: "Pillar Saved Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          window.location.replace("/admin/viewPillars");
        });
        pillarRef.current.value = "";
        descriptionRef.current.value = "";
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
        <h1>Add National Pillar</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <label>Add Pillar</label>
          <br />
          <input
            type="text"
            className="input-pillar"
            ref={pillarRef}
            style={{ width: "100%" }}
            onClick={handleInputClick}
          />

          <br />

          <label htmlFor="suggestion">Pillar Description</label>
          <br />
          <textarea
            className="suggestion"
            rows="5"
            cols="50"
            name="suggestion"
            id="suggestion"
            ref={descriptionRef}
            onClick={handleInputClick}
          ></textarea>

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
