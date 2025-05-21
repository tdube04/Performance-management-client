import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { AppraiseeSidebarData } from "./AppraiseeSidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { AppraiserSidebarData } from "./AppraiserSidebarData";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { AppraiseeSidebarData2 } from "./AppraiseeSidebarData2";
import { AppraiserSidebarData2 } from "./AppraiserSidebarData2";

const Nav = styled.div`
  background: #15179c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #000;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2rem;
`;
const SidebarNav = styled.nav`
  background: #e8e6e6;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;

  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const AppraiseeSideBar = () => {
  const [sidebar, setSidebar] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const { userName, setUserName } = useStateContext();

  const showSidebar = () => setSidebar(!sidebar);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
        setGrade(response.data.grade);
        console.log(response.data.ec_number);

        console.log(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error or display an error message to the user
      }
    }

    fetchData();
  }, []);

  const sidebarData =
  profileData?.grade === "1"
    ? (profileData?.appraisees?.length > 0
        ? AppraiserSidebarData
        : AppraiseeSidebarData)
    : (profileData?.appraisees?.length > 0
        ? AppraiserSidebarData2
        : AppraiseeSidebarData2);
  return (
    <>
      <IconContext.Provider value={{ color: "#00cc44" }}>
        <Logo>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src="/images/zimra.png"
              alt="ZIMRA logo"
              style={{ width: "200px", height: "auto" }}
            />
          </Link>
        </Logo>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <div className="top">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img
                    src="/images/zimra.png"
                    alt="ZIMRA logo"
                    style={{ width: "200px", height: "auto" }}
                  />
                </Link>
              </div>
            </NavIcon>
            {sidebarData &&
              sidebarData.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default AppraiseeSideBar;

// import "./sidebar.scss";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import StoreIcon from "@mui/icons-material/Store";
// import InsertChartIcon from "@mui/icons-material/InsertChart";
// import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
// import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import ListIcon from "@mui/icons-material/List";
// import CreditScoreIcon from "@mui/icons-material/CreditScore";
// import { Link } from "react-router-dom";
// import AddCardIcon from "@mui/icons-material/AddCard";
// import { useContext } from "react";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import CancelIcon from "@mui/icons-material/Cancel";
// import PendingIcon from "@mui/icons-material/Pending";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

// const SideBar = () => {
//   return (
//     <div className="sidebar">
//       <div className="top">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <img
//             src="/images/zimra.png"
//             alt="ZIMRA logo"
//             style={{ width: "200px", height: "auto", marginTop: "10px" }}
//           />
//         </Link>
//       </div>
//       <hr />
//       <div className="center">
//         <ul>
//           <li>
//             <span>My Dashboard</span>
//           </li>
//           <p className="title1">APPRAISER VIEW</p>
//           <p className="title">View IRBMS</p>
//           <Link to="/allirbms" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>View All Appraisees</span>
//             </li>
//           </Link>
//           <Link to="/completed" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Completed</span>
//             </li>
//           </Link>
//           <Link to="/users" style={{ textDecoration: "none" }}></Link>
//           <Link to="/underreview" style={{ textDecoration: "none" }}>
//             <li>
//               <HourglassEmptyIcon className="icon" />
//               <span>Incomplete</span>
//             </li>
//           </Link>
//           <Link to="/underevaluation" style={{ textDecoration: "none" }}>
//             <li>
//               <AssessmentIcon className="icon" />
//               <span>Pending Evaluation</span>
//             </li>
//           </Link>
//           <Link to="/allirbms" style={{ textDecoration: "none" }}>
//             <li>
//               <FormatListBulletedIcon className="icon" />
//               <span>All IRBMS</span>
//             </li>
//           </Link>
//           <Link to="/add-appraisee" style={{ textDecoration: "none" }}>
//             <li>
//               <FormatListBulletedIcon className="icon" />
//               <span>Add Appraisee</span>
//             </li>
//           </Link>
//           <p className="title">Appraisal Requests</p>
//           <Link to="/approved" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Approved</span>
//             </li>
//           </Link>
//           <Link to="/rejected" style={{ textDecoration: "none" }}>
//             <li>
//               <CancelIcon className="icon" />
//               <span>Rejected</span>
//             </li>
//           </Link>
//           <Link to="/pendingApproval" style={{ textDecoration: "none" }}>
//             <li>
//               <PendingIcon className="icon" />
//               <span>Pending Approval</span>
//             </li>
//           </Link>
//           <hr />
//           <p className="title1">APPRAISEE VIEW</p>
//           <p className="title">My work Plan</p>
//           <Link to="/createWorkPlan" style={{ textDecoration: "none" }}>
//             <li>
//               <AssignmentIcon className="icon" />
//               <span>Create work plan </span>
//             </li>
//           </Link>
//           <Link to="/viewWorkPlan" style={{ textDecoration: "none" }}>
//             <li>
//               <AssignmentIcon className="icon" />
//               <span>View work plan </span>
//             </li>
//           </Link>
//           <p className="title">Scorecard</p>
//           <Link to="/workingscorecard" style={{ textDecoration: "none" }}>
//             <li>
//               <CreditScoreIcon className="icon" />
//               <span>Working Scorecard </span>
//             </li>
//           </Link>
//           <Link to="/view_Workingscorecard" style={{ textDecoration: "none" }}>
//             <li>
//               <CreditScoreIcon className="icon" />
//               <span>View Working Scorecard </span>
//             </li>
//           </Link>{" "}
//           <Link to="/resultscorecard" style={{ textDecoration: "none" }}>
//             <li>
//               <CreditScoreIcon className="icon" />
//               <span>Result Scorecard </span>
//             </li>
//           </Link>
//           <p className="title">My Repository</p>
//           <Link to="/previousworkplans" style={{ textDecoration: "none" }}>
//             <li>
//               <ListIcon className="icon" />
//               <span>Previous Workplans</span>
//             </li>
//           </Link>
//           <Link to="/previousscorecards" style={{ textDecoration: "none" }}>
//             <li>
//               <AddCardIcon className="icon" />
//               <span>Previous Scorecards </span>
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SideBar;
