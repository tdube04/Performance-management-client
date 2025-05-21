import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
} from "@material-ui/core/";
import "./performanceArea.scss";
import axiosClient from "../authentication/axios-client";
import { useStateContext } from "../context/ContextProvider";

import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  let quarter;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }

  return `${currentYear}-${quarter}`;
};

export default function PerformanceArea() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState(null);
  const [selectedPerfomance, setSelectedPerfomance] = useState([]);
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState(0);
  const [id, setId] = useState(0);

  const [expandedIndex, setExpandedIndex] = useState(-1);

  const sectionRef = useRef(null);
  const percentRef = useRef(null);
  const performanceRef = useRef(null);

  const evaluationPeriod = getCurrentEvaluationPeriod();
  const {
    user,
    token,
    userType,
    setUser,
    setToken,
    setUserType,
  } = useStateContext();

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axiosClient.get(`/User/{id}?id=${userName}`);
      setProfileData(response.data);
      console.log(response.data);
      console.log(response.data.ec_number);
    }
    fetchData();
  }, [userName]);

  useEffect(() => {
    axiosClient.get("/Performance_Area/allAreas").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);
  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedPerformance = {
      ...selectedPerfomance,
      performanceArea: performanceRef.current.value,
      section: sectionRef.current.value,
      weight: percentRef.current.value,
    };
    console.log(updatedPerformance);

    try {
      const response = await axiosClient
        .post(`/Performance_Area/update/${id}`, updatedPerformance)
        .then(() => {
          swal({
            text: "Performance Area updated successfully",
            icon: "success",
            button: "OK",
          });
          // window.location.replace("/admin/performanceAreas");
        });
      console.log(response.status);
      setData((prevData) =>
        prevData.map((area) =>
          area.id === id ? { ...area, updated: true } : area
        )
      );
    } catch (error) {
      console.log(error);
      console.log("Failed to update performance area.");
    }
  };

  const handleDelete = (id) => {
    axiosClient
      .post(`/Performance_Area/${id}`)
      .then((response) => {
        console.log("Performance area deleted successfully.");
        setData((prevData) => prevData.filter((area) => area.id !== id));
        swal({
          text: "Performance area deleted successfully.",
          icon: "success",
          button: "OK",
        });
        // window.location.replace("/admin/performanceAreas");
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete performance area.");
      });
  };

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);
    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);

    if (expandedIndex === index) {
      // If the clicked performance area is already expanded, collapse it
      setExpandedIndex(-1);
    } else {
      // Expand the clicked performance area
      setExpandedIndex(index);
    }
  };
  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <>
      <div
        className=""
        style={{
          borderBottomRightRadius: "50px",
          borderBottomLeftRadius: "50px",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <p className="assessment-year" style={{ textAlign: "center" }}>
          Current Year of Assessment: {evaluationPeriod}
        </p>
      </div>

      <p className="title-performance">Assessment Performance Areas</p>
      <div
        className="performance-container"
        style={{ height: "700px", marginLeft: 150 }}
      >
        <div className="row-widgets" style={{ marginLeft: 20 }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {data &&
                data.map((performancearea, index) => (
                  <Grid
                    key={index}
                    item
                    xs={8}
                    sm={"auto"}
                    md={6}
                    onClick={() =>
                      handlePerformanceClick(performancearea, index)
                    }
                  >
                    <Box
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        padding: "8px",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0.3)",
                        height: expandedIndex === index ? "auto" : "100%",
                        width: "70%",
                        fontSize: "14px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#D6D6D3",
                        },
                      }}
                    >
                      <Typography variant="button" component="div">
                        Section {performancearea.section}:{" "}
                        {performancearea.performanceArea}
                      </Typography>

                      <br />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Percentage: {performancearea.weight}%
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          position: "relative",
                          marginTop: "-30px",
                        }}
                      >
                        <IconButton
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={() => handleUpdateDialog(performancearea.id)}
                        >
                          <ModeEditIcon
                            sx={{ fontSize: "15px", color: "green" }}
                          />
                        </IconButton>
                        <IconButton
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={() => handleDelete(performancearea.id)}
                        >
                          <DeleteIcon sx={{ fontSize: "15px", color: "red" }} />
                        </IconButton>
                      </div>

                      {expandedIndex === index && (
                        <Grid container spacing={1}>
                          {/* Render your programs here */}
                          {performancearea.programs &&
                            performancearea.programs.map(
                              (program, programIndex) => (
                                <Grid item xs={12} key={programIndex}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Typography>Program Name:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography>
                                        {program.programName} ({program.weight}
                                        %)
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )
                            )}
                        </Grid>
                      )}
                    </Box>
                  </Grid>
                ))}
            </Grid>
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ mt: 6 }}>
                    Update a Performance Area
                  </Typography>
                </div>
                <br />
                <form>
                  {message && (
                    <div className="alert alert-danger animate__animated animate__bounceIn">
                      <p>{message}</p>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left", width: "180px" }}>
                      Enter Performance Area
                    </label>

                    <input
                      defaultValue={selectedPerfomance.performanceArea}
                      type="text"
                      className="input-pillar animate__animated animate__bounceIn"
                      ref={performanceRef}
                      onClick={handleInputClick}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left", width: "180px" }}>
                      Enter Section
                    </label>

                    <input
                      defaultValue={selectedPerfomance.section}
                      type="text"
                      className="input-pillar animate__animated animate__bounceIn"
                      ref={sectionRef}
                      onClick={handleInputClick}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <label style={{ textAlign: "left", width: "180px" }}>
                      Enter Weight(%)
                    </label>

                    <input
                      defaultValue={selectedPerfomance.weight}
                      type="text"
                      className="input-pillar animate__animated animate__bounceIn"
                      ref={percentRef}
                      onClick={handleInputClick}
                    />
                  </div>
                  <div className="btn-outcome-program">
                    <button
                      className="btn-outcome animate__animated animate__pulse"
                      style={{ borderRadius: "25px" }}
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModalOpen(false)} color="primary">
                  Close
                </Button>
                {/* <Button onClick={() => setModalOpen(false)} color="primary">
                  Update
                </Button> */}
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      </div>
      <p className="title-performance">Current Quarter Ends In : 35 days</p>
    </>
  );
}
