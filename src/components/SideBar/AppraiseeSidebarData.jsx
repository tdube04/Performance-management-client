import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const AppraiseeSidebarData = [
  {
    title: (
      <span style={{ color: "#A6990D" }}>
        <strong>APPRAISEE VIEW</strong>
      </span>
    ),
    path: "",
    icon: <AiIcons.AiFillHome style={{ color: '#A6990D' }} />,
    subNav: [],
  },
  {
    title: "Notifications",
    path: "/my-notifications",
    icon: <AiIcons.AiOutlineBell />,
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
  // {
  //   title: "Evaluator View",
  //   path: "",
  //   icon: <FaIcons.FaEnvelopeOpenText />,

  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: "Evaluate Result Scorecards",
  //       path: "/appraisee-result-scorecard-pending-approval",
  //       icon: <IoIcons.IoIosPaper />,
  //       cName: "sub-nav",
  //     },
  //     {
  //       title: "Evaluate Work Plans",
  //       path: "/appraisee-result-scorecard-pending-approval",
  //       icon: <IoIcons.IoIosPaper />,
  //       cName: "sub-nav",
  //     }
  //   ],
  // },
];

