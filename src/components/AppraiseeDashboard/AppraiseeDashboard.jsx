import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client.js";
import { useEffect, useState } from "react";
import SideBar from "../SideBar/AppraiseeSideBar";
import "./appraisee.scss";
import NavBar from "../NavBar/NavBar";
import PerformanceArea from "../../Widgets/PerformanceArea";

export default function AppraiseeDashboard() {
  const [performanceAreas, setPerformanceAreas] = useState([]);
  const [profileData, setProfileData] = useState("");

  const {
    userName,
    token,
    userType,
    setUserName,
    setToken,
    setUserType,
  } = useStateContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
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
