import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import axiosClient from "../../../authentication/axios-client";

import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

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

const AddSection = () => {
  const divisionRef = useRef();

  const sectionRef = useRef();
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionIndex, setSectionIndex] = React.useState(0);
  const [divisions, setDivisions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [message, setMessage] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = React.useState(null);
  const [selectedDiv, setSelectedDiv] = React.useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const [id, setId] = useState(0);
  const [selectedDivisionData, setSelectedDivisionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/division/allDivisions");
        setDivisions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleInputClick = () => {
    setMessage("");
  };

  const handleDivisionChange = (event) => {
    const myDivision = divisions.find(
      (division) => division.divisionName === event.target.value
    );
    setSelectedDiv(myDivision);
    setId(myDivision.id);
    console.log("My Division id: ", id);
    if (event && event.target) {
      setSelectedDivision(event.target.value);
    }
    setSections(myDivision ? myDivision.sectionName : []);
  };

  const division = divisions.find(
    (division) => division.id === selectedDivision
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDivision) {
      setMessage("Please select a division");
      return;
    }

    const sectionName = sectionRef.current.value
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (!sectionName) {
      setMessage("Please enter a section name");
      return;
    } else if (!isNaN(sectionName)) {
      setMessage("Please enter a valid section name");
      return;
    }
    console.log(sectionRef.current.value);
    const division = divisions.find(
      (division) => division.divisionName === selectedDivision
    );
    console.log(division.divisionName);
    console.log(sectionName);
    console.log(division.id);
    if (!division) {
      setMessage("Please select a division");
      return;
    }
    try {
      if (!division.sectionName) {
        division.sectionName = [];
      }
      const response = await axiosClient.post(
        "/division/addSection/",
        {},

        {
          params: {
            divisionName: division.divisionName,
            sectionName: sectionName,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        swal({
          text: response.data,
          icon: "success",
          button: "OK",
        }).then(() => {
          window.location.reload();
        });

        // if (response.status === 200) {
        //   setMessage(response.data.message);
        //   // Show success alert
        //   <div className="alert alert-success">
        //     <p>Posting successful!</p>
        //   </div>;
        // } else if (response.status === 500) {
        //   setMessage("Internal Server Error");
        // } else if (response.status === 400) {
        //   setMessage("Bad Request");
        // } else if (response.status === 404) {
        //   setMessage("Not Found");
        // } else {
        //   setMessage("An error occurred");
        // }

        // // Update the divisions state with the updated division
        setDivisions((prevDivisions) => {
          const updatedDivisions = prevDivisions.map((division) => {
            if (division.id === selectedDivision) {
              return response.data;
            }
            return division;
          });
          return updatedDivisions;
        });
        // // Clear the section input field
        // sectionRef.current.value = "";
        // // Show success message
        // setMessage("Section added successfully");
      }
    } catch (error) {
      console.log(error);
      // Show error message
      setMessage("Failed to add section");
    }
  };

  const handleSectionClick = (section, index) => {
    console.log("Section clicked", section);
    setSelectedSection(section);
    setSectionIndex(index);
    console.log("Section Index ", index);
  };

  const handleUpdateDialog = (id) => {
    setModalOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const sectionName = sectionRef.current.value;

    if (sectionName === "") {
      setMessage("Please enter a section name");
      return;
    }

    console.log("index", sectionIndex);

    const updatedSection = {
      sectionName:
        selectedDiv.sectionName &&
        selectedDiv.sectionName.map((section, index) => {
          if (index === sectionIndex) {
            return {
              ...section,
              sectionName: sectionName,
            };
            console.log("section");
          }
          return section;
        }),
    };

    const updatedSelectedSectionName = {
      ...selectedDiv,
      updatedSection,
    };
    console.log("Updated Section:", updatedSelectedSectionName);
    // http://10.45.0.99:8080/division/updateSection/${selectedDivision}?newSectionName=${sectionName}&oldSectionName=${selectedSection}
    try {
      const response = await axiosClient.put(
        `/division/updateSection/${selectedDivision}?newSectionName=${sectionName}&oldSectionName=${selectedSection}`
      );
      if (response.status === 200) {
        swal({
          text: response.data,
          icon: "success",
          button: "OK!",
        }).then(() => {
          window.location.replace("/admin/addSection");
        });

        setDivisions((prevData) =>
          prevData.map((area) =>
            area.id === id ? { ...area, updated: true } : area
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
  const handleDelete = (division, section) => {
    axiosClient
      .delete(`/division/deleteS/${division}?sectionName=${section}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200) {
          setDivisions((prevData) => prevData.filter((div) => div.id !== id));
          swal({
            text: response.data,
            icon: "success",
            button: "OK!",
          });
          window.location.replace("/admin/addSection");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete a section.");
      });
  };
  return (
    <>
      {" "}
      <Paper
        elevation={3}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "350px",
          border: "2px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        <Typography variant="body2" sx={{ textAlign: "center", ml: 6 }}>
          ADD SECTIONS FOR DIVISIONS
        </Typography>
      </Paper>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            transform: selectedDivision ? "translateX(-200px)" : "none",
            transition: "margin-left 0.5s ease-in-out",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              mt: 15,
              ml: 40,
              maxHeight: 500,
              height: 360,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "7px solid #309366",
              position: "relative",
              elevation: 3,
            }}
          >
            <Typography variant="caption" sx={{ mt: 3, textAlign: "center" }}>
              <ListSubheader sticky>ADD SECTION FOR A DIVISION</ListSubheader>
            </Typography>
            <h1></h1>
            <br />
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label style={{ marginRight: "10px" }}>Select a Division</label>
                <br />

                <select
                  className="input2"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  placeholder="Select a division…"
                  style={{
                    marginLeft: "80px",
                    width: 247,
                    backgroundColor: "#f9f6f6",
                  }}
                >
                  <option value="">Select a division...</option>
                  {divisions &&
                    divisions.map((division) => (
                      <option key={division.id} value={division.divisionName}>
                        {division.divisionName}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <label>Enter Section: </label>
                <input
                  className="input2"
                  type="text"
                  placeholder="Section"
                  onClick={handleInputClick}
                  ref={sectionRef}
                />
              </div>
              {message && (
                  <div className="alert alert-danger">
                    <p>{message}</p>
                  </div>
                )}

              <div className="btn-addPillar">
                <button className="pillar-btn" style={{ borderRadius: "25px" }}>
                  Add
                </button>
            
              </div>
            </form>
          </Paper>
        </div>
        {selectedDivision && (
          <div className="new-div">
            <Sheet
              variant="outlined"
              sx={{
                width: 400,
                height: 360,
                maxHeight: 390,
                overflow: "auto",
                borderRadius: "sm",
                mt: 15,
                ml: -17,
                p: 2,
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                borderTop: "7px solid #309366",
                position: "relative",
                elevation: 3,
              }}
            >
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Nested List Items
                  </ListSubheader>
                }
              >
                <ListSubheader sx={{ mt: -1 }}>
                  {" "}
                  <span>Selected Division: </span> {selectedDivision}
                </ListSubheader>
                <Typography>Sections</Typography>
                {sections &&
                  sections.map((section, index) => (
                    <React.Fragment key={index}>
                      <ListItemButton
                        onClick={() => handleSectionClick(section, index)}
                      >
                        <ListItemIcon>
                          <AssessmentIcon />
                        </ListItemIcon>
                        <ListItemText primary={section} />
                        <IconButton
                          sx={{
                            fontSize: "15px",
                            color: "green",
                            marginRight: "8px",
                          }}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={() => handleUpdateDialog(section.id)}
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
                          onClick={() =>
                            handleDelete(selectedDivision, section)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                    </React.Fragment>
                  ))}
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
                    Update a Section
                  </Typography>
                </div>
                <br />
                <form
                  onSubmit={(e) => handleUpdate(e, sectionRef.current.value)}
                  style={{ width: "500px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <label>Enter Section: </label>
                    <input
                      defaultValue={selectedSection}
                      className="input2 animate__animated animate__bounceIn"
                      type="text"
                      placeholder="Section Name"
                      onClick={handleInputClick}
                      ref={sectionRef}
                    />
                  </div>
                  <div className="btn-addPillar">
                    <button
                      className="pillar-btn"
                      style={{ borderRadius: "25px" }}
                    >
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
        )}
      </div>
    </>
  );
};

export default AddSection;
