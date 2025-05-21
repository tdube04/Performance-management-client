import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import ViewProfileModal from "../UserProfile/ViewProfileModal";


const NavBar = () => {
  const navigate = useNavigate();
  const {
    userName,
    setUserName,
    userType,
    setUserType,
    token,
    setToken,
  } = useStateContext();

  const [profileData, setProfileData] = useState("");

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

  if (!token) {
    return <Navigate to="/login" />;
  }
  const onLogout = (ev) => {
    ev.preventDefault();

    setToken(null);
    localStorage.removeItem(token);
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo"></span>
          </Link>
        </div>
        <div className="items" style={{ marginTop: -30 }}>
          <div className="item" >
            Welcome: {profileData.name} {""}
            {profileData.surname}
          </div>
          <div className="item">
            <ViewProfileModal />
          </div>

          <div className="item">
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout <ExitToAppIcon className="icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
