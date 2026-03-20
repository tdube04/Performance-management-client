import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client.js";
import { useEffect, useState } from "react";
import SideBar from "../SideBar/AppraiseeSideBar";
import "./appraisee.scss";
import NavBar from "../NavBar/NavBar";
import PerformanceArea from "../../Widgets/PerformanceArea";
import QuarterStatusBadge from "../Quarters/QuarterStatusBadge";

export default function AppraiseeDashboard() {
  const [performanceAreas, setPerformanceAreas] = useState([]);
  const [profileData, setProfileData] = useState("");
  const [userGrade, setUserGrade] = useState(null);

  const {
    userName,
    token,
    userType,
    setUserName,
    setToken,
    setUserType,
  } = useStateContext();

  // Role-based access control - only USER role should access this dashboard
  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // If user is logged in as ADMIN, redirect to admin dashboard
    if (userType === "ADMIN") {
      window.location.href = "/admin/dashboard";
      return;
    }
    // If user is logged in as HC, redirect to HC dashboard
    if (userType === "HC") {
      window.location.href = "/hc/dashboard";
      return;
    }
    // If user is logged in as BOARD, redirect to Board dashboard
    // NOTE: Board users should typically log in with board role, but we handle it here too
    if (userType === "BOARD") {
      window.location.href = "/board-dashboard/dashboard";
      return;
    }
  }, [userType, token]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/${userName}`);
        setProfileData(response.data);

        // Redirect Board members (grade 0) to Board Dashboard
        if (response.data.grade === "0") {
          window.location.href = "/board-dashboard/dashboard";
          return;
        }

        console.log(response.data.ec_number);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  return (
    <>
      {userType === "ADMIN" ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <div id="defaultLayout" className="home">
          <SideBar />
          <div id="homeContainer" className="homeContainer">
            <NavBar />
            
            {/* Quarter Status Banner - Shows current quarter status to all users */}
            <QuarterStatusBadge />

            <div className="recents">
              <main>
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
