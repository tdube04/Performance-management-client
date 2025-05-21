import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import Typography from "@material-ui/core/Typography";

export const AppraiserSidebarData2 = [
  {
    title: (
      <span style={{ color: "#A6990D" }}>
        <strong>APPRAISEE VIEW</strong>
      </span>
    ),
    path: "",
    icon: <AiIcons.AiFillHome style={{ color: "#A6990D" }} />,
    // iconClosed: <RiIcons.RiArrowDownSFill />,
    // iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [],
  },
  {
    title: "My Work Plan",
    path: "",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Create Work Plan",
        path: "/createWorkPlan",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "View Work Plan",
        path: "/viewWorkPlan",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
    ],
  },

  {
    title: "Scorecard",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: " View Working Scorecard ",
        path: "/view_Workingscorecard",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Result Scorecard",
        path: "/resultscorecard",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "My Repository",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Previous Workplans",
        path: "/previousworkplans",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Previous Scorecards",
        path: "/previousscorecards",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "My Appraisees",
    path: "",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
     
      {
        title: "View Appraisees",
        path: "/allirbms",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Add Appraisee",
        path: "/add-appraisee",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
     
    ],
   
  },

  { title: <hr style={{ width: "200px" }} /> },

  {
    title: (
      <span style={{ color: "#A6990D" }}>
        <strong>APPRAISER VIEW</strong>
      </span>
    ),
    path: "",

    icon: <AiIcons.AiFillHome style={{ color: "#A6990D" }} />,
    // iconClosed: <RiIcons.RiArrowDownSFill />,
    // iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [],
  },
  
  {
    title: "Appraisee Workplans",
    path: "",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      // {
      //   title: "Completed",
      //   path: "/completed",
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: "sub-nav",
      // },

      {
        title: "Pending Approval Workplans",
        path: "/underreview",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Approved Workplans",
        path: "/approved",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Rejected Workplans",
        path: "/rejected",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      // {
      //   title: "All IRBMS",
      //   path: "/allirbms",
      //   icon: <IoIcons.IoIosPaper />,
      //   cName: "sub-nav",
      // },
    ],
  },

  {
    title: "Results Scorecards",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Pending Results Scorecard ",
        path: "/appraisee-result-scorecard-pending-approval",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Approved Results Scorecard ",
        path: "/approved-appraisee-results-scorecard",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Rejected Results Scorecard ",
        path: "/rejected-appraisee-results-scorecard",
        icon: <IoIcons.IoMdPeople />,
      },
    ],
  },
  { title: <hr style={{ width: "200px" }} /> },

  {
    title: (
      <span style={{ color: "#A6990D" }}>
        <strong>EVALUATOR VIEW</strong>
      </span>
    ),
    path: "",

    icon: <AiIcons.AiFillHome style={{ color: "#A6990D" }} />,
    // iconClosed: <RiIcons.RiArrowDownSFill />,
    // iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [],
  },
  
  {
    title: "Submitted Result Scorecards",
    path: "",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [

      {
        title: "Final Results Scorecards",
        path: "/final-results-scorecards",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      
    ],
  },


];
