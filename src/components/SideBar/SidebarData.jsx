import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "ADMIN Dashboard",
    path: "/admin",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    // subNav: [
    //   {
    //     title: 'Users',
    //     path: '',
    //     icon: <IoIcons.IoIosPaper />
    //   },
    //   {
    //     title: 'Revenue',
    //     path: '',
    //     icon: <IoIcons.IoIosPaper />
    //   }
    // ]
  },
  // {
  //   title: "National Pillars",
  //   path: "",
  //   icon: <IoIcons.IoIosPaper />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: "Add Pillars",
  //       path: "/admin/addPillars",
  //       icon: <IoIcons.IoIosPaper />,
  //       cName: "sub-nav",
  //     },
  //     {
  //       title: "View Pillars",
  //       path: "/admin/viewPillars",
  //       icon: <IoIcons.IoIosPaper />,
  //       cName: "sub-nav",
  //     },
  //     {
  //       title: "Select Current Year Pillar(s)",
  //       path: "/admin/currentYearPillars",
  //       icon: <IoIcons.IoIosPaper />,
  //     },
  //   ],
  // },

  {
    title: "Create Workplan Template",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Add Performance",
        path: "/admin/add-performance-area",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: " View Perfomance",
        path: "/admin/performanceAreas",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Add Programs",
        path: "/admin/addOutcomes",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Divisions",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Manage / Add Divisions",
        path: "/admin/addDivision",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Add Sections",
        path: "/admin/addSection",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "View Divisions",
        path: "/admin/viewDivisions",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Manage Quarters",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Add Quarter Allowable Days ",
        path: "/admin/save-quarter",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Close Evaluation Period",
        path: "/admin/close-quarter-evaluation-period",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Open Evaluation Period",
        path: "/admin/open-quarter-evaluation-period",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Manage Ratios",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Add Formular",
        path: "/admin/add-accounting-ratios",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "View Accounting Ratios",
        path: "/admin/view-all-accounting-ratios",
        icon: <IoIcons.IoMdPeople />,
      },
    ],
  },
  {
    title: "Manage Users Roles",
    path: "",
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Upadate User Role",
        path: "/admin/update-user-role",
        icon: <IoIcons.IoMdPeople />,
      },
      
    ],
  },
];
