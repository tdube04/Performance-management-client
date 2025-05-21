import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

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
  color: #000
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

const AdminSideBar = () => {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#00cc44" }}>
      
          <Logo>
            <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
              <img
                src="/images/zimra.png"
                alt="ZIMRA logo"
                style={{ width: "200px", height: "auto" }}
              />
            </Link>
          </Logo>
       
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
          <NavIcon to='#'>
          <div className="top"> 
          <Link to="/admin/dashboard" style={{ textDecoration: "none" }}> 
            {/* <span className="logo">ZIMRA</span> */} 
            <img 
              src="/images/zimra.png" 
              alt="ZIMRA logo" 
              style={{ width: "200px", height: "auto" }} 
            /> 
          </Link> 
        </div> 
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default AdminSideBar;
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
// import { Sidebar, Menu, MenuItem,SubMenu  } from "react-pro-sidebar";

// const AdminSideBar = () => {

//   return (

//     <div className="sidebar">
//       <div className="top">
//         <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
//           {/* <span className="logo">ZIMRA</span> */}
//           <img
//             src="/images/zimra.png"
//             alt="ZIMRA logo"
//             style={{ width: "200px", height: "auto" }}
//           />
//         </Link>
//       </div>
//       <hr />
//       <div className="center">
//         <ul>
//           <li>
//             <span>ADMIN Dashboard</span>
//           </li>
//           {/* <p className="title1">APPRAISEE VIEW</p> */}
//           <p className="title">National Pillars</p>
//           <Link to="/admin/addPillars" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Add Pillars</span>
//             </li>
//           </Link>
//           <Link to="/admin/viewPillars" style={{ textDecoration: "none" }}>
//             <li>
//               <PersonOutlineIcon className="icon" />

//               <span>View Pillars</span>
//             </li>
//           </Link>

//           <Link
//             to="/admin/currentYearPillars"
//             style={{ textDecoration: "none" }}
//           >
//             <li>
//               <HourglassEmptyIcon className="icon" />
//               <span>Select Current Year Pillar(s)</span>
//             </li>
//           </Link>

//           <p className="title">Create Workplan Template</p>
//           <Link to="/admin/add-performance-area" style={{ textDecoration: "none" }}>
//             <li>
//               <FormatListBulletedIcon className="icon" />
//               <span>Add Performance</span>
//             </li>
//           </Link>
//           <Link to="/admin/addOutcomes" style={{ textDecoration: "none" }}>
//             <li>
//               <FormatListBulletedIcon className="icon" />
//               <span>Add Outcomes</span>
//             </li>
//           </Link>
//           {/* <Link
//             to="/admin/addOutcomes-information"
//             style={{ textDecoration: "none" }}
//           >
//             <li>
//               <FormatListBulletedIcon className="icon" />
//               <span>For Current Year Quarter</span>
//             </li>
//           </Link> */}

//           <p className="title">Divisions</p>

//           <Link to="/admin/addDivision" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Add Division</span>
//             </li>
//           </Link>
//           <Link to="/admin/addSection" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Add Section</span>
//             </li>
//           </Link>

//           <Link to="/admin/viewDivisions" style={{ textDecoration: "none" }}>
//             <li>
//               <CancelIcon className="icon" />
//               <span>View</span>
//             </li>
//           </Link>
//           <p className="title">Create Workplan</p>

//           {/* <Link to="" style={{ textDecoration: "none" }}>
//             <li>
//               <CheckCircleOutlineIcon className="icon" />
//               <span>Add Perfomance</span>
//             </li>
//           </Link> */}

//           <Link to="/admin/performanceAreas" style={{ textDecoration: "none" }}>
//             <li>
//               <CancelIcon className="icon" />
//               <span>View Perfomance</span>
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AdminSideBar;
