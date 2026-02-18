import React, { useState, useEffect, useMemo } from "react";
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
import useQuarterNavigationStatus from "../../hooks/useQuarterNavigationStatus";

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

  // Use the quarter navigation status hook
  const { hasOpenQuarter, currentQuarterStatus, canCreateWorkplan, workplanStatus, loading: quarterLoading } = useQuarterNavigationStatus(userName);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
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

  // Function to filter sidebar data based on quarter status and workplan status
  const filterSidebarData = (data) => {
    if (!data) return [];
    
    const isGrade1 = profileData?.grade === "1";
    const hasAppraisees = profileData?.apprainees?.length > 0 || profileData?.appraisees?.length > 0;
    
    return data.map(item => {
      // Handle subNav items
      if (item.subNav && item.subNav.length > 0) {
        const filteredSubNav = item.subNav.map(subItem => {
          // Filter "Create Work Plan" based on quarter and workplan status
          if (subItem.title === "Create Work Plan") {
            // Only CG (grade 1) can create work plans
            // Can only create if quarter is open AND (no workplan OR workplan was rejected)
            if (!isGrade1) {
              return null; // Hide for non-CG users
            }
            if (!hasOpenQuarter) {
              return null; // Hide when quarter is closed
            }
            if (!canCreateWorkplan && workplanStatus && workplanStatus !== "Rejected") {
              return null; // Hide if workplan exists and is not rejected
            }
            return subItem;
          }
          
          // Filter scorecard items based on workplan approval status
          if (subItem.title?.includes("Scorecard") || subItem.title?.includes("Working Scorecard")) {
            // For scorecards, user needs approved workplan OR no workplan exists
            // If quarter is closed, hide scorecard creation
            if (!hasOpenQuarter && subItem.title === " View Working Scorecard ") {
              return null;
            }
            return subItem;
          }
          
          return subItem;
        }).filter(Boolean); // Remove null entries
        
        // If all subNav items are filtered out, exclude the parent item too
        if (filteredSubNav.length === 0) {
          return null;
        }
        
        return { ...item, subNav: filteredSubNav };
      }
      return item;
    }).filter(Boolean); // Remove null entries
  };

  // Determine base sidebar data
  const baseSidebarData =
  profileData?.grade === "1"
    ? (profileData?.appraisees?.length > 0
        ? AppraiserSidebarData
        : AppraiseeSidebarData)
    : (profileData?.appraisees?.length > 0
        ? AppraiserSidebarData2
        : AppraiseeSidebarData2);

  // Apply filters to sidebar data
  const sidebarData = useMemo(() => filterSidebarData(baseSidebarData), [baseSidebarData, hasOpenQuarter, canCreateWorkplan, workplanStatus, profileData?.grade]);
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
