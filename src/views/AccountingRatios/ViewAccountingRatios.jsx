import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AssessmentIcon from "@mui/icons-material/Assessment";
import IconButton from "@mui/material/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Button from "@material-ui/core/Button";
import axiosClient from "../../authentication/axios-client";

const ViewAccountingRatios = () => {
  const ratioNameRef = useRef(null);
  const measurementUnitRef = useRef(null);
  const programRef = useRef(null);

  const [ratios, setRatios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionIndex, setSectionIndex] = React.useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [selectedDiv, setSelectedDiv] = React.useState(null);
  const [selectedIncrementDecrement, setSelectedIncrementDecrement] = useState(
    ""
  );
  const [selectedMeasurement, setSelectedMeasurement] = useState("");
  const [otherMeasurement, setOtherMeasurement] = useState("");

  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axiosClient.get("/ratios/allRatios");
      setRatios(response.data);
      console.log(response.data);
    }

    fetchData();
  }, []);

  const handleRatioClick = (ratio, index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Ratio clicked", ratio);

    setSelectedRatio(ratio);
    console.log("Division", index);
  };
  const handleSectionClick = (section, index) => {
    console.log("Section clicked", section);
    setSelectedSection(section);
    setSectionIndex(index);
    console.log("Section Index ", index);
  };

  // .then((response) => {
  //   console.log("Performance area deleted successfully.");
  //   setPerformances((prevData) =>
  //     prevData.filter((area) => area.id !== id)
  //   );
  const handleDelete = (ratioId) => {
    axiosClient
      .delete(`/ratios/${ratioId}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200) {
          setRatios((prevData) => prevData.filter((div) => div.id !== ratioId));
          swal({
            text: response.data,
            icon: "success",
            button: "OK",
          }).then(() => {
            // window.location.replace("/admin/viewDivisions");
          });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete a section.");
      });
  };

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

  const handleUpdateDialog = (id) => {
    setModalOpen(true);
  };

  const handleUpdate = async (event, ratioId) => {
    event.preventDefault();

    // const sectionName = sectionRef.current.value;

    // if (sectionName === "") {
    //   setMessage("Please enter a section name");
    //   return;
    // }

    console.log("index", ratioId);

    const updatedSelectedSRatio = {
      ...selectedRatio,
      ratioName: ratioNameRef.current.value,
      program: programRef.current.value,
    };

    if (selectedMeasurement) {
      updatedSelectedSRatio.measurement_unit = selectedMeasurement;
    } else {
      updatedSelectedSRatio.measurement_unit = selectedRatio.measurement_unit;
    }
    if (selectedIncrementDecrement) {
      updatedSelectedSRatio.increamental_decreamental = selectedIncrementDecrement;
    } else {
      updatedSelectedSRatio.increamental_decreamental =
        selectedRatio.increamental_decreamental;
    }

    console.log("Updated Ratio:", updatedSelectedSRatio);

    try {
      const response = await axiosClient.post(
        `/ratios/update/${ratioId}`,
        updatedSelectedSRatio
      );
      if (response.status === 200) {
        swal({
          text: response.data,
          icon: "success",
          button: "OK!",
        }).then(() => {
          // window.location.replace("/admin/addSection");
        });

        setRatios((prevData) =>
          prevData.map((ratio) =>
            ratio.id === ratioId
              ? { ...ratio, ...updatedSelectedSRatio, updated: true }
              : ratio
          )
        );
      }
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
      swal({
        text: error.message,
        icon: "error",
        button: "OK!",
      });
      console.log("Failed to update section.");
    }
  };
  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "450px",
          border: "2px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        <Typography variant="body2" sx={{ textAlign: "center", ml: 6 }}>
          MANAGE PERFORMANCE AREA ACCOUNTING RATIO
        </Typography>
      </Paper>

      <div className="new-div">
        <Sheet
          variant="outlined"
          sx={{
            width: 650,
            height: 400,
            maxHeight: 390,
            overflow: "auto",
            borderRadius: "sm",
            mt: 7,
            ml: 35,
            p: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
            borderTop: "15px solid #309366",
            position: "relative",
            elevation: 3,
          }}
        >
          <List
            sx={{ width: "100%", maxWidth: 650, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Nested List Items
              </ListSubheader>
            }
          >
            <ListItem nested>
              <ListSubheader sticky>Available Accounting Ratios</ListSubheader>
              {ratios &&
                ratios.map((ratio, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <React.Fragment key={ratio.id}>
                      <ListItemButton
                        onClick={() => handleRatioClick(ratio, index)}
                        endAction={
                          <div>
                            <IconButton
                              sx={{
                                fontSize: "15px",
                                color: "green",
                                marginRight: "8px",
                              }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              onClick={() => handleUpdateDialog(ratio.id)}
                            >
                              <ModeEditIcon />
                            </IconButton>
                            <IconButton
                              sx={{
                                fontSize: "15px",
                                color: "red",
                              }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                             
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        }
                      >
                        <ListItemIcon>
                          {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemIcon>
                        <ListItemText primary={ratio.ratioName} />
                      </ListItemButton>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div">
                          <ListItem
                            key={ratio.id}
                            sx={{ pl: 4 }}
                            endAction={
                              <div>
                                <IconButton
                                  sx={{
                                    fontSize: "15px",
                                    color: "green",
                                  }}
                                  onMouseEnter={() => setIsHovered(true)}
                                  onMouseLeave={() => setIsHovered(false)}
                                  onClick={() => handleUpdateDialog(ratio.id)}
                                >
                                  <ModeEditIcon
                                    sx={{
                                      fontSize: "15px",
                                    }}
                                  />
                                </IconButton>
                                <IconButton
                                  sx={{
                                    fontSize: "5px",
                                    color: "red",
                                  }}
                                  onMouseEnter={() => setIsHovered(true)}
                                  onMouseLeave={() => setIsHovered(false)}
                                  onClick={() => handleDelete(ratio.id)}
                                >
                                  <DeleteIcon
                                    sx={{
                                      fontSize: "15px",
                                    }}
                                  />
                                </IconButton>
                              </div>
                            }
                          >
                            <ListItemIcon sx={{ fontSize: "extraSmall" }}>
                              <FiberManualRecordIcon
                                style={{ fontSize: "smaller" }}
                              />
                            </ListItemIcon>
                            <ListItemButton>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography>
                                  Program Name: <strong>{ratio.program}</strong>
                                </Typography>
                                <Typography>
                                  Measurement Unit:
                                  <strong> {ratio.measurement_unit}</strong>
                                </Typography>
                                <Typography>
                                  Ratio Type:{" "}
                                  <strong>
                                    {ratio.increamental_decreamental}
                                  </strong>
                                </Typography>
                              </div>
                            </ListItemButton>

                            {/* <ListItemText
                              primary={division.program}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#DEDDE2",
                                  cursor: "pointer",
                                },
                              }}
                            />
                              <ListItemText
                              primary={division.measurement_unit}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#DEDDE2",
                                  cursor: "pointer",
                                },
                              }}
                            /> */}
                            {/* <ListItemButton>
                              {division.measurement_unit}
                            </ListItemButton> */}
                          </ListItem>
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
                })}
            </ListItem>
          </List>
        </Sheet>
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
                Update a Ratio
              </Typography>
            </div>
            <br />
            <form
              onSubmit={(e) => handleUpdate(e, selectedRatio.id)}
              style={{ width: "500px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Ratio Name: </label>
                <input
                  defaultValue={selectedRatio && selectedRatio.ratioName}
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Section Name"
                  onClick={handleInputClick}
                  ref={ratioNameRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Program Name: </label>
                <input
                  defaultValue={selectedRatio && selectedRatio.program}
                  className="input2 animate__animated animate__bounceIn"
                  type="text"
                  placeholder="Section Name"
                  onClick={handleInputClick}
                  ref={programRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Measurement Unit: </label>

                <select
                  defaultValue={selectedRatio && selectedRatio.measurement_unit}
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedMeasurement}
                  onChange={handleMeasurementChange}
                  placeholder="Measurement Unit"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={selectedRatio && selectedRatio.measurement_unit}
                  >
                    {selectedRatio && selectedRatio.measurement_unit}
                  </option>
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
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Selector Ratio Type</label>
                <select
                  defaultValue={
                    selectedRatio && selectedRatio.increamental_decreamental
                  }
                  className="input2 animate__animated animate__bounceIn"
                  value={selectedIncrementDecrement}
                  onChange={handleIncrementChange}
                  placeholder="Incremental/Decremental"
                  style={{
                    width: 275,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option
                    value={
                      selectedRatio && selectedRatio.increamental_decreamental
                    }
                  >
                    {selectedRatio && selectedRatio.increamental_decreamental}
                  </option>
                  <option value="Incremental">Incremental</option>
                  <option value="Decremental">Decremental</option>
                </select>
              </div>
              <div className="btn-addPillar">
                <button className="pillar-btn" style={{ borderRadius: "25px" }}>
                  Update
                </button>
              </div>
              {message && (
                <div className="alert alert-danger">
                  <p>{message}</p>
                </div>
              )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* </Box> */}
      {/* </Paper> */}
    </div>
  );
};

export default ViewAccountingRatios;
