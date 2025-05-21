import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axiosClient from "../../../authentication/axios-client";

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

const ViewDivisions = () => {

  const sectionRef = useRef();

  const [divisions, setDivisions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionIndex, setSectionIndex] = React.useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [id, setId] = useState(0);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDiv, setSelectedDiv] = React.useState(null);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axiosClient.get("/division/allDivisions");
      setDivisions(response.data);
      console.log(response.data);
    }

    fetchData();
  }, []);

  const handleDivisionClick = (division, index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Division clicked", division);
 
    setSelectedDivision(division);
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
            button: "OK",
          }).then(() => {
            window.location.replace("/admin/viewDivisions");
          });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to delete a section.");
      });
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
      selectedDivision.sectionName &&
        selectedDivision.sectionName.map((section, index) => {
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
      ...selectedDivision,
      sectionName: updatedSection.sectionName,
    };
    console.log("Updated Section:", updatedSelectedSectionName);

    try {
      const response = await axiosClient.put(
        `/division/updateSection/${selectedSection}?newSectionName=${sectionName}`
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
          width: "350px",
          border: "2px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        MANAGE ZIMRA DIVISIONS AND SECTIONS
      </Paper>

      <div className="new-div">
        <Sheet
          variant="outlined"
          sx={{
            width: 550,
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
  sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}
  component="nav"
  aria-labelledby="nested-list-subheader"
  subheader={
    <ListSubheader component="div" id="nested-list-subheader">
      Nested List Items
    </ListSubheader>
  }
>
  <ListItem nested>
    <ListSubheader sticky>Available Divisions</ListSubheader>
    {divisions &&
      divisions.map((division, index) => {
        const isOpen = openIndex === index;
        return (
          <React.Fragment key={division.id}>
            <ListItemButton
              onClick={() => handleDivisionClick(division, index)}
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
                    onClick={() => handleUpdateDialog(division.id)}
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
                    onClick={() => handleDelete(division.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemIcon>
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
              <ListItemText primary={division.divisionName} />
            </ListItemButton>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div">
                {division.sectionName &&
                  division.sectionName.map((section) => (
                    <ListItem
                      key={section}
                      onClick={() => handleSectionClick(section, index)}
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
                            onClick={() => handleUpdateDialog(section.id)}
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
                            onClick={() =>
                              handleDelete(division.divisionName, section)
                            }
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
                      <ListItemText
                        primary={section}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#DEDDE2",
                            cursor: "pointer",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
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

export default ViewDivisions;
