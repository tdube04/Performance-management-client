import { Link, Navigate, Outlet } from "react-router-dom";
// import { useStateContext } from "../../context/ContextProvider";

import { useEffect } from "react";
// import SideBar from "../SideBar/AppraiseeSideBar";
import "./home.scss";
// import NavBar from "../NavBar/NavBar";
import { ProSidebarProvider } from "react-pro-sidebar";

import AdminSideBar from "../SideBar/AdminSideBar";
import BoardSideBar from "../SideBar/BoardSideBar";

export default function BoardDashboard() {
  const { token, setToken } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
  };

  return (
    <div id="defaultLayout" className="home">
      <BoardSideBar/>

      <div id="homeContainer" className="homeContainer">
        <NavBar />

        <div className="recents">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
