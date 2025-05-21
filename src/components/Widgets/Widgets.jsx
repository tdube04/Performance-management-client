import React, { useEffect, useRef, useState } from "react";
import "./widgets.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widgets = ({numberOfStaff}) => {
  return (
    <>
      <div className="widget1">
        <div className="left">
          <span className="title">{numberOfStaff} </span>
          <span className="counter">Total Users</span>
        </div>
      </div>
      <div className="widget2">
        <div className="left">
          <span className="title">30 </span>
          <span className="counter"> Q1 IRBMS</span>
        </div>
      </div>
      <div className="widget3">
        <div className="left">
          <span className="title">24 </span>
          <span className="counter">Rejected</span>
        </div>
      </div>
      
    </>
  );
};

export default Widgets;
