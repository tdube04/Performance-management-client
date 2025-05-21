import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import swal from "sweetalert";
import axiosClient from "../../../authentication/axios-client";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { UpdateDisabledRounded } from "@mui/icons-material";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import IconButton from "@mui/material/IconButton";

const AddDivision = () => {
  const divisionRef = useRef();
  const divisionUpdateRef = useRef();
  
  const [divisions, setDivisions] = useState([]);
  const descriptionRef = useRef();
  const sectionRef = useRef();
  const [message, setMessage] = useState(null);
 
  const [sectionNames, setSectionNames] = useState("");
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [id, setId] = useState(0);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const divisionName = divisionRef.current.value;

    if (!divisionName) {
      setMessage("Please fill in all required fields");
      return;
    }

    const payload = {
      divisionName: divisionRef.current.value,
      sectionName:[]
      
    };

    axiosClient
      .post("/division/save", payload)
      .then((response) => {
        console.log(response);
        
        swal({
          text: "Division Saved Successfully",
          icon: "success",
          button: "OK!",
        }).then(() => {
          window.location.replace("/admin/addDivision");
        });
        divisionRef.current.value = "";
        // descriptionRef.current.value = "";
        // sectionRef.current.value = "";
        setSectionNames("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDivisionClick = (division) => {
    setSelectedDivision(division);
  };
  const handleInputClick = () => {
    setMessage("");
  };

  const handleSectionChange = (event) => {
    setSectionNames(event.target.value);
  };
  const handleUpdateDialog = (id) => {
    setId(id);
    setModalOpen(true);
  };
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!divisionUpdateRef.current.value) {
      setMessage("Please enter a division");
      return;
    }else if (!isNaN(divisionUpdateRef.current.value)) {
      setMessage("Please enter a valid division name");
      return;
    }


    if (selectedDivision) {
      try {
        const updatedDivision = {
          ...selectedDivision,
          divisionName: divisionUpdateRef.current.value,
        };
        const response = await axiosClient.post(
          `/division/update/${selectedDivision.id}`,
          updatedDivision
        );
        if (response && response.status === 200) {
          // Update the divisions state with the updated division
          setDivisions((prevDivisions) => {
            const updatedDivisions = prevDivisions.map((division) => {
              if (division.id === selectedDivision.id) {
                return {
                  ...division,
                  divisionName: updatedDivision.divisionName,
                };
              }
              return division;
            });
            return updatedDivisions;
          });
          // Close the dialog
          setModalOpen(false);
          // Show success message
          swal({
            text: "Division updated successfully",
            icon: "success",
           
          });

        } else {
          setMessage("Failed to update division");
        }
      } catch (error) {
        console.log(error);
        setMessage("Failed to update division");
      }
    }
  };
  const handleDelete = (id) => {
    axiosClient
      .delete(`/division/${id}`)
      .then((response) => {
        if (response && response.status === 200) {
          // Remove the deleted division from the divisions state
          setDivisions((prevDivisions) =>
            prevDivisions.filter((division) => division.id !== id)
          );
          // Show success message
         
          swal({
            text: "Division deleted successfully",
            icon: "success",
            button: "OK!",
          }).then(() => {
            // window.location.replace("/admin/add-performance-area");
          });
        } else {
          setMessage("Failed to delete division");
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage("Failed to delete division");
      });
  };
  useEffect(() => {
    async function fetchData() {
      const response = await axiosClient.get("/division/allDivisions");
      setDivisions(response.data);
      console.log(response.data);
    }

    fetchData();
  }, []);

  return ( <>
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
    <Typography variant="body2" sx={{ textAlign: "center", ml: 10 }}>
      MANAGE DIVISIONS
    </Typography>
  </Paper>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      
      <Paper
        variant="outlined"
        sx={{
          mt: 15,
          ml: 10,
          p: 2,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
          borderTop: "7px solid #309366",
          position: "relative",
          elevation: 3,
          width: "45%",
        }}
      >

        <Typography variant="caption" sx={{ m: 4, textAlign: "center" }}>
              <ListSubheader sticky>ADD DIVISIONS</ListSubheader>
            </Typography>
        <br />
        <form onSubmit={onSubmit}>
          <label>Enter Division</label>
          <br />
          <input
            type="text"
            className="input-pillar"
            style={{ width: "100%" }}
            ref={divisionRef}
            onClick={handleInputClick}
          />

          <br />
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
      <div className="new-div">
        <Sheet
          variant="outlined"
          sx={{
            width: 450,
            height: 390,
            maxHeight: 390,
            overflow: "auto",
            borderRadius: "sm",
            mt: 15,
            ml: 10,
            p: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
            borderTop: "8px solid #309366",
            position: "relative",
            elevation: 3,
          }}
        >
          <List>
            <ListItem nested>
              <ListSubheader sticky>Available Divisions</ListSubheader>
              <List>
                {divisions.map((division, index) => (
                  <ListItem
                    key={division.divisionName}
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
                    
                    <ListItemButton>{division.divisionName}</ListItemButton>
                  </ListItem>
                ))}
              </List>
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
                Update Division
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
                <label style={{ textAlign: "left" }}>Enter Division</label>

                <input
                  defaultValue={
                    selectedDivision && selectedDivision.divisionName
                  }
                  type="text"
                  className="input-pillar animate__animated animate__bounceIn"
                  ref={divisionUpdateRef}
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
      </div>
    </div>
    </>
  );
};

export default AddDivision;
