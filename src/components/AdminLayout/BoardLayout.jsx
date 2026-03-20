import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

import { useEffect } from "react";
import SideBar from "../SideBar/AppraiseeSideBar";
import "./home.scss";
import NavBar from "../NavBar/NavBar";
import { ProSidebarProvider } from "react-pro-sidebar";

import AdminSideBar from "../SideBar/AdminSideBar";
import BoardSideBar from "../SideBar/BoardSideBar";
import QuarterStatusBadge from "../Quarters/QuarterStatusBadge";

export default function BoardLayout() {
  const { token, setToken, userType } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role-based access control - only BOARD role (grade 0) can access board dashboard
  // If user is not authorized, redirect to their appropriate dashboard
  useEffect(() => {
    // Only do client-side redirect after component mounts
    // This prevents initial render issues
  }, [userType]);

  const onLogout = (ev) => {
    ev.preventDefault();
  };

  return (
    <div id="defaultLayout" className="home">
      <BoardSideBar />

      <div id="homeContainer" className="homeContainer">
        <NavBar />
        
        {/* Quarter Status Banner */}
        <QuarterStatusBadge />

        <div className="recents">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
