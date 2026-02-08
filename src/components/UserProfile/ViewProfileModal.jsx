import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Typography from "@mui/material/Typography";
import "bootstrap/dist/css/bootstrap.min.css";
import { AttachFile } from "@mui/icons-material";
import Box from "@mui/material/Box";
// import AttachFileIcon from '@mui/icons-material/AttachFile';
import axiosClient from "../../authentication/axios-client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useStateContext } from "../../context/ContextProvider";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useNavigate } from "react-router-dom";

function ViewProfileModal() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
    profileData,
    setProfileData
  } = useStateContext();

  const [ecNumber, setEcNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [division, setDivision] = useState("");
  const [position, setPosition] = useState("");
  const [section, setSection] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
        console.log(response.data.ec_number);
        console.log(response.data);
        // if (response.data.ec_number === null) {
        //   setToken(null);
        //   localStorage.removeItem(token);
        //   localStorage.clear();
        //   window.location.href = "/signup";
        // }
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message to the user
      }
    }

    fetchData();
  }, []);

  const handleUpdateProfile = () => {
    setShow(false);
    navigate("/update-profile", {
      state: {
        profileData,
      },
    });
  };

  //  useEffect(() => {
  //   if (profileData.ec_number === null) {
  //     setToken(null);
  //     localStorage.removeItem(token);
  //     localStorage.clear();
  //     window.location.href = "/SignUp";
  //   }
  // }, [profileData]);

  return (
    <>
      <Typography onClick={handleShow}>
        <AccountCircleIcon />
      </Typography>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        dialogClassName="modal-200w"
      >
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Box
              style={{
                width: 200,
                borderRadius: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="">
                <Typography style={{}}>ABOUT</Typography>
                <br />
                <Col>
                  <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                    FULL NAME:
                  </Typography>
                  <Typography style={{ fontSize: 12 }}>
                    {profileData && profileData.name} {profileData && profileData.surname}
                  </Typography>
                </Col>
              </div>
              <br />
              <Col>
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  EC NUMBER:
                </Typography>
                <Typography style={{ fontSize: 12 }}>
                  {profileData && profileData.ec_number}
                </Typography>
              </Col>
              <br />
              <Col>
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  EMAIL:
                </Typography>
                <Typography style={{ fontSize: 12 }}>
                  {profileData && profileData.email}
                </Typography>
              </Col>
              <br />
              <Col>
                <Typography style={{ fontWeight: "bold", fontSize: 12 }}>
                  USER ROLE:
                </Typography>
                <Typography style={{ fontSize: 12 }}>
                  {profileData && profileData.userRole}
                </Typography>
              </Col>
            </Box>
            <Box
              style={{
                width: 560,
                borderRadius: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="">
                  <Typography style={{}}>Profile Details</Typography>
                  <hr />
                  <Typography style={{ fontWeight: "bold", fontSize: 13 }}>
                    DETAILS
                  </Typography>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ marginLeft: 10 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 13 }}
                        >
                          Division:
                        </Typography>{" "}
                        <Typography style={{ marginLeft: "10px" }}>
                          {profileData && profileData?.divisionName}
                        </Typography>
                      </div>
                      <br />
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 13 }}
                        >
                          Section:
                        </Typography>
                        <Typography style={{}}>
                          {profileData && profileData?.sectionName}
                        </Typography>
                      </div>
                      <br />
                      <div style={{ display: "flex", alignItems: "center", }}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 13 }}
                        >
                          Position:
                        </Typography>
                        <Typography style={{width:"150px"}}>
                          {profileData && profileData?.positionName}
                        </Typography>
                      </div>
                      <br />
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 13 }}
                        >
                          Grade:
                        </Typography>
                        <Typography style={{}}>{profileData && profileData.grade}</Typography>
                      </div>
                    </div>
                    <div className="new-div">
                      <div style={{ marginLeft: 60 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            style={{ fontWeight: "bold", fontSize: 13, width:"150px"}}
                          >
                            Appraiser Status:
                          </Typography>
                          <Typography style={{ fontSize: 13,width:"100px" }}>
                            {profileData && profileData.appraiser_status}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Row>
          <Box
            style={{
              overflow: "auto",
              marginLeft: -10,
              marginTop: 5,
              width: 757,
              borderRadius: "5px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <List
              sx={{
                width: "500px",
                maxWidth: 560,
                bgcolor: "background.paper",
                position: "relative",

                maxHeight: 200,
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <li>
                <ul>
                  <ListSubheader>{`My Appraisees`}</ListSubheader>
                  {profileData && profileData.appraisees &&
                    profileData.appraisees.map((appraisee, index) => (
                      <ListItem key={`item-${index}`}>
                        <ListItemText primary={appraisee} />
                      </ListItem>
                    ))}
                </ul>
              </li>
            </List>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleUpdateProfile}>
            Edit Details
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewProfileModal;
