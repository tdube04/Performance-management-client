import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import Typography from "@material-ui/core/Typography";

export const BoardSideBarData = [
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
];
