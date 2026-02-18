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

export default function AdminLayout() {
  const { token, setToken } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
  };

  return (
    <div id="defaultLayout" className="home">
      {/* <BoardSideBar /> */}
      <AdminSideBar/>

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
