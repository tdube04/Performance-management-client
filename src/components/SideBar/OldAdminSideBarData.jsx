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
